import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cosmic-border bg-cosmic/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-cinzel font-bold text-2xl tracking-wider text-white">
              AURA<span className="text-purple-light">CINEMA</span>
            </span>
          </Link>
          
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-purple-light relative ${
                location.pathname === '/' ? 'text-purple-light' : 'text-gray-400'
              }`}
            >
              Discover
              {location.pathname === '/' && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-light"
                />
              )}
            </Link>
            <Link 
              to="/insights" 
              className={`text-sm font-medium transition-colors hover:text-purple-light relative ${
                location.pathname === '/insights' ? 'text-purple-light' : 'text-gray-400'
              }`}
            >
              Insights
              {location.pathname === '/insights' && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-light"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
