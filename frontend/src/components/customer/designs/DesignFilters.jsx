import React from 'react'

function DesignFilters({ filters, onChange, onClear, categories }) {
  const styles = ['Traditional Hausa', 'Arabic', 'Floral', 'Minimalist', 'Geometric']
  const occasions = ['Wedding', 'Eid', 'Birthday', 'Casual', 'Naming Ceremony', 'Engagement']

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search designs..."
        value={filters.search}
        onChange={(e) => onChange('search', e.target.value)}
        className="flex-1 min-w-[200px] px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full focus:outline-none focus:border-[#D4AF37] text-sm"
      />
      <select
        value={filters.category}
        onChange={(e) => onChange('category', e.target.value)}
        className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full text-sm bg-white"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <select
        value={filters.style}
        onChange={(e) => onChange('style', e.target.value)}
        className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full text-sm bg-white"
      >
        <option value="">All Styles</option>
        {styles.map(style => <option key={style} value={style}>{style}</option>)}
      </select>
      <select
        value={filters.occasion}
        onChange={(e) => onChange('occasion', e.target.value)}
        className="px-4 py-2.5 border-2 border-[#e8ddd4] rounded-full text-sm bg-white"
      >
        <option value="">All Occasions</option>
        {occasions.map(occasion => <option key={occasion} value={occasion}>{occasion}</option>)}
      </select>
      {(filters.search || filters.category || filters.style || filters.occasion) && (
        <button onClick={onClear} className="text-[#8B5E3C] font-semibold hover:text-red-500 text-sm">
          <i className="fas fa-times mr-1"></i> Clear
        </button>
      )}
    </div>
  )
}

export default DesignFilters