'use client'

interface DevicePanelProps {
  deviceName: string
  systemStatus: string
  systemActive: boolean
  onConnect: () => void
  onDisconnect?: () => void
}

export default function DevicePanel({ deviceName, systemStatus, systemActive, onConnect, onDisconnect }: DevicePanelProps) {
  const isConnected = systemActive

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 space-y-4 lg:col-span-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Edge Device</h2>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isConnected
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}
        >
          {isConnected ? 'ACTIVE' : 'INITIALIZING'}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Device Name</p>
          <p className="text-sm sm:text-base font-mono text-cyan-400">{deviceName}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">System Status</p>
          <p className="text-sm font-semibold text-foreground capitalize">{systemStatus}</p>
        </div>
      </div>

      <div className="space-y-2">
        {!isConnected ? (
          <button
            onClick={onConnect}
            className="w-full py-2 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-primary-foreground font-medium hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 text-xs sm:text-sm glow-cyan"
          >
            Connect Arduino Uno
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            className="w-full py-2 px-3 sm:px-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 font-medium hover:bg-red-500/30 transition-all duration-300 text-xs sm:text-sm"
          >
            Disconnect Device
          </button>
        )}
      </div>
    </div>
  )
}
