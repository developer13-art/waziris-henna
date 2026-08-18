import React, { useState, useEffect } from 'react'
import ServiceTable from './ServiceTable'
import ServiceForm from './ServiceForm'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function ServiceManager() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.services)
      setServices(response.data || [])
    } catch (error) {
      toast.error('Failed to load services')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSave = async (formData) => {
    try {
      if (editingService) {
        await api.put(endpoints.serviceDetail(editingService.id), formData)
        toast.success('Service updated')
      } else {
        await api.post(endpoints.services, formData)
        toast.success('Service created')
      }
      setShowForm(false)
      setEditingService(null)
      fetchServices()
    } catch (error) {
      toast.error('Failed to save service')
    }
  }

  return (
    <div>
      <button onClick={() => { setEditingService(null); setShowForm(true) }}
        className="mb-4 px-4 py-2 bg-[#D4AF37] text-white rounded-full font-semibold text-sm">
        <i className="fas fa-plus mr-1"></i> Add Service
      </button>
      {showForm && (
        <ServiceForm service={editingService} onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}
      {!showForm && (
        <ServiceTable
          services={services}
          isLoading={isLoading}
          onEdit={(service) => { setEditingService(service); setShowForm(true) }}
          onDelete={async (id) => {
            if (window.confirm('Delete this service?')) {
              await api.delete(endpoints.serviceDetail(id))
              toast.success('Service deleted')
              fetchServices()
            }
          }}
        />
      )}
    </div>
  )
}

export default ServiceManager