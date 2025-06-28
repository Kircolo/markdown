# Markdown Editor

A sleek, modern React + Vite app for live Markdown editing and previewing with comprehensive storage capabilities. Type Markdown on the left, see the rendered result on the right — all in a beautiful, responsive interface with automatic saving and file management.

## Features

- **Live Preview:** See your Markdown rendered instantly as you type.
- **Split View:** Editor and preview side-by-side for maximum productivity.
- **Modern UI:** Sleek, dark theme with vibrant blue accents.
- **Responsive Design:** Works great on desktop and mobile.
- **CommonMark Support:** Supports headings, lists, code, links, blockquotes, and more.
- **Subtle Scrollbars:** Minimal, modern scrollbars for a clean look.
- **🆕 Local Storage:** All documents are automatically saved to your browser's local storage.
- **🆕 Multiple Documents:** Create, manage, and switch between multiple markdown documents.
- **🆕 File Management:** Import existing `.md` files and export your documents.
- **🆕 Auto-Save:** Changes are saved automatically as you type.
- **🆕 Document Organization:** Rename documents and see last modified dates.

## Storage Features

### Local Storage
- Documents are automatically saved to your browser's local storage
- No data loss when you refresh the page or close the browser
- Works offline - no internet connection required

### File Management
- **Create New Document:** Start with a fresh markdown document
- **Import Files:** Upload existing `.md` or `.markdown` files
- **Export Documents:** Download your documents as `.md` files
- **Document List:** View all your documents with file manager
- **Rename Documents:** Edit document titles inline
- **Delete Documents:** Remove documents you no longer need

### Multiple Document Support
- Switch between multiple documents seamlessly
- Each document maintains its own content and title
- Active document is highlighted in the file manager
- Cannot delete the last document (ensures you always have at least one)

## Tech Stack

- [React](https://react.dev/) (with hooks)
- [Vite](https://vitejs.dev/) for fast development
- [react-markdown](https://github.com/remarkjs/react-markdown) for Markdown rendering
- CSS for custom theming and layout
- Browser Local Storage for data persistence

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) to use the app.

## Usage

### Basic Editing
- Type Markdown in the left panel.
- See the formatted output in the right panel instantly.
- Try out:
  - `# Headings`
  - `**Bold**` and `*italic*`
  - `> Blockquotes`
  - Lists, links, code blocks, and more!

### Document Management
- Click **📁 Files** to open the file manager
- Click **➕ New** to create a new document
- Click **💾 Export** to download the current document
- Click **📂 Import** to upload an existing markdown file
- Use the document list to switch between documents
- Click on document titles to rename them
- Use **Open** and **Delete** buttons to manage documents

### Storage
- All changes are automatically saved to local storage
- Documents persist between browser sessions
- No need to manually save - everything is auto-saved
- Clear browser data to reset all documents

## Customization

- Edit `src/App.jsx` and `src/App.css` to tweak the layout, theme, or add new features.
- Theming is handled in `App.css` for easy color and style changes.
- Storage logic is in `App.jsx` - modify localStorage keys or add cloud storage.

## Browser Compatibility

- Works in all modern browsers with localStorage support
- Tested on Chrome, Firefox, Safari, and Edge
- Requires JavaScript enabled

## License

MIT — use, modify, and share freely!
