<script>
  let { block, actionDef, index, onupdate, onremove } = $props();

  function handleDragStart(e) {
    e.dataTransfer.setData('application/x-comandiamo-reorder', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleParamChange(paramName, value, type) {
    const val = type === 'checkbox' ? value : value;
    onupdate(block.id, { [paramName]: val });
  }

  function handleRemove() {
    onremove(block.id);
  }
</script>

<div
  class="block"
  style="--block-color: {actionDef.color}"
  draggable="true"
  ondragstart={handleDragStart}
  role="listitem"
  aria-label="{actionDef.label}, blocco {index + 1}"
>
  <div class="block-header">
    <button class="drag-handle" aria-label="Trascina per riordinare" title="Trascina per riordinare">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="5" cy="3" r="1.5" fill="currentColor"/>
        <circle cx="11" cy="3" r="1.5" fill="currentColor"/>
        <circle cx="5" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="11" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="5" cy="13" r="1.5" fill="currentColor"/>
        <circle cx="11" cy="13" r="1.5" fill="currentColor"/>
      </svg>
    </button>
    <span class="block-color-dot" aria-hidden="true"></span>
    <span class="block-label">{actionDef.label}</span>
    <span class="block-index" aria-label="Passaggio {index + 1}">{index + 1}</span>
    <button
      class="remove-btn"
      onclick={handleRemove}
      aria-label="Rimuovi {actionDef.label}"
      title="Rimuovi blocco"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
  <div class="block-params">
    {#each actionDef.params as param (param.name)}
      <div class="param-row">
        <label for="param-{block.id}-{param.name}" class="param-label">
          {param.label}
        </label>
        {#if param.type === 'checkbox'}
          <label class="checkbox-wrap">
            <input
              type="checkbox"
              id="param-{block.id}-{param.name}"
              checked={block.params[param.name] ?? param.default ?? false}
              onchange={(e) => handleParamChange(param.name, e.target.checked, 'checkbox')}
              class="param-checkbox"
            />
            <span class="checkbox-visual" aria-hidden="true"></span>
            <span class="checkbox-text">{param.label}</span>
          </label>
        {:else}
          <input
            type="text"
            id="param-{block.id}-{param.name}"
            class="param-input"
            placeholder={param.placeholder || ''}
            value={block.params[param.name] ?? ''}
            oninput={(e) => handleParamChange(param.name, e.target.value, 'text')}
          />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .block {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-left: 3px solid var(--block-color);
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.15s;
    user-select: none;
  }

  .block:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .block-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: color-mix(in srgb, var(--block-color) 5%, var(--color-bg));
    border-bottom: 1px solid var(--color-border);
  }

  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    cursor: grab;
    border-radius: 4px;
    padding: 0;
    flex-shrink: 0;
  }

  .drag-handle:hover {
    background: color-mix(in srgb, var(--block-color) 10%, transparent);
    color: var(--block-color);
  }

  .drag-handle:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .block-color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--block-color);
    flex-shrink: 0;
  }

  .block-label {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    flex: 1;
  }

  .block-index {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
    background: var(--color-border);
    border-radius: 4px;
    padding: 1px 6px;
    flex-shrink: 0;
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: 4px;
    padding: 0;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }

  .remove-btn:hover {
    color: var(--color-error);
    background: color-mix(in srgb, var(--color-error) 10%, transparent);
  }

  .remove-btn:focus-visible {
    outline: 2px solid var(--color-error);
    outline-offset: 1px;
  }

  .block-params {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .param-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .param-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .param-input {
    font-family: var(--font-mono);
    font-size: 13px;
    padding: 7px 10px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-bg);
    color: var(--color-text);
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .param-input:focus {
    outline: none;
    border-color: var(--block-color);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--block-color) 15%, transparent);
  }

  .param-input::placeholder {
    color: var(--color-text-muted);
    opacity: 0.5;
  }

  .checkbox-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 0;
  }

  .param-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox-visual {
    width: 18px;
    height: 18px;
    border: 2px solid var(--color-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
  }

  .param-checkbox:checked + .checkbox-visual {
    background: var(--block-color);
    border-color: var(--block-color);
  }

  .param-checkbox:checked + .checkbox-visual::after {
    content: '';
    display: block;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-top: -2px;
  }

  .param-checkbox:focus-visible + .checkbox-visual {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .checkbox-text {
    font-size: 13px;
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    .block-header {
      padding: 8px;
      gap: 6px;
    }

    .block-label {
      font-size: 13px;
    }

    .block-params {
      padding: 8px;
      gap: 6px;
    }

    .param-input {
      font-size: 15px;
      padding: 8px;
    }
  }
</style>
