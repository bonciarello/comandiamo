export const appState = $state({
  blocks: [],
  language: 'powershell'
});

let nextId = 1;

export function addBlock(actionType) {
  const defaults = {};
  const action = actionDefinitions[actionType];
  if (action) {
    for (const param of action.params) {
      defaults[param.name] = param.default ?? '';
    }
  }
  appState.blocks = [...appState.blocks, {
    id: nextId++,
    actionType,
    params: { ...defaults }
  }];
}

export function removeBlock(id) {
  appState.blocks = appState.blocks.filter(b => b.id !== id);
}

export function updateBlockParams(id, params) {
  appState.blocks = appState.blocks.map(b =>
    b.id === id ? { ...b, params: { ...b.params, ...params } } : b
  );
}

export function moveBlock(fromIndex, toIndex) {
  const blocks = [...appState.blocks];
  const [removed] = blocks.splice(fromIndex, 1);
  blocks.splice(toIndex, 0, removed);
  appState.blocks = blocks;
}

export function clearBlocks() {
  appState.blocks = [];
}

export function setLanguage(lang) {
  appState.language = lang;
}

export const actionDefinitions = {
  'copy-file': {
    id: 'copy-file',
    label: 'Copia file',
    description: 'Copia un file da un percorso a un altro',
    color: '#2563EB',
    params: [
      { name: 'source', label: 'Percorso origine', type: 'path', placeholder: 'C:\\Utenti\\Mario\\documento.pdf' },
      { name: 'destination', label: 'Percorso destinazione', type: 'path', placeholder: 'D:\\Backup\\documento.pdf' }
    ]
  },
  'delete-folder': {
    id: 'delete-folder',
    label: 'Elimina cartella',
    description: 'Elimina una cartella e tutto il suo contenuto',
    color: '#DC2626',
    params: [
      { name: 'path', label: 'Percorso cartella', type: 'path', placeholder: 'C:\\Temp\\vecchi-file' }
    ]
  },
  'rename-file': {
    id: 'rename-file',
    label: 'Rinomina file',
    description: 'Cambia il nome di un file esistente',
    color: '#7C3AED',
    params: [
      { name: 'oldName', label: 'Nome attuale', type: 'path', placeholder: 'C:\\Documenti\\vecchio-nome.txt' },
      { name: 'newName', label: 'Nuovo nome', type: 'text', placeholder: 'nuovo-nome.txt' }
    ]
  },
  'create-directory': {
    id: 'create-directory',
    label: 'Crea directory',
    description: 'Crea una nuova cartella nel percorso specificato',
    color: '#059669',
    params: [
      { name: 'path', label: 'Percorso nuova cartella', type: 'path', placeholder: 'C:\\Progetti\\nuova-cartella' }
    ]
  },
  'move-file': {
    id: 'move-file',
    label: 'Sposta file',
    description: 'Sposta un file da una posizione a un\'altra',
    color: '#D97706',
    params: [
      { name: 'source', label: 'Percorso origine', type: 'path', placeholder: 'C:\\Download\\file.zip' },
      { name: 'destination', label: 'Percorso destinazione', type: 'path', placeholder: 'C:\\Archivio\\file.zip' }
    ]
  },
  'list-files': {
    id: 'list-files',
    label: 'Elenca file',
    description: 'Mostra l\'elenco dei file in una directory',
    color: '#0891B2',
    params: [
      { name: 'path', label: 'Percorso directory', type: 'path', placeholder: 'C:\\Documenti' },
      { name: 'recursive', label: 'Includi sottocartelle', type: 'checkbox', default: false }
    ]
  },
  'change-permissions': {
    id: 'change-permissions',
    label: 'Modifica permessi',
    description: 'Cambia i permessi di accesso a un file o cartella',
    color: '#4F46E5',
    params: [
      { name: 'path', label: 'Percorso file/cartella', type: 'path', placeholder: 'C:\\Script\\deploy.sh' },
      { name: 'mode', label: 'Permessi', type: 'text', placeholder: 'bash: 755 — PowerShell/CMD: Utenti:(R)' }
    ]
  },
  'compress-folder': {
    id: 'compress-folder',
    label: 'Comprimi cartella',
    description: 'Crea un archivio compresso da una cartella',
    color: '#DB2777',
    params: [
      { name: 'source', label: 'Cartella da comprimere', type: 'path', placeholder: 'C:\\Progetti\\mio-progetto' },
      { name: 'destination', label: 'File archivio', type: 'path', placeholder: 'C:\\Backup\\mio-progetto.zip' }
    ]
  }
};

export const actionList = Object.values(actionDefinitions);
