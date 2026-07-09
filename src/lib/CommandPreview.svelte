<script>
  import { appState } from './stores.svelte.js';
  import { generateFullCommand, getLanguageExtension } from './commands.js';

  let command = $derived(generateFullCommand(appState.blocks, appState.language));

  let copySuccess = $state(false);

  async function handleCopy() {
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
      copySuccess = true;
      setTimeout(() => { copySuccess = false; }, 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copySuccess = true;
      setTimeout(() => { copySuccess = false; }, 2000);
    }
  }
</script>

<section class="preview-section" aria-label="Anteprima del comando generato">
  <div class="preview-header">
    <h2 class="preview-title">Anteprima comando</h2>
    <span class="preview-lang">{appState.language === 'powershell' ? 'PowerShell' : appState.language === 'bash' ? 'Bash' : 'CMD'}</span>
    <span class="preview-ext">{getLanguageExtension(appState.language)}</span>
  </div>
  <div class="terminal" aria-label="Comando generato" aria-live="polite">
    <div class="terminal-bar" aria-hidden="true">
      <span class="terminal-dot terminal-dot--red"></span>
      <span class="terminal-dot terminal-dot--yellow"></span>
      <span class="terminal-dot terminal-dot--green"></span>
      <span class="terminal-bar-title">terminale — {appState.language}</span>
    </div>
    <div class="terminal-body">
      {#if command}
        <pre class="terminal-code"><code>{command}</code><span class="terminal-cursor" aria-hidden="true">▊</span></pre>
      {:else}
        <pre class="terminal-code terminal-code--empty"><code># Il comando apparirà qui man mano che aggiungi blocchi...</code></pre>
      {/if}
    </div>
  </div>
  <button
    class="copy-btn"
    onclick={handleCopy}
    disabled={!command}
    aria-label={copySuccess ? 'Copiato!' : 'Copia il comando negli appunti'}
  >
    {#if copySuccess}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Copiato!
    {:else}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M3 11V3a1 1 0 011-1h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Copia negli appunti
    {/if}
  </button>
</section>

<style>
  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .preview-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .preview-title {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0;
  }

  .preview-lang {
    font-size: 11px;
    font-weight: 600;
    color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    border-radius: 4px;
    padding: 1px 8px;
  }

  .preview-ext {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
  }

  .terminal {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #334155;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .terminal-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #0F172A;
    border-bottom: 1px solid #1E293B;
  }

  .terminal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .terminal-dot--red { background: #EF4444; }
  .terminal-dot--yellow { background: #F59E0B; }
  .terminal-dot--green { background: #10B981; }

  .terminal-bar-title {
    font-family: var(--font-body);
    font-size: 11px;
    color: #64748B;
    margin-left: 8px;
  }

  .terminal-body {
    background: #1E293B;
    padding: 14px 16px;
    min-height: 60px;
  }

  .terminal-code {
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.65;
    color: #E2E8F0;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .terminal-code--empty {
    color: #64748B;
  }

  .terminal-cursor {
    display: inline-block;
    color: #38BDF8;
    animation: blink 1s step-end infinite;
    font-weight: 400;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .terminal-cursor {
      animation: none;
      opacity: 1;
    }
  }

  .copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    align-self: flex-start;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    min-height: 44px;
  }

  .copy-btn:hover:not(:disabled) {
    background: #1D4ED8;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }

  .copy-btn:active:not(:disabled) {
    transform: scale(0.97);
  }

  .copy-btn:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .copy-btn:disabled {
    background: var(--color-border);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .terminal-code {
      font-size: 13px;
    }

    .copy-btn {
      align-self: stretch;
    }
  }
</style>
