import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts'
import useStore from '../store/useStore'

const Insights = () => {
  const { modelStats, bestModel, fetchModelStats } = useStore()

  useEffect(() => {
    if (!modelStats) {
      fetchModelStats()
    }
  }, [modelStats, fetchModelStats])

  if (!modelStats) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-light"></div>
      </div>
    )
  }

  // Prep data for Bar Chart
  const barData = Object.keys(modelStats).map(key => ({
    name: key.replace('_', ' ').toUpperCase(),
    Accuracy: modelStats[key].accuracy,
    Precision: modelStats[key].precision,
    Recall: modelStats[key].recall,
    F1: modelStats[key].f1,
  }))

  const getRadarData = (stats) => [
    { subject: 'Accuracy', A: stats.accuracy, fullMark: 1 },
    { subject: 'Precision', A: stats.precision, fullMark: 1 },
    { subject: 'Recall', A: stats.recall, fullMark: 1 },
    { subject: 'F1', A: stats.f1, fullMark: 1 },
  ]

  // Render a specific confusion matrix as a heatmap
  const renderConfusionMatrix = (matrix) => {
    const maxVal = Math.max(...matrix.flat())
    return (
      <div className="grid gap-1 mt-4" style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}>
        {matrix.flat().map((val, i) => {
          const intensity = maxVal === 0 ? 0 : val / maxVal
          return (
            <div 
              key={i} 
              className="aspect-square flex items-center justify-center text-xs font-bold rounded-sm tooltip-trigger relative group"
              style={{ 
                backgroundColor: `rgba(124, 58, 237, ${Math.max(0.1, intensity)})`,
                color: intensity > 0.5 ? '#fff' : '#A78BFA'
              }}
            >
              {val}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-cinzel font-bold text-white mb-3">Model Intelligence</h1>
        <p className="text-gray-400">How Aura Cinema thinks and evaluates recommendations</p>
      </div>

      {/* Best Model Banner */}
      {bestModel && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-[#5B21B6]/40 to-[#13131A] border border-purple/50 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-4xl">🏆</span>
            <div>
              <h2 className="text-xl font-bold text-white">Best Performing Model</h2>
              <p className="text-purple-light uppercase tracking-wider text-sm">
                {bestModel.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {Object.entries(modelStats[bestModel]).map(([key, val]) => {
              if (key === 'confusion_matrix') return null
              return (
                <div key={key} className="bg-cosmic border border-cosmic-border px-4 py-2 rounded-lg text-center min-w-[90px]">
                  <div className="text-xs text-gray-400 capitalize mb-1">{key}</div>
                  <div className="text-lg font-bold text-gold">{val.toFixed(2)}</div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Bar Chart Overview */}
      <h2 className="text-2xl font-cinzel font-bold text-white mb-6 border-b border-cosmic-border pb-2">
        Performance Comparison
      </h2>
      <div className="h-[400px] w-full bg-cosmic-light border border-cosmic-border rounded-xl p-6 mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3F" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 1]} />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#13131A', borderColor: '#2D2D3F', color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="Accuracy" fill="#7C3AED" radius={[4,4,0,0]} />
            <Bar dataKey="Precision" fill="#A78BFA" radius={[4,4,0,0]} />
            <Bar dataKey="Recall" fill="#F59E0B" radius={[4,4,0,0]} />
            <Bar dataKey="F1" fill="#ec4899" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Cards with Radar & Confusion Matrix */}
      <h2 className="text-2xl font-cinzel font-bold text-white mb-6 border-b border-cosmic-border pb-2">
        Detailed Model Profiles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(modelStats).map(([modelName, stats], index) => (
          <motion.div 
            key={modelName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-cosmic-light border rounded-xl p-6 flex flex-col ${
              modelName === bestModel ? 'border-purple shadow-[0_0_20px_rgba(124,58,237,0.15)]' : 'border-cosmic-border'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white capitalize flex items-center gap-2">
                {modelName.replace('_', ' ')}
                {modelName === bestModel && <span title="Best Model">👑</span>}
              </h3>
            </div>
            
            <div className="flex-grow flex flex-col xl:flex-row gap-6 mb-6">
              {/* Radar Chart */}
              <div className="w-full xl:w-1/2 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(stats)}>
                    <PolarGrid stroke="#2D2D3F" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#A78BFA', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                    <Radar
                      name={modelName}
                      dataKey="A"
                      stroke="#7C3AED"
                      fill="#7C3AED"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Confusion Matrix */}
              <div className="w-full xl:w-1/2 flex flex-col justify-center">
                <span className="text-xs text-gray-400 text-center block mb-2 font-mono">Heatmap Matrix</span>
                {renderConfusionMatrix(stats.confusion_matrix)}
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Insights
