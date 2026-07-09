import { describe, it, expect } from 'vitest';
import { generateCommand, generateFullCommand, getLanguageLabel, getLanguageExtension } from '../src/lib/commands.js';

describe('generateCommand', () => {
  const params = {
    source: '/home/user/file.txt',
    destination: '/backup/file.txt',
    path: '/home/user/documents',
    oldName: '/home/user/old.txt',
    newName: 'new.txt',
    mode: '755',
    recursive: false
  };

  describe('PowerShell', () => {
    const lang = 'powershell';

    it('genera Copy-Item per copia file', () => {
      const cmd = generateCommand({ actionType: 'copy-file', params }, lang);
      expect(cmd).toContain('Copy-Item');
      expect(cmd).toContain(params.source);
      expect(cmd).toContain(params.destination);
    });

    it('genera Remove-Item per elimina cartella', () => {
      const cmd = generateCommand({ actionType: 'delete-folder', params }, lang);
      expect(cmd).toContain('Remove-Item');
      expect(cmd).toContain('-Recurse -Force');
      expect(cmd).toContain(params.path);
    });

    it('genera Rename-Item per rinomina file', () => {
      const cmd = generateCommand({ actionType: 'rename-file', params }, lang);
      expect(cmd).toContain('Rename-Item');
      expect(cmd).toContain(params.oldName);
      expect(cmd).toContain(params.newName);
    });

    it('genera New-Item per crea directory', () => {
      const cmd = generateCommand({ actionType: 'create-directory', params }, lang);
      expect(cmd).toContain('New-Item');
      expect(cmd).toContain('-ItemType Directory');
      expect(cmd).toContain(params.path);
    });

    it('genera Move-Item per sposta file', () => {
      const cmd = generateCommand({ actionType: 'move-file', params }, lang);
      expect(cmd).toContain('Move-Item');
      expect(cmd).toContain(params.source);
      expect(cmd).toContain(params.destination);
    });

    it('genera Get-ChildItem per elenca file', () => {
      const cmd = generateCommand({ actionType: 'list-files', params }, lang);
      expect(cmd).toContain('Get-ChildItem');
      expect(cmd).toContain(params.path);
      expect(cmd).not.toContain('-Recurse');
    });

    it('aggiunge -Recurse quando recursive è true', () => {
      const cmd = generateCommand({ actionType: 'list-files', params: { ...params, recursive: true } }, lang);
      expect(cmd).toContain('-Recurse');
    });

    it('genera icacls per modifica permessi', () => {
      const cmd = generateCommand({ actionType: 'change-permissions', params }, lang);
      expect(cmd).toContain('icacls');
      expect(cmd).toContain('/grant');
    });

    it('genera Compress-Archive per comprimi cartella', () => {
      const cmd = generateCommand({ actionType: 'compress-folder', params }, lang);
      expect(cmd).toContain('Compress-Archive');
      expect(cmd).toContain(params.source);
      expect(cmd).toContain(params.destination);
    });
  });

  describe('Bash', () => {
    const lang = 'bash';

    it('genera cp per copia file', () => {
      const cmd = generateCommand({ actionType: 'copy-file', params }, lang);
      expect(cmd).toContain('cp ');
      expect(cmd).toContain(params.source);
      expect(cmd).toContain(params.destination);
    });

    it('genera rm -rf per elimina cartella', () => {
      const cmd = generateCommand({ actionType: 'delete-folder', params }, lang);
      expect(cmd).toContain('rm -rf');
      expect(cmd).toContain(params.path);
    });

    it('genera mv per rinomina file', () => {
      const cmd = generateCommand({ actionType: 'rename-file', params }, lang);
      expect(cmd).toContain('mv ');
      expect(cmd).toContain(params.oldName);
      expect(cmd).toContain(params.newName);
    });

    it('genera mkdir -p per crea directory', () => {
      const cmd = generateCommand({ actionType: 'create-directory', params }, lang);
      expect(cmd).toContain('mkdir -p');
      expect(cmd).toContain(params.path);
    });

    it('genera mv per sposta file', () => {
      const cmd = generateCommand({ actionType: 'move-file', params }, lang);
      expect(cmd).toContain('mv ');
      expect(cmd).toContain(params.source);
      expect(cmd).toContain(params.destination);
    });

    it('genera ls per elenca file', () => {
      const cmd = generateCommand({ actionType: 'list-files', params }, lang);
      expect(cmd).toContain('ls ');
      expect(cmd).toContain(params.path);
    });

    it('genera chmod per modifica permessi', () => {
      const cmd = generateCommand({ actionType: 'change-permissions', params }, lang);
      expect(cmd).toContain('chmod');
      expect(cmd).toContain(params.mode);
    });
  });

  describe('CMD', () => {
    const lang = 'cmd';

    it('genera copy per copia file', () => {
      const cmd = generateCommand({ actionType: 'copy-file', params }, lang);
      expect(cmd).toContain('copy ');
      expect(cmd).toContain(params.source);
      expect(cmd).toContain(params.destination);
    });

    it('genera rmdir /s /q per elimina cartella', () => {
      const cmd = generateCommand({ actionType: 'delete-folder', params }, lang);
      expect(cmd).toContain('rmdir /s /q');
      expect(cmd).toContain(params.path);
    });

    it('genera ren per rinomina file', () => {
      const cmd = generateCommand({ actionType: 'rename-file', params }, lang);
      expect(cmd).toContain('ren ');
      expect(cmd).toContain(params.oldName);
      expect(cmd).toContain(params.newName);
    });

    it('genera mkdir per crea directory', () => {
      const cmd = generateCommand({ actionType: 'create-directory', params }, lang);
      expect(cmd).toContain('mkdir ');
      expect(cmd).toContain(params.path);
    });

    it('genera move per sposta file', () => {
      const cmd = generateCommand({ actionType: 'move-file', params }, lang);
      expect(cmd).toContain('move ');
      expect(cmd).toContain(params.source);
      expect(cmd).toContain(params.destination);
    });

    it('genera dir per elenca file', () => {
      const cmd = generateCommand({ actionType: 'list-files', params }, lang);
      expect(cmd).toContain('dir ');
      expect(cmd).toContain(params.path);
    });
  });

  describe('Parametri vuoti', () => {
    it('mostra placeholder ... per parametri mancanti', () => {
      const cmd = generateCommand({ actionType: 'copy-file', params: {} }, 'bash');
      expect(cmd).toContain('...');
    });
  });
});

describe('generateFullCommand', () => {
  it('combina più blocchi con newline', () => {
    const blocks = [
      { id: 1, actionType: 'create-directory', params: { path: '/tmp/test' } },
      { id: 2, actionType: 'copy-file', params: { source: '/tmp/a.txt', destination: '/tmp/test/a.txt' } }
    ];
    const result = generateFullCommand(blocks, 'bash');
    expect(result).toContain('\n');
    expect(result).toContain('mkdir');
    expect(result).toContain('cp');
  });

  it('restituisce stringa vuota per array vuoto', () => {
    expect(generateFullCommand([], 'bash')).toBe('');
  });
});

describe('getLanguageLabel', () => {
  it('restituisce etichette corrette', () => {
    expect(getLanguageLabel('powershell')).toBe('PowerShell');
    expect(getLanguageLabel('bash')).toBe('Bash');
    expect(getLanguageLabel('cmd')).toBe('CMD');
  });
});

describe('getLanguageExtension', () => {
  it('restituisce estensioni corrette', () => {
    expect(getLanguageExtension('powershell')).toBe('.ps1');
    expect(getLanguageExtension('bash')).toBe('.sh');
    expect(getLanguageExtension('cmd')).toBe('.bat');
  });
});
