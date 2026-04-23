import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Insights from './pages/Insights'

function App() {
  return (
    <div className="min-h-screen bg-cosmic text-soft flex flex-col relative">
      {/* Grain overlay for texture */}
      <div className="grain-overlay pointer-events-none"></div>

      <Navbar />

      <main className="flex-grow z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </main>

      <Footer />
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#13131A',
            color: '#F8FAFC',
            border: '1px solid #2D2D3F',
          },
        }}
      />
    </div>
  )
}

export default App
