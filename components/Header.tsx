'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
  deviceName: string
  systemStatus: string
}

export default function Header({ deviceName, systemStatus }: HeaderProps) {
  const [time, setTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(new Date().toLocaleTimeString())
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'INITIALIZING':
        return 'text-yellow-400'
      case 'ACTIVE':
      case 'HEALTHY':
        return 'text-green-400'
      case 'WARNING':
        return 'text-yellow-400'
      case 'CRITICAL':
        return 'text-red-400'
      default:
        return 'text-cyan-400'
    }
  }

  const getStatusGlow = () => {
    switch (systemStatus) {
      case 'INITIALIZING':
        return 'glow-yellow'
      case 'ACTIVE':
      case 'HEALTHY':
        return 'glow-green'
      case 'WARNING':
        return 'glow-yellow'
      case 'CRITICAL':
        return 'glow-red'
      default:
        return 'glow-cyan'
    }
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md cyber-border sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center glow-cyan-lg flex-shrink-0">
            <span className="text-sm sm:text-lg font-bold text-primary-foreground">PS</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent truncate">
              PS1 Control Plane
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Edge Infrastructure Defense</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div className="text-right text-xs sm:text-sm hidden sm:block">
            <div className={`font-mono text-xs h-4 ${getStatusColor()}`}>
              {mounted && time}
            </div>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${getStatusGlow()}`}>
              {systemStatus}
            </div>
          </div>
          <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full animate-pulse ${
            systemStatus === 'CRITICAL' ? 'bg-red-500' : 
            systemStatus === 'WARNING' ? 'bg-yellow-500' : 
            'bg-green-500'
          }`}></div>
        </div>
      </div>
    </header>
  )
}
