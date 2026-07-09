<script>
  import { actionList, addBlock } from './stores.svelte.js';

  function handleDragStart(e, actionId) {
    e.dataTransfer.setData('application/x-comandiamo-action', actionId);
    e.dataTransfer.effectAllowed = 'copy';
  }

  function handleClick(actionId) {
    addBlock(actionId);
  }

  function handleKeyDown(e, actionId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addBlock(actionId);
    }
  }
</script>

<aside class="palette" aria-label="Azioni disponibili">
  <h2 class="palette-title">Azioni</h2>
  <p class="palette-subtitle">Trascina un'azione nell'area di composizione o cliccala per aggiungerla</p>
  <div class="palette-list" role="list">
    {#each actionList as action (action.id)}
      <div role="listitem">
      <button
        class="action-card"
        draggable="true"
        aria-label="{action.label} — {action.description}"
        title="{action.description}"
        style="--action-color: {action.color}"
        ondragstart={(e) => handleDragStart(e, action.id)}
        onclick={() => handleClick(action.id)}
        onkeydown={(e) => handleKeyDown(e, action.id)}
      >
        <span class="action-dot" aria-hidden="true"></span>
        <span class="action-label">{action.label}</span>
        <svg class="action-drag-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="5" cy="4" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="4" r="1.5" fill="currentColor"/>
          <circle cx="5" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="12" r="1.5" fill="currentColor"/>
        </svg>
      </button>
      </div>
    {/each}
  </div>
</aside>

<style>
  .palette {
    background: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: 20px 16px;
    min-width: 260px;
    max-width: 280px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .palette-title {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0;
  }

  .palette-subtitle {
    font-size: 13px;
    line-height: 1.5;
    color: var(--color-text-muted);
    margin: 0;
  }

  .palette-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: grab;
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--color-text);
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    width: 100%;
    text-align: left;
    user-select: none;
  }

  .action-card:hover {
    border-color: var(--action-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--action-color) 15%, transparent);
    transform: translateY(-1px);
  }

  .action-card:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-color: var(--color-primary);
  }

  .action-card:active {
    cursor: grabbing;
    transform: scale(0.98);
  }

  .action-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--action-color);
    flex-shrink: 0;
  }

  .action-label {
    flex: 1;
    font-weight: 500;
  }

  .action-drag-icon {
    color: var(--color-text-muted);
    flex-shrink: 0;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .palette {
      min-width: unset;
      max-width: unset;
      border-right: none;
      border-bottom: 1px solid var(--color-border);
      padding: 16px;
      flex-shrink: 0;
    }

    .palette-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 6px;
    }

    .action-card {
      font-size: 13px;
      padding: 8px 10px;
    }

    .action-drag-icon {
      display: none;
    }
  }
</style>
