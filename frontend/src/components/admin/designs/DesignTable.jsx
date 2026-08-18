import React from 'react'

function DesignTable({ designs, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl text-[#D4AF37]"></i></div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-2xl shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Style</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Complexity</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design) => (
            <tr key={design.id} className="border-t">
              <td className="px-4 py-2">
                <img src={design.image_url} alt={design.title} className="w-14 h-14 rounded-lg object-cover" />
              </td>
              <td className="px-4 py-2 font-semibold text-sm">{design.title}</td>
              <td className="px-4 py-2 text-sm">{design.style || 'N/A'}</td>
              <td className="px-4 py-2 text-sm">{design.complexity}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(design)} className="px-3 py-1 bg-[#8B5E3C] text-white text-xs rounded-lg">Edit</button>
                  <button onClick={() => onDelete(design.id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DesignTable