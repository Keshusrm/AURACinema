import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:8000'

const useStore = create((set, get) => ({
  // State
  searchQuery: '',
  results: [],
  isLoading: false,
  modelStats: null,
  bestModel: null,
  hasSearched: false,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchRecommendations: async (query, topN = 6) => {
    if (!query.trim()) return
    set({ isLoading: true, hasSearched: true })
    try {
      const res = await axios.post(`${API_BASE}/recommend`, {
        query: query.trim(),
        top_n: topN,
      })
      set({
        results: res.data.results,
        modelStats: res.data.model_scores,
        bestModel: res.data.best_model,
        isLoading: false,
      })
    } catch (err) {
      console.error('Recommendation error:', err)
      toast.error('Failed to fetch recommendations. Is the backend running?')
      set({ isLoading: false, results: [] })
    }
  },

  fetchModelStats: async () => {
    try {
      const res = await axios.get(`${API_BASE}/model-stats`)
      set({
        modelStats: res.data.model_scores,
        bestModel: res.data.best_model,
      })
    } catch (err) {
      console.error('Model stats error:', err)
      toast.error('Failed to load model statistics.')
    }
  },
}))

export default useStore
