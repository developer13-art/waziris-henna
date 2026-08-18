import React from 'react'

const categories = [
  { value: 'All', label: 'All', icon: 'fa-book' },
  { value: 'Guides', label: 'Guides', icon: 'fa-compass' },
  { value: 'Tutorials', label: 'Tutorials', icon: 'fa-graduation-cap' },
  { value: 'Culture', label: 'Culture', icon: 'fa-landmark' },
  { value: 'Tips', label: 'Tips', icon: 'fa-lightbulb' },
  { value: 'Inspiration', label: 'Inspiration', icon: 'fa-sparkles' },
]

function CategoryFilter({ activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeCategory === cat.value
              ? 'bg-[#8B5E3C] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <i className={`fas ${cat.icon} mr-1`}></i>
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter