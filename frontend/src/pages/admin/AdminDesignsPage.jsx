import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import DesignForm from '../../components/admin/designs/DesignForm'
import CategoryManager from '../../components/admin/designs/CategoryManager'
import { getImageUrl } from '../../utils/imageUrl'
import { toast } from 'react-toastify'

function AdminDesignsPage() {
  const [designs, setDesigns] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDesign, setEditingDesign] = useState(null)
  const [showCategories, setShowCategories] = useState(false)

  const fetchDesigns = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.designs, { params: { per_page: 100 } })
      setDesigns(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching designs:', error)
      toast.error('Failed to load designs')
      setDesigns([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get(endpoints.categories)
      setCategories(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  useEffect(() => {
    fetchDesigns()
    fetchCategories()
  }, [fetchDesigns])

  const handleSave = async (formData) => {
    try {
      if (editingDesign) {
        await api.put(endpoints.designDetail(editingDesign.id), formData)
        toast.success('Design updated successfully')
      } else {
        await api.post(endpoints.designs, formData)
        toast.success('Design created successfully')
      }
      setShowForm(false)
      setEditingDesign(null)
      fetchDesigns()
    } catch (error) {
      console.error('Error saving design:', error)
      toast.error(error.response?.data?.message || 'Failed to save design')
    }
  }

  const handleEdit = (design) => {
    setEditingDesign(design)
    setShowForm(true)
    setShowCategories(false)
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

  return (
    <>
      <Helmet>
        <title>Manage Designs | Waziri's Henna Admin</title>
      </Helmet>

      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '12px' 
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Designs Management</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Manage your henna design gallery</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { setShowCategories(!showCategories); setShowForm(false) }}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                color: '#444',
                border: 'none',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <i className="fas fa-tags mr-2"></i>
              Categories ({categories.length})
            </button>
            <button
              onClick={() => { setEditingDesign(null); setShowForm(true); setShowCategories(false) }}
              style={{
                padding: '10px 20px',
                background: '#D4AF37',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <i className="fas fa-plus mr-2"></i>
              Add Design
            </button>
          </div>
        </div>

        {/* Category Manager */}
        {showCategories && (
          <CategoryManager
            categories={categories}
            onRefresh={fetchCategories}
            onClose={() => setShowCategories(false)}
          />
        )}

        {/* Design Form */}
        {showForm && (
          <DesignForm
            design={editingDesign}
            categories={categories}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingDesign(null) }}
          />
        )}

        {/* Designs Grid */}
        {!showForm && !showCategories && (
          <>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#D4AF37' }}></i>
                <p style={{ color: '#666', marginTop: '12px' }}>Loading designs...</p>
              </div>
            ) : designs.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <i className="fas fa-palette" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>No Designs Yet</p>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
                  Click "Add Design" to create your first design
                </p>
                <button
                  onClick={() => { setEditingDesign(null); setShowForm(true) }}
                  style={{
                    padding: '12px 24px',
                    background: '#D4AF37',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <i className="fas fa-plus mr-2"></i> Add Design
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {designs.map((design) => (
                  <div key={design.id} style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.2s'
                  }}>
                    {/* Image */}
                    {design.image_url ? (
                      <img
                        src={getImageUrl(design.image_url)}
                        alt={design.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    {/* Placeholder */}
                    <div style={{
                      width: '100%',
                      height: '180px',
                      background: '#f9fafb',
                      display: design.image_url ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-image" style={{ fontSize: '40px', color: '#ddd' }}></i>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{design.title}</h3>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        {design.style || 'No style'} • {design.complexity || 'Medium'}
                      </p>
                      {design.is_design_of_week && (
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          background: '#D4AF37',
                          color: '#222',
                          borderRadius: '50px',
                          fontSize: '10px',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}>
                          ⭐ Design of Week
                        </span>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button
                          onClick={() => handleEdit(design)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#8B5E3C',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(design.id)}
                          style={{
                            padding: '8px 12px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default AdminDesignsPage