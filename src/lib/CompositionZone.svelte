<script>
  import { appState, addBlock, updateBlockParams, removeBlock, moveBlock, actionDefinitions } from './stores.svelte.js';
  import ActionBlock from './ActionBlock.svelte';

  let dragOverIndex = $state(null);
  let dragFromPalette = $state(false);

  function handleDragOver(e) {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt.types.includes('application/x-comandiamo-action')) {
      dt.dropEffect = 'copy';
      dragFromPalette = true;
    } else if (dt.types.includes('application/x-comandiamo-reorder')) {
      dt.dropEffect = 'move';
      dragFromPalette = false;
    }
  }

  function handleDragLeave(e) {
    if (e.currentTarget === e.target) {
      dragOverIndex = null;
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    dragOverIndex = null;
    dragFromPalette = false;
    const dt = e.dataTransfer;
    const actionType = dt.getData('application/x-comandiamo-action');
    if (actionType) {
      addBlock(actionType);
      return;
    }
  }

  function handleBlockDragOver(e, index) {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt.types.includes('application/x-comandiamo-reorder')) {
      dt.dropEffect = 'move';
      dragOverIndex = index;
    }
  }

  function handleBlockDrop(e, targetIndex) {
    e.preventDefault();
    dragOverIndex = null;
    const dt = e.dataTransfer;
    const sourceIndexStr = dt.getData('application/x-comandiamo-reorder');
    if (sourceIndexStr !== '') {
      const sourceIndex = parseInt(sourceIndexStr, 10);
      if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
        moveBlock(sourceIndex, targetIndex);
      }
    }
  }
</script>

<main class="composition" aria-label="Zona di composizione comandi">
  {#if appState.blocks.length === 0}
    <div class="empty-state">
      <svg class="empty-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="36" height="32" rx="4" stroke="currentColor" stroke-width="2"/>
        <path d="M18 22L22 26L30 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 16h36" stroke="currentColor" stroke-width="2"/>
      </svg>
      <h3 class="empty-title">Nessun blocco nella composizione</h3>
      <p class="empty-text">Trascina qui un'azione dalla palette qui a fianco, oppure clicca su un'azione per aggiungerla alla sequenza.</p>
    </div>
  {:else}
    <div
      class="block-list"
      role="list"
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
    >
      {#each appState.blocks as block, index (block.id)}
        {@const actionDef = actionDefinitions[block.actionType]}
        <div
          class="block-wrapper"
          class:drop-target={dragOverIndex === index}
          role="group"
          aria-label="Posizione blocco {index + 1}"
          ondragover={(e) => handleBlockDragOver(e, index)}
          ondragleave={() => { dragOverIndex = null; }}
          ondrop={(e) => handleBlockDrop(e, index)}
        >
          <ActionBlock
            {block}
            {actionDef}
            index={index}
            onupdate={(id, params) => updateBlockParams(id, params)}
            onremove={(id) => removeBlock(id)}
          />
        </div>
      {/each}
      {#if dragFromPalette}
        <div class="drop-indicator">
          <span>Rilascia per aggiungere in coda</span>
        </div>
      {/if}
    </div>
  {/if}
</main>

<style>
  .composition {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    min-height: 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 300px;
    text-align: center;
    gap: 12px;
    padding: 40px 20px;
  }

  .empty-icon {
    color: var(--color-text-muted);
    opacity: 0.4;
    margin-bottom: 8px;
  }

  .empty-title {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  .empty-text {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-muted);
    max-width: 360px;
    margin: 0;
  }

  .block-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 100%;
    padding: 4px;
    border-radius: 12px;
    border: 2px dashed var(--color-border);
    transition: border-color 0.2s, background 0.2s;
  }

  .block-list:hover {
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 2%, transparent);
  }

  .block-wrapper {
    border-radius: 8px;
    transition: box-shadow 0.15s;
  }

  .block-wrapper.drop-target {
    box-shadow: 0 0 0 2px var(--color-primary), 0 4px 12px rgba(37, 99, 235, 0.2);
  }

  .drop-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border: 2px dashed var(--color-primary);
    border-radius: 8px;
    background: color-mix(in srgb, var(--color-primary) 8%, transparent);
    color: var(--color-primary);
    font-size: 13px;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .composition {
      padding: 12px;
      min-height: 200px;
    }

    .empty-state {
      min-height: 200px;
      padding: 24px 16px;
    }

    .block-list {
      gap: 6px;
      padding: 2px;
    }
  }
</style>
