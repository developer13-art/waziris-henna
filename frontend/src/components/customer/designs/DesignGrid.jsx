import React from 'react'
import DesignCard from './DesignCard'
import EmptyState from '../common/EmptyState'

function DesignGrid({ designs, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#e8ddd4] border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (designs.length === 0) {
    return (
      <EmptyState
        icon="fa-images"
        title="No Designs Found"
        description="Try adjusting your filters or check back later."
        linkTo="/design-finder"
        linkText="Use Design Finder"
      />
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </div>
  )
}

export default DesignGrid