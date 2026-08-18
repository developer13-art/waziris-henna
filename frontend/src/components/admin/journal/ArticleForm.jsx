import React, { useState } from 'react'

function ArticleForm({ article, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    category: article?.category || 'Guides',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    image_url: article?.image_url || '',
    author: article?.author || "Waziri's Henna",
    tags: article?.tags || '',
    is_published: article?.is_published || false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mb-6">
      <h3 className="font-semibold text-lg">{article ? 'Edit Article' : 'Write Article'}</h3>
      <div>
        <label className="block text-sm font-semibold mb-1">Title *</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl bg-white">
            <option value="Guides">Guides</option>
            <option value="Tutorials">Tutorials</option>
            <option value="Culture">Culture</option>
            <option value="Tips">Tips</option>
            <option value="Inspiration">Inspiration</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Author</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Excerpt</label>
        <input type="text" name="excerpt" value={formData.excerpt} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Content *</label>
        <textarea name="content" value={formData.content} onChange={handleChange} rows="8" required
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Image URL</label>
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-4 h-4" />
        <span className="text-sm font-semibold">Publish immediately</span>
      </label>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-semibold">
          {article ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-full font-semibold">Cancel</button>
      </div>
    </form>
  )
}

export default ArticleForm