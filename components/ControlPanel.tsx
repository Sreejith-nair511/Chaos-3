'use client'

interface ControlPanelProps {
  onInjectTraffic: () => void
  onInjectLatency: () => void
  onForceAnomaly: () => void
  onInjectUnknownAttack?: () => void
}

export default function ControlPanel({ onInjectTraffic, onInjectLatency, onForceAnomaly, onInjectUnknownAttack }: ControlPanelProps) {
  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">System Controls</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={onInjectTraffic}
          className="py-2 px-3 sm:px-4 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500/30 transition-all duration-300 text-xs sm:text-sm font-medium"
        >
          Inject DDoS
        </button>

        <button
          onClick={onInjectLatency}
          className="py-2 px-3 sm:px-4 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30 transition-all duration-300 text-xs sm:text-sm font-medium"
        >
          Inject MITM
        </button>

        <button
          onClick={onForceAnomaly}
          className="py-2 px-3 sm:px-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all duration-300 text-xs sm:text-sm font-medium"
        >
          Force Anomaly
        </button>

        <button
          onClick={onInjectUnknownAttack}
          className="py-2 px-3 sm:px-4 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30 transition-all duration-300 text-xs sm:text-sm font-medium"
        >
          Inject Unknown Attack
        </button>
      </div>

      <p className="text-xs text-muted-foreground italic">
        Use these controls to simulate system events and observe autonomous defense mechanisms in action.
      </p>
    </div>
  )
}
