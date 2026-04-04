import { describe, expect, test } from 'bun:test';
import { WORKER_RESULT_TOOL_NAME } from '../../contracts/workerResult';
import { type WorkerTaskEnvelope } from '../../contracts/workerRequest';
import { extractCatalogFinalResult, renderWorkerHandoffMessage } from './catalogWorkerProtocol';

describe('catalogWorkerProtocol', () => {
  test('renders worker handoff as a stable structured message', () => {
    const handoff: WorkerTaskEnvelope = {
      planContext: {
        goal: 'Найти товар и проверить его состояние',
        facts: ['SKU: IPHONE-17-BLK'],
        constraints: ['Не создавать новые сущности'],
      },
      taskInput: {
        objective: 'Найди товар по SKU',
        facts: ['SKU: IPHONE-17-BLK', 'Тип: simple'],
        constraints: ['Только read-only'],
        expectedOutput: 'status, data, missingData',
        contextNotes: 'Нужно ответить пользователю без предположений.',
      },
      upstreamArtifacts: [{ product_id: 101, sku: 'IPHONE-17-BLK' }],
    };

    expect(renderWorkerHandoffMessage(handoff)).toBe(
      [
        'WORKER_HANDOFF',
        '```json',
        JSON.stringify(
          {
            planContext: {
              goal: 'Найти товар и проверить его состояние',
              facts: ['SKU: IPHONE-17-BLK'],
              constraints: ['Не создавать новые сущности'],
            },
            taskInput: {
              objective: 'Найди товар по SKU',
              facts: ['SKU: IPHONE-17-BLK', 'Тип: simple'],
              constraints: ['Только read-only'],
              expectedOutput: 'status, data, missingData',
              contextNotes: 'Нужно ответить пользователю без предположений.',
            },
            upstreamArtifacts: [{ product_id: 101, sku: 'IPHONE-17-BLK' }],
          },
          null,
          2
        ),
        '```',
      ].join('\n')
    );
  });

  test('renders non-json-safe artifacts without throwing', () => {
    const circular: Record<string, unknown> = { label: 'artifact' };
    circular.self = circular;

    const handoff: WorkerTaskEnvelope = {
      planContext: {
        goal: 'Проверить payload',
        facts: [],
        constraints: [],
      },
      taskInput: {
        objective: 'Проверь payload',
        facts: [],
        constraints: [],
        expectedOutput: 'status',
      },
      upstreamArtifacts: [{ callable: function sample() {}, size: BigInt(17), circular }],
    };

    const rendered = renderWorkerHandoffMessage(handoff);

    expect(rendered).toContain('"upstreamArtifacts": [');
    expect(rendered).toContain('"callable": "function sample()');
    expect(rendered).toContain('"size": "17"');
    expect(rendered).toContain('"self": "[Circular]"');
  });

  test('extracts normalized final result only from completed worker result tool runs', () => {
    expect(
      extractCatalogFinalResult({
        toolName: WORKER_RESULT_TOOL_NAME,
        args: {},
        status: 'completed',
        structured: {
          status: 'completed',
          data: ['product_id=101'],
          missingData: [],
          note: 'done',
        },
      }),
    ).toEqual({
      status: 'completed',
      data: ['product_id=101'],
      missingData: [],
      note: 'done',
    });

    expect(
      extractCatalogFinalResult({
        toolName: WORKER_RESULT_TOOL_NAME,
        args: {},
        status: 'failed',
        structured: {
          status: 'completed',
          data: ['product_id=101'],
          missingData: [],
        },
      }),
    ).toBeNull();

    expect(
      extractCatalogFinalResult({
        toolName: 'wc.v3.products_read',
        args: {},
        status: 'completed',
        structured: {
          status: 'completed',
          data: ['product_id=101'],
          missingData: [],
        },
      }),
    ).toBeNull();
  });
});
