# Terminal Portfolio Website

A unique, terminal-themed personal portfolio website built with React, TypeScript, and Tailwind CSS. This interactive web application simulates a Unix terminal environment with a virtual file system that persists to the browser's local storage.

## Features

### 🖥️ Terminal Interface
- Authentic terminal look and feel with monospace fonts and terminal colors
- Interactive command-line interface
- Command history navigation (Up/Down arrows)
- Auto-focus and smooth scrolling

### 📁 Virtual File System
- Persistent file system using browser's localStorage
- Pre-populated blog directory with markdown articles
- Full support for files and directories
- Survives page refreshes

### 💻 Supported Commands
- `help` - Show available commands
- `ls [path]` - List directory contents
- `cd <path>` - Change directory
- `pwd` - Print working directory
- `cat <file>` - Display file contents
- `touch <file>` - Create a new file
- `mkdir <dir>` - Create a new directory
- `rm <path>` - Remove file or directory
- `echo <text>` - Output text (supports `> filename` redirection)
- `grep <pattern> <file>` - Search for pattern in file
- `clear` - Clear terminal history
- `open <file>` - Open markdown file in side panel
- `whoami` - Display profile information

### 📝 Blog System
- Blog posts stored as markdown files in `/blog` directory
- Beautiful slide-in panel for reading blog posts
- Syntax highlighting and GitHub-flavored markdown support
- Easy to add new posts by committing markdown files

### 🎨 UI Components
- **Header Bar**: Displays current date/time, session runtime, and Imprint button
- **Terminal**: Main interactive terminal interface
- **Blog Panel**: Sliding panel for viewing blog posts
- **Modals**: Profile (whoami) and Imprint information

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **React Query** - Server state management (ready for future use)
- **React Router** - Client-side routing (ready for future use)
- **React Markdown** - Markdown rendering with GitHub flavored markdown
- **date-fns** - Date formatting
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd partschi-site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Adding Blog Posts

1. Create a new markdown file in `src/content/blog/`:
```bash
src/content/blog/my-new-post.md
```

2. Import it in `src/utils/loadBlogPosts.ts`:
```typescript
import myNewPost from '../content/blog/my-new-post.md?raw';

const blogPosts = [
  // ... existing posts
  { name: 'my-new-post.md', content: myNewPost },
];
```

3. The post will automatically appear in the `/blog` directory

### Updating Profile Information

Edit `src/content/profile.md` to update your profile information, including:
- Your photo (place in `/public` directory)
- Bio and introduction
- Skills and expertise
- Contact information

### Updating Imprint

Edit `src/content/imprint.md` to update your legal imprint information.

## Project Structure

```
partschi-site/
├── src/
│   ├── components/          # React components
│   │   ├── Terminal.tsx     # Main terminal component
│   │   ├── TerminalHeader.tsx
│   │   ├── BlogPanel.tsx
│   │   ├── Modal.tsx
│   │   ├── ImprintModal.tsx
│   │   └── WhoamiModal.tsx
│   ├── stores/             # Zustand stores
│   │   ├── useFileSystemStore.ts
│   │   └── useTerminalStore.ts
│   ├── types/              # TypeScript type definitions
│   │   └── filesystem.ts
│   ├── utils/              # Utility functions
│   │   ├── commandHandler.ts
│   │   └── loadBlogPosts.ts
│   ├── content/            # Markdown content
│   │   ├── blog/           # Blog posts
│   │   ├── imprint.md
│   │   └── profile.md
│   ├── App.tsx             # Main app component
│   ├── index.css           # Global styles
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Key Features Explanation

### Virtual File System
The file system is implemented using Zustand for state management and localStorage for persistence. It supports:
- Creating, reading, and deleting files and directories
- Path resolution (absolute and relative paths)
- Nested directory structures
- Automatic saving to localStorage

### Terminal Commands
All commands are handled through a central command handler that:
- Parses command input
- Validates arguments
- Executes file system operations
- Returns output and error messages

### Markdown Rendering
Blog posts and modal content use `react-markdown` with:
- GitHub-flavored markdown support
- Syntax highlighting
- Raw HTML support
- Custom component styling

## Browser Support

Modern browsers that support:
- ES6+
- LocalStorage API
- CSS Grid and Flexbox
- CSS custom properties

## Performance Considerations

- File system operations are synchronous and stored in memory
- LocalStorage has a 5-10MB limit (varies by browser)
- Consider implementing pagination for large numbers of blog posts
- The bundle size warning can be addressed by code-splitting if needed

## Future Enhancements

- [ ] Add command autocomplete
- [ ] Implement tab completion
- [ ] Add more Unix commands (cp, mv, etc.)
- [ ] Implement search functionality for blog posts
- [ ] Add syntax highlighting for code blocks in terminal
- [ ] Implement file upload/download
- [ ] Add theme customization
- [ ] Mobile-responsive improvements

## License

[Add your license here]

## Contact

[Add your contact information here]

---

Built with ❤️ using React and TypeScript
