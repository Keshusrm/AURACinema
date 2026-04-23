import { motion } from 'framer-motion'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'
import useStore from '../store/useStore'

const Home = () => {
  const { results, isLoading, hasSearched, bestModel } = useStore()

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 hero-gradient overflow-hidden min-h-[50vh] flex flex-col justify-center">
        {/* CSS Particles */}
        <div className="particles">
          {[...Array(8)].map((_, i) => <div key={i} className="particle" />)}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-6 tracking-wide text-white glow-text">
              AURA<span className="text-purple-light">CINEMA</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
              Discover your next obsession. Powered by intelligence.
            </p>
          </motion.div>

          <SearchBar />
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {hasSearched && (
          <div className="mb-8 flex items-center justify-between border-b border-cosmic-border pb-4">
            <h2 className="text-2xl font-cinzel font-bold text-white">Curated For You</h2>
            {bestModel && (
              <span className="text-xs text-purple-light bg-purple/10 px-3 py-1 rounded-full border border-purple/20">
                via {bestModel.replace('_', ' ')}
              </span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-20 bg-cosmic-light border border-cosmic-border rounded-xl">
            <span className="text-6xl mb-4 block">🌌</span>
            <h3 className="text-xl font-bold text-white mb-2">Lost in space</h3>
            <p className="text-gray-400">No matches found — try a different vibe.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((movie, idx) => (
              <MovieCard key={movie.show_id} movie={movie} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
