const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const getImageUrl = (path) => {
  if (!path) return null
  
  // If the path is already a full URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If it's a base64 data URL, return as-is
  if (path.startsWith('data:image')) {
    return path
  }
  
  // If it's a blob URL, return as-is
  if (path.startsWith('blob:')) {
    return path
  }
  
  // If the path starts with /uploads/, prepend backend URL
  if (path.startsWith('/uploads/')) {
    return `${BACKEND_URL}${path}`
  }
  
  // If the path starts with uploads/ (no leading slash), add both
  if (path.startsWith('uploads/')) {
    return `${BACKEND_URL}/${path}`
  }
  
  // Otherwise, just return the path
  return path
}

export default getImageUrl