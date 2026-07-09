<script>
  import { appState, setLanguage } from './stores.svelte.js';

  const languages = [
    { id: 'powershell', label: 'PowerShell', short: 'PS' },
    { id: 'bash', label: 'Bash', short: 'SH' },
    { id: 'cmd', label: 'CMD', short: 'CMD' }
  ];
</script>

<fieldset class="lang-selector" aria-label="Seleziona il linguaggio della shell">
  <legend class="lang-legend">Linguaggio shell</legend>
  <div class="lang-options" role="radiogroup">
    {#each languages as lang (lang.id)}
      <label class="lang-option{appState.language === lang.id ? ' lang-option--active' : ''}">
        <input
          type="radio"
          name="language"
          value={lang.id}
          checked={appState.language === lang.id}
          onchange={() => setLanguage(lang.id)}
          class="lang-radio"
        />
        <span class="lang-badge">{lang.short}</span>
        <span class="lang-label">{lang.label}</span>
      </label>
    {/each}
  </div>
</fieldset>

<style>
  .lang-selector {
    border: none;
    padding: 0;
    margin: 0;
  }

  .lang-legend {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }

  .lang-options {
    display: flex;
    gap: 4px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 3px;
  }

  .lang-option {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-muted);
    transition: background 0.15s, color 0.15s;
    min-height: 44px;
  }

  .lang-option:hover {
    color: var(--color-text);
  }

  .lang-option--active {
    background: var(--color-surface);
    color: var(--color-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .lang-radio {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .lang-radio:focus-visible + .lang-badge {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .lang-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 700;
    background: color-mix(in srgb, currentColor 12%, transparent);
    color: currentColor;
    border-radius: 4px;
    padding: 1px 5px;
    letter-spacing: 0.04em;
  }

  .lang-label {
    font-family: var(--font-body);
    font-size: 13px;
  }

  @media (max-width: 768px) {
    .lang-option {
      padding: 8px 6px;
      gap: 4px;
    }

    .lang-label {
      font-size: 12px;
    }
  }
</style>
