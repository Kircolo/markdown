import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor

## Features
- **Bold text** and *italic text*
- \`Inline code\` and code blocks
- Lists and links

### Code Block Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Try it out!
Type your markdown on the left and see it rendered on the right.`)

  return (
    <div className="app">
      <header className="header">
        <h1>Markdown Editor</h1>
        <p>Type markdown on the left, see it rendered on the right</p>
      </header>
      
      <div className="editor-container">
        <div className="editor-panel">
          <h2>Markdown Input</h2>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            className="markdown-input"
          />
        </div>
        
        <div className="preview-panel">
          <h2>Preview</h2>
          <div className="markdown-preview">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
