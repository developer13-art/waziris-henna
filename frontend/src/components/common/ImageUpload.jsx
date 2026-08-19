import React, { useState, useRef } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { getImageUrl } from '../../utils/imageUrl'

function ImageUpload({ onUpload, directory = 'designs', currentImage = null }) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage ? getImageUrl(currentImage) : null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, WebP, or GIF)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target.result)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('directory', directory)

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.success) {
        const imageUrl = response.data.url
        console.log('Uploaded image URL:', imageUrl)
        setPreview(getImageUrl(imageUrl))
        onUpload(imageUrl)
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(response.message || 'Upload failed')
        setPreview(currentImage ? getImageUrl(currentImage) : null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
      setPreview(currentImage ? getImageUrl(currentImage) : null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {preview ? (
        <div>
          <img
            src={preview}
            alt="Uploaded"
            onError={(e) => {
              console.error('Image load error:', preview)
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='
            }}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '2px solid #e8ddd4'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 16px',
                background: '#8B5E3C',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-edit mr-1"></i> Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-trash mr-1"></i> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{
            width: '200px',
            height: '200px',
            border: '2px dashed #e8ddd4',
            borderRadius: '12px',
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '14px',
            color: '#666',
            opacity: isUploading ? 0.5 : 1
          }}
        >
          {isUploading ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: '32px', color: '#D4AF37' }}></i>
              <span>Click to upload image</span>
              <span style={{ fontSize: '11px', color: '#999' }}>JPG, PNG, WebP, GIF (Max 5MB)</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default ImageUpload