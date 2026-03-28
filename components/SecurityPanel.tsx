'use client'

import { DashboardState } from '@/app/page'

interface SecurityPanelProps {
  state: DashboardState
}

export default function SecurityPanel({ state }: SecurityPanelProps) {
  const getThreatColor = (level: string | null) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30 glow-red'
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 glow-yellow'
      case 'LOW':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-secondary text-secondary-foreground border-border'
    }
  }

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4 lg:col-span-1">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Security Status</h2>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Threat Type</p>
          {state.attack_type ? (
            <p className="text-sm font-mono font-semibold text-cyan-400">{state.attack_type}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No active threats</p>
          )}
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Threat Level</p>
          {state.threat_level ? (
            <div className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getThreatColor(state.threat_level)}`}>
              {state.threat_level}
            </div>
          ) : (
            <div className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border bg-green-500/20 text-green-400 border-green-500/30">
              SECURE
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Defense Action</p>
          {state.defense_action ? (
            <p className="text-xs sm:text-sm font-mono text-blue-400">{state.defense_action}</p>
          ) : (
            <p className="text-xs text-muted-foreground italic">Monitoring active</p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${state.threat_level ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs font-medium text-foreground">
              {state.threat_level ? 'THREAT ACTIVE' : 'ALL SECURE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
