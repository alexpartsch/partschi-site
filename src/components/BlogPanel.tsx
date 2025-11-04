import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useTerminalStore } from '../stores/useTerminalStore';

export const BlogPanel = () => {
  const { blogPanelOpen, currentBlogContent, currentBlogTitle, closeBlogPanel } = useTerminalStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && blogPanelOpen) {
        closeBlogPanel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [blogPanelOpen, closeBlogPanel]);

  return (
    <>
      {/* Overlay */}
      {blogPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeBlogPanel}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-[#1e1e1e] border-l border-[#333333] z-50 transform transition-transform duration-300 ease-in-out ${
          blogPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#333333]">
            <h2 className="text-xl font-bold text-[#00ff00] capitalize">
              {currentBlogTitle}
            </h2>
            <button
              onClick={closeBlogPanel}
              className="text-[#cccccc] hover:text-[#ff5555] transition-colors text-2xl leading-none"
              aria-label="Close panel"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 terminal-scrollbar">
            {currentBlogContent && (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-[#00ff00] mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-[#00ff00] mb-3 mt-6">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-[#00ff00] mb-2 mt-4">{children}</h3>
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
                    li: ({ children }) => (
                      <li className="text-[#cccccc] ml-4">{children}</li>
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
                        <code className="block bg-[#0c0c0c] text-[#cccccc] p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-[#0c0c0c] rounded-lg overflow-x-auto my-4">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-terminal-prompt pl-4 italic text-[#cccccc] my-4">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-[#00ff00] font-bold">{children}</strong>
                    ),
                  }}
                >
                  {currentBlogContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
