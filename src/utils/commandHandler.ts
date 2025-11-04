import { useFileSystemStore } from '../stores/useFileSystemStore';
import { useTerminalStore } from '../stores/useTerminalStore';

export interface CommandResult {
  output: string;
  isError?: boolean;
}

const resolvePath = (currentPath: string, targetPath: string): string => {
  if (targetPath.startsWith('/')) {
    return targetPath;
  }

  if (targetPath === '.') {
    return currentPath;
  }

  if (targetPath === '..') {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }

  if (targetPath.startsWith('../')) {
    const parts = currentPath.split('/').filter(Boolean);
    const targetParts = targetPath.split('/').filter((p) => p !== '.');

    for (const part of targetParts) {
      if (part === '..') {
        parts.pop();
      } else {
        parts.push(part);
      }
    }
    return '/' + parts.join('/');
  }

  return currentPath === '/' ? `/${targetPath}` : `${currentPath}/${targetPath}`;
};

export const handleCommand = (command: string): CommandResult => {
  const trimmed = command.trim();
  if (!trimmed) return { output: '' };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const fsStore = useFileSystemStore.getState();
  const terminalStore = useTerminalStore.getState();

  switch (cmd) {
    case 'help':
      return {
        output: `Available commands:
  cd <path>       Change directory
  ls [path]       List directory contents
  touch <file>    Create a new file
  echo <text>     Output text (use > to redirect to file)
  cat <file>      Display file contents
  grep <pattern> <file>  Search for pattern in file
  rm <path>       Remove file or directory
  clear           Clear terminal history
  open <file>     Open markdown file in panel
  whoami          Display profile information
  help            Show this help message`,
      };

    case 'clear':
      terminalStore.clearHistory();
      return { output: '' };

    case 'pwd':
      return { output: fsStore.currentPath };

    case 'cd': {
      if (args.length === 0) {
        fsStore.setCurrentPath('/');
        return { output: '' };
      }

      const targetPath = resolvePath(fsStore.currentPath, args[0]);
      const node = fsStore.getNodeAtPath(targetPath);

      if (!node) {
        return { output: `cd: ${args[0]}: No such file or directory`, isError: true };
      }

      if (node.type !== 'directory') {
        return { output: `cd: ${args[0]}: Not a directory`, isError: true };
      }

      fsStore.setCurrentPath(targetPath);
      return { output: '' };
    }

    case 'ls': {
      const targetPath = args.length > 0 ? resolvePath(fsStore.currentPath, args[0]) : fsStore.currentPath;
      const nodes = fsStore.listDirectory(targetPath);

      if (!nodes) {
        return { output: `ls: cannot access '${args[0] || '.'}': No such file or directory`, isError: true };
      }

      if (nodes.length === 0) {
        return { output: '' };
      }

      return {
        output: nodes
          .map((node) => {
            const prefix = node.type === 'directory' ? '📁 ' : '📄 ';
            return `${prefix}${node.name}`;
          })
          .join('\n'),
      };
    }

    case 'touch': {
      if (args.length === 0) {
        return { output: 'touch: missing file operand', isError: true };
      }

      const success = fsStore.createFile(args[0]);
      if (!success) {
        return { output: `touch: cannot create file '${args[0]}'`, isError: true };
      }

      return { output: '' };
    }

    case 'mkdir': {
      if (args.length === 0) {
        return { output: 'mkdir: missing directory operand', isError: true };
      }

      const success = fsStore.createDirectory(args[0]);
      if (!success) {
        return { output: `mkdir: cannot create directory '${args[0]}'`, isError: true };
      }

      return { output: '' };
    }

    case 'echo': {
      const text = args.join(' ');

      // Check for redirect operator
      const redirectMatch = text.match(/^(.+?)\s*>\s*(.+)$/);
      if (redirectMatch) {
        const [, content, filename] = redirectMatch;
        const trimmedContent = content.trim();
        const trimmedFilename = filename.trim();

        // Check if file exists
        const targetPath = resolvePath(fsStore.currentPath, trimmedFilename);
        const node = fsStore.getNodeAtPath(targetPath);

        if (node) {
          // File exists, write to it
          const success = fsStore.writeFile(trimmedFilename, trimmedContent);
          if (!success) {
            return { output: `echo: cannot write to '${trimmedFilename}'`, isError: true };
          }
        } else {
          // File doesn't exist, create it
          const success = fsStore.createFile(trimmedFilename, trimmedContent);
          if (!success) {
            return { output: `echo: cannot create file '${trimmedFilename}'`, isError: true };
          }
        }

        return { output: '' };
      }

      return { output: text };
    }

    case 'cat': {
      if (args.length === 0) {
        return { output: 'cat: missing file operand', isError: true };
      }

      const content = fsStore.readFile(args[0]);
      if (content === null) {
        return { output: `cat: ${args[0]}: No such file or directory`, isError: true };
      }

      return { output: content };
    }

    case 'grep': {
      if (args.length < 2) {
        return { output: 'grep: missing pattern or file operand', isError: true };
      }

      const pattern = args[0];
      const filename = args[1];
      const content = fsStore.readFile(filename);

      if (content === null) {
        return { output: `grep: ${filename}: No such file or directory`, isError: true };
      }

      try {
        const regex = new RegExp(pattern, 'gi');
        const lines = content.split('\n');
        const matches = lines.filter((line) => regex.test(line));

        if (matches.length === 0) {
          return { output: '' };
        }

        return { output: matches.join('\n') };
      } catch (error) {
        return { output: `grep: invalid pattern '${pattern}'`, isError: true };
      }
    }

    case 'rm': {
      if (args.length === 0) {
        return { output: 'rm: missing file operand', isError: true };
      }

      const success = fsStore.deleteNode(args[0]);
      if (!success) {
        return { output: `rm: cannot remove '${args[0]}'`, isError: true };
      }

      return { output: '' };
    }

    case 'open': {
      if (args.length === 0) {
        return { output: 'open: missing file operand', isError: true };
      }

      const content = fsStore.readFile(args[0]);
      if (content === null) {
        return { output: `open: ${args[0]}: No such file or directory`, isError: true };
      }

      // Check if it's a markdown file
      if (!args[0].endsWith('.md')) {
        return { output: `open: ${args[0]}: Not a markdown file`, isError: true };
      }

      // Extract title from filename
      const fileName = args[0].split('/').pop() || args[0];
      const title = fileName.replace('.md', '').replace(/-/g, ' ');

      terminalStore.openBlogPanel(content, title);
      return { output: `Opening ${fileName}...` };
    }

    case 'whoami': {
      terminalStore.setShowWhoamiModal(true);
      return { output: '' };
    }

    default:
      return { output: `${cmd}: command not found. Type 'help' for available commands.`, isError: true };
  }
};
