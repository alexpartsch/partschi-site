import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  markdown?: string;
}

export const Modal = ({ isOpen, onClose, title, children, markdown }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1e1e] border border-[#333333] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333]">
          {title && <h2 className="text-xl font-bold text-[#00ff00]">{title}</h2>}
          <button
            onClick={onClose}
            className="text-[#cccccc] hover:text-[#ff5555] transition-colors text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 terminal-scrollbar">
          {markdown ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-[#00ff00] mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-[#00ff00] mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold text-[#00ff00] mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[#cccccc] mb-4 leading-relaxed">{children}</p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-[#00ff00] underline hover:text-green-400"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-[#cccccc] mb-4 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-[#cccccc] mb-4 space-y-1">{children}</ol>
                  ),
                  img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-[#0c0c0c] text-[#00ff00] px-1 py-0.5 rounded">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-[#0c0c0c] text-[#cccccc] p-4 rounded-lg overflow-x-auto my-4">
                        {children}
                      </code>
                    );
                  },
                  strong: ({ children }) => (
                    <strong className="text-[#00ff00] font-bold">{children}</strong>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};
