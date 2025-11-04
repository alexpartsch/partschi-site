import { useEffect } from 'react';
import { TerminalHeader } from './components/TerminalHeader';
import { Terminal } from './components/Terminal';
import { BlogPanel } from './components/BlogPanel';
import { ImprintModal } from './components/ImprintModal';
import { WhoamiModal } from './components/WhoamiModal';
import { loadBlogPosts } from './utils/loadBlogPosts';

function App() {
  useEffect(() => {
    // Load blog posts on mount
    loadBlogPosts();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0c0c0c] text-[#cccccc]">
      <TerminalHeader />
      <Terminal />
      <BlogPanel />
      <ImprintModal />
      <WhoamiModal />
    </div>
  );
}

export default App;
