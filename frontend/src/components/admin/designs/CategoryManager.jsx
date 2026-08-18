import React, { useState } from 'react'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function CategoryManager({ categories, onRefresh }) {
  const [newCategory, setNewCategory] = useState('')

  const handleAdd = async () => {
    if (!newCategory.trim()) return
    try {
      await api.post(endpoints.categories, { name: newCategory.trim() })
      toast.success('Category added')
      setNewCategory('')
      onRefresh()
    } catch (error) {
      toast.error('Failed to add category')
    }
  }

  const handleDelete = async (categoryId) => {
    if (window.confirm('Delete this category?')) {
      try {
        await api.delete(endpoints.categoryDetail(categoryId))
        toast.success('Category deleted')
        onRefresh()
      } catch (error) {
        toast.error('Failed to delete category')
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="font-semibold mb-4">Design Categories</h3>
      <div className="flex gap-2 mb-4">
        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name" className="flex-1 px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        <button onClick={handleAdd} className="px-4 py-2 bg-[#D4AF37] text-white rounded-xl font-semibold">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
            <span className="text-sm font-semibold">{cat.name}</span>
            <button onClick={() => handleDelete(cat.id)} className="text-red-500 text-xs">
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryManager