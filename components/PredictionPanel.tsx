'use client'

import { DashboardState } from '@/app/page'

interface PredictionPanelProps {
  state: DashboardState
}

export default function PredictionPanel({ state }: PredictionPanelProps) {
  const getTrendIndicator = () => {
    if (state.cpu_history.length < 3) return '—'
    const lastThree = state.cpu_history.slice(-3)
    const isRising = lastThree[2] > lastThree[0]
    return isRising ? '↑' : '↓'
  }

  const getRiskLevel = () => {
    if (state.prediction_confidence < 30) return 'LOW'
    if (state.prediction_confidence < 60) return 'MEDIUM'
    if (state.prediction_confidence < 85) return 'HIGH'
    return 'CRITICAL'
  }

  const getRiskColor = () => {
    const level = getRiskLevel()
    if (level === 'CRITICAL') return 'text-red-400 border-red-500/50 bg-red-500/10'
    if (level === 'HIGH') return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10'
    if (level === 'MEDIUM') return 'text-yellow-300 border-yellow-400/50 bg-yellow-400/10'
    return 'text-green-400 border-green-500/50 bg-green-500/10'
  }

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4 lg:col-span-1">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Predictive Intelligence</h2>

      <div className="space-y-4">
        {state.predicted_failure ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Failure Risk</span>
              <span className="text-lg sm:text-2xl font-bold text-red-400">
                {state.prediction_confidence.toFixed(0)}%
              </span>
            </div>

            <div className={`p-3 rounded-lg border ${getRiskColor()}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold">{getRiskLevel()} RISK</span>
                <span className="text-lg">{getTrendIndicator()}</span>
              </div>
              <p className="text-xs sm:text-sm">Trending upward in last 5 samples</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Estimated time to failure</span>
                <span className="text-cyan-400 font-mono">5 - 15 min</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Primary threat vector</span>
                <span className="text-cyan-400 font-mono">Resource saturation</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">System Health</span>
              <span className="text-lg sm:text-2xl font-bold text-green-400">
                {(100 - state.prediction_confidence).toFixed(0)}%
              </span>
            </div>

            <div className="p-3 rounded-lg border border-green-500/50 bg-green-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-green-400">STABLE</span>
                <span className="text-lg text-green-400">{getTrendIndicator()}</span>
              </div>
              <p className="text-xs sm:text-sm text-green-300">No anomalies detected</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Trend direction</span>
                <span className="text-cyan-400 font-mono">Stable</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Last update</span>
                <span className="text-cyan-400 font-mono">Real-time</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
