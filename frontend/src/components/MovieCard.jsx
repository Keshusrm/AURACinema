import { useState } from 'react'
import { motion } from 'framer-motion'

const MovieCard = ({ movie, index }) => {
  const [expanded, setExpanded] = useState(false)
  const isMovie = movie.type === 'Movie'
  const badgeColor = isMovie ? 'bg-purple/20 text-purple-light border-purple/30' : 'bg-teal-900/40 text-teal-400 border-teal-800/50'

  const genres = movie.listed_in.split(',').map(g => g.trim())
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-cosmic-light border border-cosmic-border rounded-xl p-5 card-hover relative overflow-hidden flex flex-col h-full z-10"
    >
      {/* Type badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}>
          {movie.type}
        </span>
        <span className="text-gold font-bold text-sm bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
          {movie.rating || 'NR'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-1 line-clamp-2" title={movie.title}>
        {movie.title}
      </h3>

      {/* Credits */}
      <div className="mb-4">
        <p className="text-sm text-purple-light/80 mb-0.5">
          {movie.director ? `Dir. ${movie.director}` : 'Dir. Unknown'}
        </p>
        <p className="text-xs text-gray-400 line-clamp-1" title={movie.cast}>
          {movie.cast ? movie.cast : 'Cast Unlisted'}
        </p>
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {genres.slice(0, 3).map((g, i) => (
          <span key={i} className="text-[10px] uppercase tracking-wider bg-gray-800/50 text-gray-300 px-2 py-0.5 rounded">
            {g}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="flex-grow">
        <p className={`text-sm text-gray-400 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          {movie.description}
        </p>
        {movie.description?.length > 100 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-purple-light text-xs mt-1 hover:text-white transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Bottom meta */}
      <div className="mt-5 pt-4 border-t border-cosmic-border flex justify-between items-center text-xs text-gray-400">
        <span className="flex items-center gap-1">
          📅 {movie.release_year}
        </span>
        <span className="flex items-center gap-1">
          ⏱️ {movie.duration}
        </span>
        <span>
          {movie.country?.split(',')[0] || 'Unknown'} 🌍
        </span>
      </div>

      {/* Relevance Score Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cosmic-border">
        <div 
          className="score-bar h-full" 
          style={{ width: `${Math.round(movie.relevance_score * 100)}%` }}
        />
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-bold text-purple-light/70 bg-cosmic/50 px-1.5 py-0.5 rounded">
        Match {Math.round(movie.relevance_score * 100)}%
      </div>
    </motion.div>
  )
}

export default MovieCard
