export const getImageUrl = (path) => {
  if (!path) return null
  
  // If the path is already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If the path starts with /uploads/, prepend backend URL
  if (path.startsWith('/uploads/')) {
    return `http://localhost:8000${path}`
  }
  
  // If it's a base64 data URL, return as-is
  if (path.startsWith('data:image')) {
    return path
  }
  
  // Otherwise, just return the path
  return path
}

export default getImageUrl