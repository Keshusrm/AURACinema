const SkeletonCard = () => {
  return (
    <div className="bg-cosmic-light border border-cosmic-border rounded-xl p-5 relative overflow-hidden h-[380px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="w-16 h-6 rounded-full shimmer" />
        <div className="w-10 h-6 rounded shimmer" />
      </div>
      
      <div className="w-3/4 h-7 rounded shimmer mb-4" />
      
      <div className="mb-6 space-y-2">
        <div className="w-1/2 h-4 rounded shimmer" />
        <div className="w-2/3 h-3 rounded shimmer" />
      </div>

      <div className="flex gap-2 mb-6">
        <div className="w-16 h-5 rounded shimmer" />
        <div className="w-20 h-5 rounded shimmer" />
      </div>

      <div className="space-y-2 flex-grow">
        <div className="w-full h-3 rounded shimmer" />
        <div className="w-full h-3 rounded shimmer" />
        <div className="w-4/5 h-3 rounded shimmer" />
      </div>

      <div className="mt-5 pt-4 border-t border-cosmic-border flex justify-between">
        <div className="w-12 h-4 rounded shimmer" />
        <div className="w-12 h-4 rounded shimmer" />
        <div className="w-12 h-4 rounded shimmer" />
      </div>
    </div>
  )
}

export default SkeletonCard
