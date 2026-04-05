import { renderPlaybookIndexForPrompt } from '../agents/catalog/playbooks';
import { CATALOG_SPECIALIST_SPECS } from '../agents/catalog/specialists/specs';
import { getCatalogWorkerPrompt, PROMPTS } from '../prompts/prompts';

type PromptEntry = {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildPromptEntries(): PromptEntry[] {
  return [
    {
      id: 'main-agent',
      title: 'ОнлиАссистент',
      subtitle: 'Main system prompt',
      prompt: PROMPTS.MAIN.SYSTEM(),
    },
    {
      id: 'catalog-agent',
      title: 'catalog-agent',
      subtitle: 'Catalog foreman system prompt',
      prompt: PROMPTS.CATALOG_AGENT.SYSTEM(renderPlaybookIndexForPrompt()),
    },
    ...CATALOG_SPECIALIST_SPECS.map((spec) => ({
      id: spec.id,
      title: spec.id,
      subtitle: 'Catalog worker system prompt',
      prompt: getCatalogWorkerPrompt(spec.id),
    })),
  ];
}

export function renderSystemPromptsPage() {
  const entries = buildPromptEntries();
  const cards = entries
    .map((entry, index) => {
      const prompt = escapeHtml(entry.prompt);
      const title = escapeHtml(entry.title);
      const subtitle = escapeHtml(entry.subtitle);
      const searchText = escapeHtml(`${entry.title} ${entry.subtitle} ${entry.prompt}`.toLowerCase());

      return `
        <details class="prompt-card" id="${entry.id}" data-search="${searchText}"${index < 2 ? ' open' : ''}>
          <summary>
            <span class="prompt-meta">
              <span class="prompt-title">${title}</span>
              <span class="prompt-subtitle">${subtitle}</span>
            </span>
            <span class="prompt-stats">${entry.prompt.length.toLocaleString('ru-RU')} chars</span>
          </summary>
          <pre>${prompt}</pre>
        </details>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>System Prompts</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f1e8;
        --panel: rgba(255, 252, 246, 0.92);
        --panel-strong: #fffdf8;
        --text: #1c1917;
        --muted: #5f574f;
        --line: rgba(92, 72, 45, 0.16);
        --accent: #8f3f2b;
        --accent-soft: rgba(143, 63, 43, 0.12);
        --shadow: 0 24px 60px rgba(63, 43, 26, 0.12);
        --radius: 20px;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(143, 63, 43, 0.14), transparent 30%),
          radial-gradient(circle at top right, rgba(80, 113, 91, 0.12), transparent 24%),
          linear-gradient(180deg, #fbf6ee 0%, var(--bg) 100%);
        color: var(--text);
        font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
      }

      .shell {
        width: min(1400px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 24px 0 40px;
      }

      .hero {
        position: sticky;
        top: 12px;
        z-index: 10;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: rgba(255, 249, 240, 0.88);
        backdrop-filter: blur(18px);
        box-shadow: var(--shadow);
      }

      .toolbar {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
      }

      .toolbar input {
        width: 100%;
        padding: 14px 16px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: var(--panel-strong);
        color: var(--text);
        font: inherit;
      }

      .actions {
        display: flex;
        gap: 10px;
      }

      button {
        border: 0;
        border-radius: 14px;
        padding: 0 16px;
        background: var(--text);
        color: #fff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .prompts {
        display: grid;
        gap: 16px;
        margin-top: 20px;
      }

      .prompt-card {
        border: 1px solid var(--line);
        border-radius: var(--radius);
        background: var(--panel);
        box-shadow: var(--shadow);
        overflow: hidden;
      }

      .prompt-card[hidden] {
        display: none;
      }

      .prompt-card summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 20px;
        cursor: pointer;
        list-style: none;
      }

      .prompt-card summary::-webkit-details-marker {
        display: none;
      }

      .prompt-meta {
        display: grid;
        gap: 4px;
      }

      .prompt-title {
        font-size: 20px;
        font-weight: 700;
      }

      .prompt-subtitle,
      .prompt-stats {
        color: var(--muted);
        font-size: 13px;
      }

      .prompt-card pre {
        margin: 0;
        padding: 0 20px 20px;
        border-top: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.55);
        color: #201c1a;
        font-family: "SFMono-Regular", "JetBrains Mono", "Cascadia Code", monospace;
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
      }

      @media (max-width: 820px) {
        .shell {
          width: min(100vw - 20px, 1400px);
          padding-top: 12px;
        }

        .hero {
          top: 8px;
          padding: 16px;
        }

        .toolbar {
          grid-template-columns: 1fr;
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        button {
          min-height: 46px;
        }

        .prompt-card summary {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div class="toolbar">
          <input id="prompt-search" type="search" placeholder="Фильтр по агенту или тексту промпта" aria-label="Фильтр промптов" />
          <div class="actions">
            <button type="button" id="expand-all">Expand all</button>
            <button type="button" id="collapse-all">Collapse all</button>
          </div>
        </div>
      </section>
      <section class="prompts">
        ${cards}
      </section>
    </main>
    <script>
      const promptCards = Array.from(document.querySelectorAll('.prompt-card'));
      const searchInput = document.getElementById('prompt-search');
      const expandAllButton = document.getElementById('expand-all');
      const collapseAllButton = document.getElementById('collapse-all');

      expandAllButton?.addEventListener('click', () => {
        promptCards.forEach((card) => {
          card.open = true;
        });
      });

      collapseAllButton?.addEventListener('click', () => {
        promptCards.forEach((card) => {
          card.open = false;
        });
      });

      searchInput?.addEventListener('input', (event) => {
        const query = String(event.target?.value || '').trim().toLowerCase();

        promptCards.forEach((card) => {
          const haystack = card.dataset.search || '';
          const matches = query.length === 0 || haystack.includes(query);
          card.hidden = !matches;
          if (matches && query.length > 0) {
            card.open = true;
          }
        });
      });
    </script>
  </body>
</html>`;
}
