import { useFileSystemStore } from '../stores/useFileSystemStore';

// Import all blog posts
import welcomePost from '../content/blog/welcome.md?raw';
import cleanArchitecturePost from '../content/blog/clean-architecture.md?raw';
import typescriptTipsPost from '../content/blog/typescript-tips.md?raw';

const blogPosts = [
  { name: 'welcome.md', content: welcomePost },
  { name: 'clean-architecture.md', content: cleanArchitecturePost },
  { name: 'typescript-tips.md', content: typescriptTipsPost },
];

export const loadBlogPosts = () => {
  const { getNodeAtPath, createFile } = useFileSystemStore.getState();

  // Check if blog posts are already loaded
  const blogDir = getNodeAtPath('/blog');
  if (!blogDir || !blogDir.children) return;

  // Load blog posts if they don't exist
  blogPosts.forEach(({ name, content }) => {
    const existingPost = getNodeAtPath(`/blog/${name}`);
    if (!existingPost) {
      createFile(`/blog/${name}`, content);
    }
  });
};
