import { describe, expect, it } from 'bun:test';
import {
  getTelegramRequestContext,
  runWithTelegramRequestContext,
  type TelegramRequestContext,
} from './request-context';

describe('telegram request context', () => {
  it('returns undefined outside of the async local scope', () => {
    expect(getTelegramRequestContext()).toBeUndefined();
  });

  it('exposes the current request context inside the scope', async () => {
    const context: TelegramRequestContext = {
      chatId: 101,
      telegramUserId: 202,
      telegramUsername: 'operator',
    };

    const result = await runWithTelegramRequestContext(context, async () => {
      await Promise.resolve();
      return getTelegramRequestContext();
    });

    expect(result).toEqual(context);
    expect(getTelegramRequestContext()).toBeUndefined();
  });

  it('restores the outer context after nested scopes', async () => {
    const outerContext: TelegramRequestContext = {
      chatId: 1,
      telegramUserId: 2,
    };
    const innerContext: TelegramRequestContext = {
      chatId: 3,
      telegramUserId: 4,
      telegramUsername: 'inner',
    };

    await runWithTelegramRequestContext(outerContext, async () => {
      expect(getTelegramRequestContext()).toEqual(outerContext);

      await runWithTelegramRequestContext(innerContext, async () => {
        expect(getTelegramRequestContext()).toEqual(innerContext);
      });

      expect(getTelegramRequestContext()).toEqual(outerContext);
    });
  });
});
