import React from 'react'

function ArticleTable({ articles, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl text-[#D4AF37]"></i></div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-2xl shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Views</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-t">
              <td className="px-4 py-2 font-semibold text-sm">{article.title}</td>
              <td className="px-4 py-2 text-sm">{article.category}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${article.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {article.is_published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-4 py-2 text-sm">{article.views_count || 0}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(article)} className="px-3 py-1 bg-[#8B5E3C] text-white text-xs rounded-lg">Edit</button>
                  <button onClick={() => onDelete(article.id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ArticleTable