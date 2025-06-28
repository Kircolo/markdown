import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import MarkdownIt from 'markdown-it'
import jsPDF from 'jspdf'
import html2pdf from 'html2pdf.js'

function App() {
  const [documents, setDocuments] = useState([])
  const [currentDocId, setCurrentDocId] = useState(null)
  const [markdown, setMarkdown] = useState('')
  const [showFileManager, setShowFileManager] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef(null)
  const hiddenPdfRef = useRef(null)
  const previewRef = useRef(null)
  const [editorWidth, setEditorWidth] = useState(50) // percent
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false)

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

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

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

  const exportPDF = () => {
    const currentDoc = documents.find(d => d.id === currentDocId)
    if (!currentDoc || !previewRef.current) return
    // Save original styles
    const previewEl = previewRef.current
    const originalHeight = previewEl.style.height
    const originalOverflow = previewEl.style.overflow
    // Expand preview to fit all content
    previewEl.style.height = 'auto'
    previewEl.style.overflow = 'visible'
    // Wait for DOM to update, then export
    setTimeout(() => {
      const opt = {
        margin:       0.5,
        filename:     `${currentDoc.title}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      }
      html2pdf().set(opt).from(previewEl).save().then(() => {
        // Restore original styles
        previewEl.style.height = originalHeight
        previewEl.style.overflow = originalOverflow
      })
    }, 100)
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

  const startDrag = (e) => {
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
  }
  const stopDrag = () => {
    isDragging.current = false
    document.body.style.cursor = ''
  }
  const onDrag = (e) => {
    if (!isDragging.current || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
    let newWidth = ((x - containerRect.left) / containerRect.width) * 100
    newWidth = Math.max(15, Math.min(85, newWidth))
    setEditorWidth(newWidth)
  }
  useEffect(() => {
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', onDrag)
    window.addEventListener('touchend', stopDrag)
    return () => {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('touchmove', onDrag)
      window.removeEventListener('touchend', stopDrag)
    }
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <div className={`app ${theme}-mode${isPreviewFullScreen ? ' preview-fullscreen' : ''}`}>
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1>Markdown Editor</h1>
          <button className="btn btn-secondary theme-toggle-btn" onClick={toggleTheme} title="Toggle light/dark mode">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
        <div className="header-controls">
          <button 
            className="btn btn-primary"
            onClick={createNewDocument}
          >
            ➕ New
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFileManager(!showFileManager)}
          >
            📁 Files
          </button>
          <label className="btn btn-secondary">
            ⬆️ Import MD
            <input
              type="file"
              accept=".md,.markdown"
              onChange={importDocument}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            className="btn btn-secondary"
            onClick={exportDocument}
            disabled={!currentDoc}
          >
            📄 Export as MD
          </button>
          <button
            className="btn btn-secondary"
            onClick={exportPDF}
            disabled={!currentDoc}
          >
            🖨️ Export as PDF
          </button>
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
      
      <div className="editor-container" ref={containerRef}>
        <div className="editor-panel" style={{ width: isPreviewFullScreen ? '0' : `${editorWidth}%`, display: isPreviewFullScreen ? 'none' : 'flex' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isEditingTitle && currentDoc ? (
              <input
                ref={titleInputRef}
                type="text"
                value={currentDoc.title}
                onChange={e => updateDocumentTitle(currentDoc.id, e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={e => {
                  if (e.key === 'Enter') setIsEditingTitle(false)
                }}
                className="document-title-input inline-title-input"
                style={{ fontSize: '1.1rem', fontWeight: 600, maxWidth: '300px' }}
              />
            ) : (
              <span
                className="inline-title-text"
                tabIndex={0}
                onClick={() => setIsEditingTitle(true)}
                onKeyDown={e => { if (e.key === 'Enter') setIsEditingTitle(true) }}
                style={{ cursor: 'pointer', fontWeight: 600 }}
                title="Click to edit title"
              >
                {currentDoc ? currentDoc.title : 'Markdown Input'}
              </span>
            )}
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
        <div
          className="drag-divider"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          style={{ cursor: 'col-resize', width: '8px', background: 'transparent', zIndex: 2, display: isPreviewFullScreen ? 'none' : 'block' }}
        />
        <div className={`preview-panel${isPreviewFullScreen ? ' fullscreen' : ''}`} ref={previewRef} style={{ width: isPreviewFullScreen ? '100%' : `${100 - editorWidth}%`, zIndex: isPreviewFullScreen ? 1000 : 'auto', position: isPreviewFullScreen ? 'fixed' : 'relative', top: isPreviewFullScreen ? 0 : 'auto', left: isPreviewFullScreen ? 0 : 'auto', height: isPreviewFullScreen ? '100vh' : '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2>Preview</h2>
            {!isPreviewFullScreen && (
              <button
                className="btn btn-secondary preview-fullscreen-btn"
                onClick={() => setIsPreviewFullScreen(true)}
                title="View Full Screen"
                style={{ marginLeft: 'auto' }}
              >
                ⛶
              </button>
            )}
          </div>
          {isPreviewFullScreen && (
            <button
              className="preview-exit-fullscreen-btn"
              onClick={() => setIsPreviewFullScreen(false)}
              title="Exit Full Screen"
            >
              ⨉
            </button>
          )}
          <div className="markdown-preview">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
