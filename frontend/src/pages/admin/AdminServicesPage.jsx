import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    starting_price: '',
    duration_minutes: '60',
    suitable_occasions: '',
    image_url: '',
    is_active: true,
    sort_order: '0',
  })

  const fetchServices = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.services)
      setServices(response.data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Failed to load services')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const openCreateModal = () => {
    setEditingService(null)
    setFormData({
      name: '', description: '', short_description: '', starting_price: '',
      duration_minutes: '60', suitable_occasions: '', image_url: '',
      is_active: true, sort_order: '0',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      short_description: service.short_description || '',
      starting_price: service.starting_price,
      duration_minutes: service.duration_minutes,
      suitable_occasions: service.suitable_occasions || '',
      image_url: service.image_url || '',
      is_active: service.is_active,
      sort_order: service.sort_order,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingService) {
        await api.put(endpoints.serviceDetail(editingService.id), formData)
        toast.success('Service updated successfully')
      } else {
        await api.post(endpoints.services, formData)
        toast.success('Service created successfully')
      }
      setIsModalOpen(false)
      fetchServices()
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Failed to save service')
    }
  }

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(endpoints.serviceDetail(serviceId))
        toast.success('Service deleted successfully')
        fetchServices()
      } catch (error) {
        console.error('Error deleting service:', error)
        toast.error('Failed to delete service')
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Services | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Services Management</h2>
          <p className="text-gray-500">Manage your henna services</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Add Service
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{service.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
              <p className="text-[#8B5E3C] font-semibold mb-3">
                From ₦{parseFloat(service.starting_price).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="flex-1 px-3 py-2 bg-[#8B5E3C] text-white text-xs font-semibold rounded-lg hover:bg-[#6B4423] transition-colors"
                >
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="px-3 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Modal */}
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
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block font-semibold text-sm mb-2">Service Name *</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Short Description</label>
                  <input
                    type="text" name="short_description" value={formData.short_description} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Full Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleInputChange} rows="3"
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-sm mb-2">Starting Price (₦) *</label>
                    <input
                      type="number" name="starting_price" value={formData.starting_price} onChange={handleInputChange} required min="0"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Duration (minutes)</label>
                    <input
                      type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleInputChange} min="15"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Suitable Occasions</label>
                  <input
                    type="text" name="suitable_occasions" value={formData.suitable_occasions} onChange={handleInputChange}
                    placeholder="Weddings, Eid, Parties..."
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Image URL</label>
                  <input
                    type="text" name="image_url" value={formData.image_url} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-4 h-4" />
                  <span className="text-sm font-semibold">Active</span>
                </label>
                <button type="submit" className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#b8941f] transition-colors">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminServicesPage