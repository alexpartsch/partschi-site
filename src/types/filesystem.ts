export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileNode>;
  createdAt: Date;
  modifiedAt: Date;
}

export interface FileSystem {
  root: FileNode;
  currentPath: string;
}

export interface TerminalHistory {
  command: string;
  output: string;
  timestamp: Date;
  isError?: boolean;
}
