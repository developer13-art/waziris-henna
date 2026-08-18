import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    sale_price: '',
    stock_quantity: '',
    low_stock_threshold: '5',
    category: 'Henna Products',
    image_url: '',
    is_active: true,
    is_featured: false,
  })

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.products, { params: { per_page: 50 } })
      setProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: '',
      sale_price: '',
      stock_quantity: '',
      low_stock_threshold: '5',
      category: 'Henna Products',
      image_url: '',
      is_active: true,
      is_featured: false,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price,
      sale_price: product.sale_price || '',
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      category: product.category || 'Henna Products',
      image_url: product.image_url || '',
      is_active: product.is_active,
      is_featured: product.is_featured,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(endpoints.productDetail(editingProduct.id), formData)
        toast.success('Product updated successfully')
      } else {
        await api.post(endpoints.products, formData)
        toast.success('Product created successfully')
      }
      setIsModalOpen(false)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(endpoints.productDetail(productId))
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('Failed to delete product')
      }
    }
  }

  const handleAdjustInventory = async (productId, changeType, quantity) => {
    try {
      await api.post(endpoints.productInventory(productId), {
        change_type: changeType,
        quantity_changed: quantity,
        reason: 'Manual adjustment from admin',
      })
      toast.success('Inventory updated successfully')
      fetchProducts()
    } catch (error) {
      console.error('Error adjusting inventory:', error)
      toast.error('Failed to update inventory')
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Products | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Products Management</h2>
          <p className="text-gray-500">Manage your henna products and inventory</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Add Product
        </button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">₦{parseFloat(product.price).toLocaleString()}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stock_quantity === 0 ? 'bg-red-100 text-red-700' :
                    product.stock_quantity <= product.low_stock_threshold ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Stock: {product.stock_quantity}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 px-3 py-2 bg-[#8B5E3C] text-white text-xs font-semibold rounded-lg hover:bg-[#6B4423] transition-colors"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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

      {/* Product Modal */}
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                  <label className="block font-semibold text-sm mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Short Description</label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Full Description</label>
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
                    <label className="block font-semibold text-sm mb-2">Price (₦) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Sale Price (₦)</label>
                    <input
                      type="number"
                      name="sale_price"
                      value={formData.sale_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sm mb-2">Low Stock Threshold</label>
                    <input
                      type="number"
                      name="low_stock_threshold"
                      value={formData.low_stock_threshold}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white"
                  >
                    <option value="Henna Products">Henna Products</option>
                    <option value="Oils">Oils</option>
                    <option value="Patterns">Patterns</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="/hennah/images/products/..."
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
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#b8941f] transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminProductsPage