const templates = {
  powershell: {
    'copy-file': (p) => `Copy-Item -Path "${p.source || '...'}" -Destination "${p.destination || '...'}"`,
    'delete-folder': (p) => `Remove-Item -Path "${p.path || '...'}" -Recurse -Force`,
    'rename-file': (p) => `Rename-Item -Path "${p.oldName || '...'}" -NewName "${p.newName || '...'}"`,
    'create-directory': (p) => `New-Item -Path "${p.path || '...'}" -ItemType Directory`,
    'move-file': (p) => `Move-Item -Path "${p.source || '...'}" -Destination "${p.destination || '...'}"`,
    'list-files': (p) => {
      const base = `Get-ChildItem -Path "${p.path || '...'}"`;
      return p.recursive ? `${base} -Recurse` : base;
    },
    'change-permissions': (p) => `icacls "${p.path || '...'}" /grant "${p.mode || '...'}"`,
    'compress-folder': (p) => `Compress-Archive -Path "${p.source || '...'}" -DestinationPath "${p.destination || '...'}"`
  },
  bash: {
    'copy-file': (p) => `cp "${p.source || '...'}" "${p.destination || '...'}"`,
    'delete-folder': (p) => `rm -rf "${p.path || '...'}"`,
    'rename-file': (p) => `mv "${p.oldName || '...'}" "${p.newName || '...'}"`,
    'create-directory': (p) => `mkdir -p "${p.path || '...'}"`,
    'move-file': (p) => `mv "${p.source || '...'}" "${p.destination || '...'}"`,
    'list-files': (p) => {
      const base = `ls ${p.recursive ? '-R ' : ''}"${p.path || '...'}"`;
      return base;
    },
    'change-permissions': (p) => `chmod ${p.mode || '...'} "${p.path || '...'}"`,
    'compress-folder': (p) => `tar -czf "${p.destination || '...'}" -C "$(dirname "${p.source || '...'}")" "$(basename "${p.source || '...'}")"`
  },
  cmd: {
    'copy-file': (p) => `copy "${p.source || '...'}" "${p.destination || '...'}"`,
    'delete-folder': (p) => `rmdir /s /q "${p.path || '...'}"`,
    'rename-file': (p) => `ren "${p.oldName || '...'}" "${p.newName || '...'}"`,
    'create-directory': (p) => `mkdir "${p.path || '...'}"`,
    'move-file': (p) => `move "${p.source || '...'}" "${p.destination || '...'}"`,
    'list-files': (p) => {
      const base = `dir "${p.path || '...'}"`;
      return p.recursive ? `${base} /s` : base;
    },
    'change-permissions': (p) => `icacls "${p.path || '...'}" /grant "${p.mode || '...'}"`,
    'compress-folder': (p) => `tar -czf "${p.destination || '...'}" -C "$(dirname "${p.source || '...'}")" "$(basename "${p.source || '...'}")"`
  }
};

export function generateCommand(block, language) {
  const fn = templates[language]?.[block.actionType];
  if (!fn) return '';
  return fn(block.params);
}

export function generateFullCommand(blocks, language) {
  return blocks
    .map(b => generateCommand(b, language))
    .filter(Boolean)
    .join('\n');
}

export function getLanguageLabel(language) {
  const labels = {
    powershell: 'PowerShell',
    bash: 'Bash',
    cmd: 'CMD'
  };
  return labels[language] || language;
}

export function getLanguageExtension(language) {
  const exts = {
    powershell: '.ps1',
    bash: '.sh',
    cmd: '.bat'
  };
  return exts[language] || '';
}
