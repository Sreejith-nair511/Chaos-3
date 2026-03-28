'use client'

import { DashboardState } from '@/app/page'

interface RootCausePanelProps {
  state: DashboardState
}

export default function RootCausePanel({ state }: RootCausePanelProps) {
  const getCauseIcon = (cause: string) => {
    if (cause?.includes('overload')) return 'CPU'
    if (cause?.includes('Network')) return 'NET'
    if (cause?.includes('Latency')) return 'LAT'
    return 'SYS'
  }

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Root Cause Analysis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-secondary/30 rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Primary Issue</p>
          {state.root_cause ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold mb-2">
                {getCauseIcon(state.root_cause)}
              </div>
              <p className="text-sm font-semibold text-foreground">{state.root_cause}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">No anomalies detected</p>
          )}
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Anomaly Score</p>
          <p className="text-2xl font-bold text-cyan-400">{state.anomaly_score.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {state.anomaly_score > 1.5 ? 'Critical' : state.anomaly_score > 0.8 ? 'Warning' : 'Normal'}
          </p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">CPU Impact</p>
          <p className="text-2xl font-bold text-orange-400">{state.cpu_usage.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {state.cpu_usage > 80 ? 'High' : state.cpu_usage > 60 ? 'Moderate' : 'Normal'}
          </p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Latency Impact</p>
          <p className="text-2xl font-bold text-blue-400">{state.response_time.toFixed(2)}s</p>
          <p className="text-xs text-muted-foreground mt-1">
            {state.response_time > 1 ? 'High' : state.response_time > 0.5 ? 'Moderate' : 'Low'}
          </p>
        </div>
      </div>
    </div>
  )
}
