import React, { useState, useRef } from 'react'
import { Bold, Italic, Underline, Link, List, ListOrdered, Quote, Code, Image, Video, FileText, Save } from 'lucide-react'

interface RichTextEditorProps {
  content: any
  onChange: (content: any) => void
  placeholder?: string
  className?: string
}

interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'video' | 'youtube' | 'drive' | 'list' | 'quote' | 'code'
  content: any
  order: number
}

export function RichTextEditor({ content, onChange, placeholder = "Start typing...", className = "" }: RichTextEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(content?.blocks || [
    { id: '1', type: 'text', content: '', order: 0 }
  ])
  const [activeBlock, setActiveBlock] = useState<string | null>(null)
  const [showMediaMenu, setShowMediaMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateBlock = (blockId: string, newContent: any) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content: newContent } : block
    )
    setBlocks(updatedBlocks)
    onChange({ blocks: updatedBlocks })
  }

  const addBlock = (type: ContentBlock['type'], content: any = '') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content,
      order: blocks.length
    }
    const updatedBlocks = [...blocks, newBlock]
    setBlocks(updatedBlocks)
    onChange({ blocks: updatedBlocks })
  }

  const removeBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId)
    setBlocks(updatedBlocks)
    onChange({ blocks: updatedBlocks })
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex(b => b.id === blockId)
    if (
      (direction === 'up' && blockIndex === 0) ||
      (direction === 'down' && blockIndex === blocks.length - 1)
    ) return

    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1
    
    const temp = newBlocks[blockIndex]
    newBlocks[blockIndex] = newBlocks[targetIndex]
    newBlocks[targetIndex] = temp
    
    setBlocks(newBlocks)
    onChange({ blocks: newBlocks })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like Supabase Storage
      const reader = new FileReader()
      reader.onload = (e) => {
        addBlock('image', {
          url: e.target?.result,
          alt: file.name,
          caption: ''
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const extractDriveId = (url: string) => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  const renderBlock = (block: ContentBlock) => {
    const isActive = activeBlock === block.id

    switch (block.type) {
      case 'text':
        return (
          <div className={`relative group ${isActive ? 'ring-2 ring-blue-500 rounded' : ''}`}>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              onFocus={() => setActiveBlock(block.id)}
              onBlur={() => setActiveBlock(null)}
              placeholder={placeholder}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
            />
            {isActive && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => moveBlock(block.id, 'up')}
                  className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveBlock(block.id, 'down')}
                  className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeBlock(block.id)}
                  className="p-1 bg-red-600 text-white rounded hover:bg-red-500"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )

      case 'image':
        return (
          <div className={`relative group ${isActive ? 'ring-2 ring-blue-500 rounded' : ''}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              {block.content.url && (
                <img
                  src={block.content.url}
                  alt={block.content.alt || ''}
                  className="w-full max-h-96 object-contain rounded mb-3"
                />
              )}
              <input
                type="text"
                value={block.content.caption || ''}
                onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
                placeholder="Image caption..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveBlock(block.id, 'up')}
                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                ↑
              </button>
              <button
                onClick={() => moveBlock(block.id, 'down')}
                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                ↓
              </button>
              <button
                onClick={() => removeBlock(block.id)}
                className="p-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                ×
              </button>
            </div>
          </div>
        )

      case 'youtube':
        const youtubeId = extractYouTubeId(block.content.url || '')
        return (
          <div className={`relative group ${isActive ? 'ring-2 ring-blue-500 rounded' : ''}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              {youtubeId ? (
                <div className="aspect-video mb-3">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`}
                    className="w-full h-full rounded"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-700 rounded flex items-center justify-center mb-3">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <input
                type="url"
                value={block.content.url || ''}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                placeholder="YouTube URL..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                value={block.content.caption || ''}
                onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
                placeholder="Video caption..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveBlock(block.id, 'up')} className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600">↑</button>
              <button onClick={() => moveBlock(block.id, 'down')} className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600">↓</button>
              <button onClick={() => removeBlock(block.id)} className="p-1 bg-red-600 text-white rounded hover:bg-red-500">×</button>
            </div>
          </div>
        )

      case 'drive':
        const driveId = extractDriveId(block.content.url || '')
        return (
          <div className={`relative group ${isActive ? 'ring-2 ring-blue-500 rounded' : ''}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              {driveId ? (
                <div className="aspect-video mb-3">
                  <iframe
                    src={`https://drive.google.com/file/d/${driveId}/preview`}
                    className="w-full h-full rounded"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-700 rounded flex items-center justify-center mb-3">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <input
                type="url"
                value={block.content.url || ''}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                placeholder="Google Drive share URL..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                value={block.content.caption || ''}
                onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
                placeholder="Document caption..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveBlock(block.id, 'up')} className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600">↑</button>
              <button onClick={() => moveBlock(block.id, 'down')} className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600">↓</button>
              <button onClick={() => removeBlock(block.id)} className="p-1 bg-red-600 text-white rounded hover:bg-red-500">×</button>
            </div>
          </div>
        )

      case 'list':
        return (
          <div className={`relative group ${isActive ? 'ring-2 ring-blue-500 rounded' : ''}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => updateBlock(block.id, { ...block.content, ordered: !block.content.ordered })}
                  className={`p-2 rounded ${block.content.ordered ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
                >
                  {block.content.ordered ? <ListOrdered className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
                <span className="text-gray-300 text-sm">
                  {block.content.ordered ? 'Ordered List' : 'Unordered List'}
                </span>
              </div>
              <textarea
                value={block.content.items?.join('\n') || ''}
                onChange={(e) => updateBlock(block.id, { 
                  ...block.content, 
                  items: e.target.value.split('\n').filter(item => item.trim()) 
                })}
                placeholder="Enter list items (one per line)..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
              />
            </div>
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveBlock(block.id, 'up')} className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600">↑</button>
              <button onClick={() => moveBlock(block.id, 'down')} className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600">↓</button>
              <button onClick={() => removeBlock(block.id)} className="p-1 bg-red-600 text-white rounded hover:bg-red-500">×</button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
        <button
          onClick={() => addBlock('text')}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Text</span>
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowMediaMenu(!showMediaMenu)}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <Image className="w-4 h-4" />
            <span>Media</span>
          </button>
          
          {showMediaMenu && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => {
                  fileInputRef.current?.click()
                  setShowMediaMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <Image className="w-4 h-4" />
                <span>Image</span>
              </button>
              <button
                onClick={() => {
                  addBlock('youtube', { url: '', caption: '' })
                  setShowMediaMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <Video className="w-4 h-4" />
                <span>YouTube</span>
              </button>
              <button
                onClick={() => {
                  addBlock('drive', { url: '', caption: '' })
                  setShowMediaMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Google Drive</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => addBlock('list', { ordered: false, items: [] })}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          <List className="w-4 h-4" />
          <span>List</span>
        </button>

        <button
          onClick={() => addBlock('quote', '')}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          <Quote className="w-4 h-4" />
          <span>Quote</span>
        </button>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks.map(block => (
          <div key={block.id}>
            {renderBlock(block)}
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}