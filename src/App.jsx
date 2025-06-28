import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App() {
  const [documents, setDocuments] = useState([])
  const [currentDocId, setCurrentDocId] = useState(null)
  const [markdown, setMarkdown] = useState('')
  const [showFileManager, setShowFileManager] = useState(false)

  // Load documents from localStorage on app start
  useEffect(() => {
    const savedDocs = localStorage.getItem('markdown-documents')
    if (savedDocs) {
      const parsedDocs = JSON.parse(savedDocs)
      setDocuments(parsedDocs)
      if (parsedDocs.length > 0) {
        setCurrentDocId(parsedDocs[0].id)
        setMarkdown(parsedDocs[0].content)
      }
    } else {
      // Create default document if no documents exist
      const defaultDoc = {
        id: Date.now().toString(),
        title: 'Untitled Document',
        content: `# Welcome to Markdown Editor

## Features
- **Bold text** and *italic text*
- \`Inline code\` and code blocks
- Lists and links
- **Local Storage:** Your documents are automatically saved
- **File Management:** Create, save, and load multiple documents

### Code Block Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Try it out!
Type your markdown on the left and see it rendered on the right.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setDocuments([defaultDoc])
      setCurrentDocId(defaultDoc.id)
      setMarkdown(defaultDoc.content)
    }
  }, [])

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('markdown-documents', JSON.stringify(documents))
    }
  }, [documents])

  // Update current document content when markdown changes
  useEffect(() => {
    if (currentDocId && markdown !== '') {
      setDocuments(prev => prev.map(doc => 
        doc.id === currentDocId 
          ? { ...doc, content: markdown, updatedAt: new Date().toISOString() }
          : doc
      ))
    }
  }, [markdown, currentDocId])

  const createNewDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setDocuments(prev => [...prev, newDoc])
    setCurrentDocId(newDoc.id)
    setMarkdown('')
    setShowFileManager(false)
  }

  const openDocument = (docId) => {
    const doc = documents.find(d => d.id === docId)
    if (doc) {
      setCurrentDocId(docId)
      setMarkdown(doc.content)
      setShowFileManager(false)
    }
  }

  const deleteDocument = (docId) => {
    if (documents.length === 1) {
      alert('Cannot delete the last document. Create a new one first.')
      return
    }
    
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
    
    if (currentDocId === docId) {
      const remainingDocs = documents.filter(doc => doc.id !== docId)
      if (remainingDocs.length > 0) {
        setCurrentDocId(remainingDocs[0].id)
        setMarkdown(remainingDocs[0].content)
      }
    }
  }

  const updateDocumentTitle = (docId, newTitle) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, title: newTitle, updatedAt: new Date().toISOString() }
        : doc
    ))
  }

  const exportDocument = () => {
    const currentDoc = documents.find(d => d.id === currentDocId)
    if (!currentDoc) return

    const blob = new Blob([currentDoc.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentDoc.title}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importDocument = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const newDoc = {
        id: Date.now().toString(),
        title: file.name.replace('.md', ''),
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setDocuments(prev => [...prev, newDoc])
      setCurrentDocId(newDoc.id)
      setMarkdown(content)
      setShowFileManager(false)
    }
    reader.readAsText(file)
  }

  const currentDoc = documents.find(d => d.id === currentDocId)

  return (
    <div className="app">
      <header className="header">
        <h1>Markdown Editor</h1>
        <div className="header-controls">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFileManager(!showFileManager)}
          >
            📁 Files
          </button>
          <button 
            className="btn btn-primary"
            onClick={createNewDocument}
          >
            ➕ New
          </button>
          <button 
            className="btn btn-secondary"
            onClick={exportDocument}
            disabled={!currentDoc}
          >
            💾 Export
          </button>
          <label className="btn btn-secondary">
            📂 Import
            <input
              type="file"
              accept=".md,.markdown"
              onChange={importDocument}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </header>

      {showFileManager && (
        <div className="file-manager">
          <h3>Documents</h3>
          <div className="document-list">
            {documents.map(doc => (
              <div 
                key={doc.id} 
                className={`document-item ${currentDocId === doc.id ? 'active' : ''}`}
              >
                <div className="document-info">
                  <input
                    type="text"
                    value={doc.title}
                    onChange={(e) => updateDocumentTitle(doc.id, e.target.value)}
                    className="document-title-input"
                  />
                  <span className="document-date">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="document-actions">
                  <button 
                    className="btn btn-small"
                    onClick={() => openDocument(doc.id)}
                  >
                    Open
                  </button>
                  <button 
                    className="btn btn-small btn-danger"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="editor-container">
        <div className="editor-panel">
          <h2>
            {currentDoc ? currentDoc.title : 'Markdown Input'}
            {currentDoc && (
              <span className="save-status">
                💾 Auto-saved
              </span>
            )}
          </h2>
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
