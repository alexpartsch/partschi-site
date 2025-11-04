import { useEffect, useRef, useState } from 'react';
import { useFileSystemStore } from '../stores/useFileSystemStore';
import { useTerminalStore } from '../stores/useTerminalStore';
import { handleCommand } from '../utils/commandHandler';

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const { currentPath } = useFileSystemStore();
  const { history, addHistory } = useTerminalStore();

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Scroll to bottom when history updates
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const result = handleCommand(input);
    addHistory(input, result.output, result.isError);

    // Add to command history
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  const getPrompt = () => {
    const path = currentPath === '/' ? '~' : currentPath;
    return `user@terminal:${path}$`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Output area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 terminal-scrollbar"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Welcome message */}
        {history.length === 0 && (
          <div className="mb-4 text-[#cccccc]">
            <p className="mb-2">Welcome to the Terminal Portfolio!</p>
            <p className="mb-2">Type 'help' to see available commands.</p>
            <p>Type 'whoami' to learn more about me.</p>
          </div>
        )}

        {/* Command history */}
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff00]">{getPrompt()}</span>
              <span className="text-[#cccccc]">{entry.command}</span>
            </div>
            {entry.output && (
              <div
                className={`mt-1 whitespace-pre-wrap ${
                  entry.isError ? 'text-[#ff5555]' : 'text-[#cccccc]'
                }`}
              >
                {entry.output}
              </div>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center gap-2">
          <span className="text-[#00ff00]">{getPrompt()}</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-[#cccccc] w-full font-mono"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
