import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const AGENTS_ROOT = join(process.cwd(), 'src', 'agents');

function walk(dir: string): string[] {
  const result: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      result.push(...walk(fullPath));
      continue;
    }
    if (fullPath.endsWith('.ts') && !fullPath.endsWith('.test.ts')) {
      result.push(fullPath);
    }
  }
  return result;
}

function getRelativeImports(filePath: string): string[] {
  const source = readFileSync(filePath, 'utf8');
  const matches = source.matchAll(/^import\s+(?:type\s+)?(?:[^'"\n]+?from\s+)?['"]([^'"]+)['"]/gm);
  return [...matches]
    .map((match) => match[1])
    .filter((value): value is string => typeof value === 'string' && value.startsWith('.'));
}

describe('agents architecture boundaries', () => {
  test('shared does not import catalog modules', () => {
    const sharedFiles = walk(join(AGENTS_ROOT, 'shared'));
    for (const filePath of sharedFiles) {
      const relativePath = relative(AGENTS_ROOT, filePath);
      for (const specifier of getRelativeImports(filePath)) {
        expect(`${relativePath} -> ${specifier}`).not.toContain('catalog/');
      }
    }
  });

  test('main nodes do not import main graphs', () => {
    const nodeFiles = walk(join(AGENTS_ROOT, 'main', 'nodes'));
    for (const filePath of nodeFiles) {
      const relativePath = relative(AGENTS_ROOT, filePath);
      for (const specifier of getRelativeImports(filePath)) {
        expect(`${relativePath} -> ${specifier}`).not.toContain('../graphs/');
      }
    }
  });

  test('catalog foreman tool definitions do not import knowledge modules', () => {
    const toolDefinitionFiles = walk(join(AGENTS_ROOT, 'catalog', 'foreman', 'tools', 'definitions'));
    for (const filePath of toolDefinitionFiles) {
      const relativePath = relative(AGENTS_ROOT, filePath);
      for (const specifier of getRelativeImports(filePath)) {
        expect(`${relativePath} -> ${specifier}`).not.toContain('catalogWorkerKnowledge');
      }
    }
  });
});
