import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminDesignsPage() {
  const [designs, setDesigns] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDesign, setEditingDesign] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    style: '',
    occasion: '',
    body_area: '',
    complexity: 'Medium',
    price: '',
    image_url: '',
    is_featured: false,
    is_design_of_week: false,
    is_active: true,
  })

  const fetchDesigns = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.designs, { params: { per_page: 50 } })
      setDesigns(response.data || [])
    } catch (error) {
      console.error('Error fetching designs:', error)
      toast.error('Failed to load designs')
    } finally {
      setIsLoading(false)
    }
  }, [])

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
  }, [fetchDesigns])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const openCreateModal = () => {
    setEditingDesign(null)
    setFormData({
      title: '',
      description: '',
      category_id: '',
      style: '',
      occasion: '',
      body_area: '',
      complexity: 'Medium',
      price: '',
      image_url: '',
      is_featured: false,
      is_design_of_week: false,
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (design) => {
    setEditingDesign(design)
    setFormData({
      title: design.title,
      description: design.description || '',
      category_id: design.category_id || '',
      style: design.style || '',
      occasion: design.occasion || '',
      body_area: design.body_area || '',
      complexity: design.complexity || 'Medium',
      price: design.price || '',
      image_url: design.image_url || '',
      is_featured: design.is_featured,
      is_design_of_week: design.is_design_of_week,
      is_active: design.is_active,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDesign) {
        await api.put(endpoints.designDetail(editingDesign.id), formData)
        toast.success('Design updated successfully')
      } else {
        await api.post(endpoints.designs, formData)
        toast.success('Design created successfully')
      }
      setIsModalOpen(false)
      fetchDesigns()
    } catch (error) {
      console.error('Error saving design:', error)
      toast.error(error.response?.data?.message || 'Failed to save design')
    }
  }

  const handleDelete = async (designId) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await api.delete(endpoints.designDetail(designId))
        toast.success('Design deleted successfully')
        fetchDesigns()
      } catch (error) {
        console.error('Error deleting design:', error)
        toast.error('Failed to delete design')
      }
    }
  }

  const handleToggleDesignOfWeek = async (design) => {
    try {
      await api.put(endpoints.designDetail(design.id), {
        is_design_of_week: !design.is_design_of_week,
      })
      toast.success('Design of the week updated')
      fetchDesigns()
    } catch (error) {
      console.error('Error updating design:', error)
      toast.error('Failed to update design')
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Designs | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Designs Management</h2>
          <p className="text-gray-500">Manage your henna design gallery</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Add Design
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {designs.map((design) => (
            <div key={design.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img
                src={design.image_url}
                alt={design.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{design.title}</h3>
                  {design.is_design_of_week && (
                    <span className="px-2 py-1 bg-[#D4AF37] text-[#222] text-xs font-semibold rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {design.style && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{design.style}</span>
                  )}
                  {design.occasion && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{design.occasion}</span>
                  )}
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{design.complexity}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    <i className="fas fa-eye mr-1"></i>{design.views_count || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    <i className="fas fa-heart mr-1"></i>{design.saves_count || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(design)}
                    className="flex-1 px-3 py-2 bg-[#8B5E3C] text-white text-xs font-semibold rounded-lg hover:bg-[#6B4423] transition-colors"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button
                    onClick={() => handleToggleDesignOfWeek(design)}
                    className="px-3 py-2 bg-[#D4AF37] text-[#222] text-xs font-semibold rounded-lg hover:bg-[#b8941f] transition-colors"
                    title="Toggle Design of Week"
                  >
                    <i className="fas fa-star"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(design.id)}
                    className="px-3 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Design Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-playfair text-xl font-semibold">
                  {editingDesign ? 'Edit Design' : 'Add New Design'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block font-semibold text-sm mb-2">Design Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-sm mb-2">Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Style</label>
                    <select
                      name="style"
                      value={formData.style}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                    >
                      <option value="">Select Style</option>
                      <option value="Traditional Hausa">Traditional Hausa</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Floral">Floral</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Geometric">Geometric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Occasion</label>
                    <select
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                    >
                      <option value="">Select Occasion</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Eid">Eid</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Casual">Casual</option>
                      <option value="Naming Ceremony">Naming Ceremony</option>
                      <option value="Engagement">Engagement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Body Area</label>
                    <select
                      name="body_area"
                      value={formData.body_area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                    >
                      <option value="">Select Area</option>
                      <option value="Hands">Hands</option>
                      <option value="Feet">Feet</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Complexity</label>
                    <select
                      name="complexity"
                      value={formData.complexity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                    >
                      <option value="Simple">Simple</option>
                      <option value="Medium">Medium</option>
                      <option value="Intricate">Intricate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Price (₦)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="/hennah/images/gallery/..."
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_design_of_week"
                      checked={formData.is_design_of_week}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Design of Week</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#b8941f] transition-colors"
                >
                  {editingDesign ? 'Update Design' : 'Create Design'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminDesignsPage