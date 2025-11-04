import { create } from 'zustand';
import type { FileNode, FileSystem } from '../types/filesystem';

const STORAGE_KEY = 'terminal-filesystem';

// Initialize default file system with blog directory
const createDefaultFileSystem = (): FileNode => ({
  name: 'root',
  type: 'directory',
  createdAt: new Date(),
  modifiedAt: new Date(),
  children: {
    blog: {
      name: 'blog',
      type: 'directory',
      createdAt: new Date(),
      modifiedAt: new Date(),
      children: {},
    },
  },
});

// Load file system from localStorage or create default
const loadFileSystem = (): FileSystem => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const reviveDates = (node: any): FileNode => ({
        ...node,
        createdAt: new Date(node.createdAt),
        modifiedAt: new Date(node.modifiedAt),
        children: node.children
          ? Object.fromEntries(
              Object.entries(node.children).map(([key, value]) => [
                key,
                reviveDates(value as any),
              ])
            )
          : undefined,
      });
      return {
        root: reviveDates(parsed.root),
        currentPath: parsed.currentPath || '/',
      };
    }
  } catch (error) {
    console.error('Failed to load file system from localStorage:', error);
  }
  return {
    root: createDefaultFileSystem(),
    currentPath: '/',
  };
};

// Save file system to localStorage
const saveFileSystem = (fileSystem: FileSystem) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fileSystem));
  } catch (error) {
    console.error('Failed to save file system to localStorage:', error);
  }
};

interface FileSystemStore extends FileSystem {
  getNodeAtPath: (path: string) => FileNode | null;
  setCurrentPath: (path: string) => void;
  createFile: (path: string, content?: string) => boolean;
  createDirectory: (path: string) => boolean;
  deleteNode: (path: string) => boolean;
  writeFile: (path: string, content: string) => boolean;
  readFile: (path: string) => string | null;
  listDirectory: (path: string) => FileNode[] | null;
  resetFileSystem: () => void;
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => {
  const initialState = loadFileSystem();

  // Helper to persist changes
  const persistAndSet = (updater: (state: FileSystemStore) => Partial<FileSystem>) => {
    set((state) => {
      const updates = updater(state);
      const newState = { ...state, ...updates };
      saveFileSystem({
        root: newState.root,
        currentPath: newState.currentPath,
      });
      return updates;
    });
  };

  return {
    ...initialState,

    getNodeAtPath: (path: string): FileNode | null => {
      const state = get();
      const normalizedPath = path.startsWith('/') ? path : `${state.currentPath}/${path}`;
      const parts = normalizedPath.split('/').filter(Boolean);

      if (parts.length === 0) return state.root;

      let current: FileNode = state.root;
      for (const part of parts) {
        if (!current.children || !current.children[part]) {
          return null;
        }
        current = current.children[part];
      }
      return current;
    },

    setCurrentPath: (path: string) => {
      persistAndSet(() => ({ currentPath: path }));
    },

    createFile: (path: string, content: string = ''): boolean => {
      const state = get();
      const normalizedPath = path.startsWith('/') ? path : `${state.currentPath}/${path}`;
      const parts = normalizedPath.split('/').filter(Boolean);
      const fileName = parts.pop();

      if (!fileName) return false;

      const parentPath = '/' + parts.join('/');
      const parent = get().getNodeAtPath(parentPath);

      if (!parent || parent.type !== 'directory') return false;
      if (parent.children && parent.children[fileName]) return false;

      const newFile: FileNode = {
        name: fileName,
        type: 'file',
        content,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      persistAndSet((state) => {
        const updateNode = (node: FileNode, pathParts: string[]): FileNode => {
          if (pathParts.length === 0) {
            return {
              ...node,
              children: {
                ...node.children,
                [fileName]: newFile,
              },
              modifiedAt: new Date(),
            };
          }

          const [next, ...rest] = pathParts;
          if (!node.children || !node.children[next]) return node;

          return {
            ...node,
            children: {
              ...node.children,
              [next]: updateNode(node.children[next], rest),
            },
            modifiedAt: new Date(),
          };
        };

        return { root: updateNode(state.root, parts) };
      });

      return true;
    },

    createDirectory: (path: string): boolean => {
      const state = get();
      const normalizedPath = path.startsWith('/') ? path : `${state.currentPath}/${path}`;
      const parts = normalizedPath.split('/').filter(Boolean);
      const dirName = parts.pop();

      if (!dirName) return false;

      const parentPath = '/' + parts.join('/');
      const parent = get().getNodeAtPath(parentPath);

      if (!parent || parent.type !== 'directory') return false;
      if (parent.children && parent.children[dirName]) return false;

      const newDir: FileNode = {
        name: dirName,
        type: 'directory',
        children: {},
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      persistAndSet((state) => {
        const updateNode = (node: FileNode, pathParts: string[]): FileNode => {
          if (pathParts.length === 0) {
            return {
              ...node,
              children: {
                ...node.children,
                [dirName]: newDir,
              },
              modifiedAt: new Date(),
            };
          }

          const [next, ...rest] = pathParts;
          if (!node.children || !node.children[next]) return node;

          return {
            ...node,
            children: {
              ...node.children,
              [next]: updateNode(node.children[next], rest),
            },
            modifiedAt: new Date(),
          };
        };

        return { root: updateNode(state.root, parts) };
      });

      return true;
    },

    deleteNode: (path: string): boolean => {
      const state = get();
      const normalizedPath = path.startsWith('/') ? path : `${state.currentPath}/${path}`;
      const parts = normalizedPath.split('/').filter(Boolean);
      const nodeName = parts.pop();

      if (!nodeName || parts.length === 0 && nodeName === 'blog') {
        return false; // Cannot delete root or blog directory
      }

      persistAndSet((state) => {
        const updateNode = (node: FileNode, pathParts: string[]): FileNode => {
          if (pathParts.length === 0) {
            const newChildren = { ...node.children };
            delete newChildren[nodeName];
            return {
              ...node,
              children: newChildren,
              modifiedAt: new Date(),
            };
          }

          const [next, ...rest] = pathParts;
          if (!node.children || !node.children[next]) return node;

          return {
            ...node,
            children: {
              ...node.children,
              [next]: updateNode(node.children[next], rest),
            },
            modifiedAt: new Date(),
          };
        };

        return { root: updateNode(state.root, parts) };
      });

      return true;
    },

    writeFile: (path: string, content: string): boolean => {
      const state = get();
      const normalizedPath = path.startsWith('/') ? path : `${state.currentPath}/${path}`;
      const parts = normalizedPath.split('/').filter(Boolean);
      const fileName = parts.pop();

      if (!fileName) return false;

      persistAndSet((state) => {
        const updateNode = (node: FileNode, pathParts: string[]): FileNode => {
          if (pathParts.length === 0) {
            if (!node.children || !node.children[fileName]) return node;
            const file = node.children[fileName];
            if (file.type !== 'file') return node;

            return {
              ...node,
              children: {
                ...node.children,
                [fileName]: {
                  ...file,
                  content,
                  modifiedAt: new Date(),
                },
              },
              modifiedAt: new Date(),
            };
          }

          const [next, ...rest] = pathParts;
          if (!node.children || !node.children[next]) return node;

          return {
            ...node,
            children: {
              ...node.children,
              [next]: updateNode(node.children[next], rest),
            },
          };
        };

        return { root: updateNode(state.root, parts) };
      });

      return true;
    },

    readFile: (path: string): string | null => {
      const node = get().getNodeAtPath(path);
      if (!node || node.type !== 'file') return null;
      return node.content || '';
    },

    listDirectory: (path: string): FileNode[] | null => {
      const node = get().getNodeAtPath(path);
      if (!node || node.type !== 'directory' || !node.children) return null;
      return Object.values(node.children).sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      });
    },

    resetFileSystem: () => {
      persistAndSet(() => ({
        root: createDefaultFileSystem(),
        currentPath: '/',
      }));
    },
  };
});
