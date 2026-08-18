import React, { useState, useEffect } from 'react'
import DesignTable from './DesignTable'
import DesignForm from './DesignForm'
import CategoryManager from './CategoryManager'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function DesignManager() {
  const [designs, setDesigns] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDesign, setEditingDesign] = useState(null)
  const [showCategories, setShowCategories] = useState(false)

  const fetchDesigns = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.designs, { params: { per_page: 100 } })
      setDesigns(response.data || [])
    } catch (error) {
      toast.error('Failed to load designs')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get(endpoints.categories)
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchDesigns()
    fetchCategories()
  }, [])

  const handleEdit = (design) => {
    setEditingDesign(design)
    setShowForm(true)
  }

  const handleDelete = async (designId) => {
    if (window.confirm('Delete this design?')) {
      try {
        await api.delete(endpoints.designDetail(designId))
        toast.success('Design deleted')
        fetchDesigns()
      } catch (error) {
        toast.error('Failed to delete design')
      }
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingDesign) {
        await api.put(endpoints.designDetail(editingDesign.id), formData)
        toast.success('Design updated')
      } else {
        await api.post(endpoints.designs, formData)
        toast.success('Design created')
      }
      setShowForm(false)
      setEditingDesign(null)
      fetchDesigns()
    } catch (error) {
      toast.error('Failed to save design')
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setEditingDesign(null); setShowForm(true) }}
          className="px-4 py-2 bg-[#D4AF37] text-white rounded-full font-semibold text-sm">
          <i className="fas fa-plus mr-1"></i> Add Design
        </button>
        <button onClick={() => setShowCategories(!showCategories)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold text-sm">
          <i className="fas fa-tags mr-1"></i> Categories
        </button>
      </div>

      {showCategories && <CategoryManager categories={categories} onRefresh={fetchCategories} />}
      {showForm && (
        <DesignForm
          design={editingDesign}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingDesign(null) }}
        />
      )}
      {!showForm && !showCategories && (
        <DesignTable designs={designs} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default DesignManager