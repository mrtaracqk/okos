import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import Redis from 'ioredis';
import { CHAT_CONFIG, REDIS_URL } from '../config';
import { formatLocaleDateTime } from '../utils';

export interface ChatState {
  messages: BaseMessage[];
  chatId?: number;
}

export class RedisService {
  private client: Redis;
  private static redisConnection: Redis;
  private static bullMQRedisConnection: Redis;
  private readonly messagesPrefix = 'messages:';
  private readonly authorizedUsersKey = 'authorized_users';

  constructor() {
    if (!RedisService.redisConnection) {
      RedisService.redisConnection = new Redis(REDIS_URL);
    }
    this.client = RedisService.redisConnection;
  }

  /**
   * Get the Redis connection for use with BullMQ
   */
  public static getBullMQConnection(): Redis {
    if (!RedisService.bullMQRedisConnection) {
      RedisService.bullMQRedisConnection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
    }
    return RedisService.bullMQRedisConnection;
  }

  private getMessagesKey(chatId: number): string {
    return `${this.messagesPrefix}${chatId}`;
  }

  /**
   * Save a human message to Redis
   */
  async saveHumanMessage(chatId: number, content: string): Promise<void> {
    try {
      const message = {
        type: 'human',
        content,
        timestamp: Date.now(),
      };
      await this.client.rpush(this.getMessagesKey(chatId), JSON.stringify(message));
      await this.trimMessages(chatId);
    } catch (error) {
      console.error('Error saving human message:', error);
    }
  }

  /**
   * Save an AI message to Redis
   */
  async saveAIMessage(chatId: number, content: string): Promise<void> {
    try {
      const message = {
        type: 'ai',
        content,
        timestamp: Date.now(),
      };
      await this.client.rpush(this.getMessagesKey(chatId), JSON.stringify(message));
      await this.trimMessages(chatId);
    } catch (error) {
      console.error('Error saving AI message:', error);
    }
  }

  /**
   * Trim the message history to the specified limit
   */
  private async trimMessages(chatId: number): Promise<void> {
    try {
      const messagesKey = this.getMessagesKey(chatId);
      const length = await this.client.llen(messagesKey);
      if (length > CHAT_CONFIG.messagesToKeep) {
        await this.client.ltrim(messagesKey, length - CHAT_CONFIG.messagesToKeep, -1);
      }
    } catch (error) {
      console.error('Error trimming messages:', error);
    }
  }

  /**
   * Get all messages for a chat
   */
  async getMessages(chatId: number): Promise<BaseMessage[]> {
    try {
      const messagesKey = this.getMessagesKey(chatId);
      const rawMessages = await this.client.lrange(messagesKey, 0, -1);

      return rawMessages.map((rawMessage) => {
        const message = JSON.parse(rawMessage);
        if (message.type === 'human') {
          return new HumanMessage(
            message.content + `\n\n[metadata.sentAt: ${formatLocaleDateTime(new Date(message.timestamp))}]`
          );
        } else if (message.type === 'ai') {
          return new AIMessage(message.content);
        }
        // Default to human message if type is unknown
        return new HumanMessage(
          message.content + `\n\n[metadata.sentAt: ${formatLocaleDateTime(new Date(message.timestamp))}]`
        );
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Get the chat state for a chat
   */
  async getState(chatId: number): Promise<ChatState | null> {
    try {
      const messages = await this.getMessages(chatId);
      if (messages.length === 0) {
        return null;
      }

      return {
        messages,
        chatId,
      };
    } catch (error) {
      console.error('Error getting state:', error);
      return null;
    }
  }

  /**
   * Clear all messages for a chat
   */
  async clearMessages(chatId: number): Promise<void> {
    try {
      await this.client.del(this.getMessagesKey(chatId));
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  }

  /**
   * Clear all data for a chat
   */
  async clearAll(chatId: number, onlyMessages: boolean = false): Promise<void> {
    try {
      await this.client.del(this.getMessagesKey(chatId));
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  /**
   * Check if a user is authorized
   */
  async isUserAuthorized(username: string): Promise<boolean> {
    try {
      if (!username) return false;
      return await this.client.sismember(this.authorizedUsersKey, username) === 1;
    } catch (error) {
      console.error('Error checking user authorization:', error);
      return false;
    }
  }

  /**
   * Add a user to the authorized users list
   */
  async addAuthorizedUser(username: string): Promise<void> {
    try {
      if (!username) return;
      await this.client.sadd(this.authorizedUsersKey, username);
    } catch (error) {
      console.error('Error adding authorized user:', error);
    }
  }

  /**
   * Remove a user from the authorized users list
   */
  async removeAuthorizedUser(username: string): Promise<void> {
    try {
      if (!username) return;
      await this.client.srem(this.authorizedUsersKey, username);
    } catch (error) {
      console.error('Error removing authorized user:', error);
    }
  }

  /**
   * Get all authorized users
   */
  async getAuthorizedUsers(): Promise<string[]> {
    try {
      return await this.client.smembers(this.authorizedUsersKey);
    } catch (error) {
      console.error('Error getting authorized users:', error);
      return [];
    }
  }
}
