<script>
  import ActionPalette from './lib/ActionPalette.svelte';
  import CompositionZone from './lib/CompositionZone.svelte';
  import CommandPreview from './lib/CommandPreview.svelte';
  import LanguageSelector from './lib/LanguageSelector.svelte';
  import { appState, clearBlocks } from './lib/stores.svelte.js';
  import { generateFullCommand } from './lib/commands.js';

  let command = $derived(generateFullCommand(appState.blocks, appState.language));
</script>

<div class="app-shell">
  <header class="app-header">
    <div class="header-brand">
      <svg class="header-logo" width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="#2563EB"/>
        <path d="M9 11L6 16L9 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 22H26" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <div>
        <h1 class="header-title">ComandiAmo</h1>
        <p class="header-subtitle">Costruttore visivo di comandi shell</p>
      </div>
    </div>
    <div class="header-actions">
      <LanguageSelector />
      {#if appState.blocks.length > 0}
        <button
          class="clear-btn"
          onclick={clearBlocks}
          aria-label="Rimuovi tutti i blocchi"
          title="Rimuovi tutti i blocchi"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Azzera
        </button>
      {/if}
    </div>
  </header>

  <div class="app-body">
    <ActionPalette />
    <div class="workspace">
      <CompositionZone />
      <footer class="app-footer">
        <CommandPreview />
      </footer>
    </div>
  </div>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
  }

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
    gap: 16px;
    flex-wrap: wrap;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .header-logo {
    flex-shrink: 0;
  }

  .header-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .header-subtitle {
    font-size: 12px;
    color: var(--color-text-muted);
    margin: 0;
    line-height: 1.3;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
    white-space: nowrap;
    min-height: 44px;
  }

  .clear-btn:hover {
    color: var(--color-error);
    border-color: var(--color-error);
    background: color-mix(in srgb, var(--color-error) 5%, transparent);
  }

  .clear-btn:focus-visible {
    outline: 2px solid var(--color-error);
    outline-offset: 2px;
  }

  .app-body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .workspace {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .app-footer {
    border-top: 1px solid var(--color-border);
    padding: 16px 20px;
    background: var(--color-bg);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .app-shell {
      height: auto;
      min-height: 100dvh;
      max-height: none;
    }

    .app-header {
      padding: 12px 16px;
      gap: 10px;
    }

    .header-title {
      font-size: 20px;
    }

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }

    .app-body {
      flex-direction: column;
      overflow: visible;
    }

    .workspace {
      min-height: 400px;
    }

    .app-footer {
      padding: 12px 16px;
    }
  }
</style>
