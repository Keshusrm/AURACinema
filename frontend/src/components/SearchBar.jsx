import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'

const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('')
  const fetchRecommendations = useStore(state => state.fetchRecommendations)
  const setSearchQuery = useStore(state => state.setSearchQuery)

  const handleSearch = (e) => {
    e.preventDefault()
    if (localQuery.trim()) {
      setSearchQuery(localQuery)
      fetchRecommendations(localQuery)
    }
  }

  return (
    <motion.form 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      onSubmit={handleSearch} 
      className="w-full max-w-2xl mx-auto mt-8 relative z-20"
    >
      <div className="relative search-glow rounded-full transition-all duration-300 bg-cosmic-light border border-cosmic-border focus-within:border-purple">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Describe a movie you'd love... e.g. 'a thrilling space adventure'"
          className="w-full bg-transparent text-white px-6 py-4 rounded-full outline-none placeholder-gray-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-purple to-purple-light text-white font-medium rounded-full hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-300"
        >
          Search
        </button>
      </div>
      <p className="text-center text-gray-500 text-xs mt-3 flex items-center justify-center gap-1">
        Press <kbd className="px-2 py-0.5 bg-cosmic-border rounded text-gray-300">Enter</kbd> to discover
      </p>
    </motion.form>
  )
}

export default SearchBar
