'use client'

import { DashboardState } from '@/app/page'
import { useEffect, useState } from 'react'

interface PredictionMapProps {
  state: DashboardState
}

export default function PredictionMap({ state }: PredictionMapProps) {
  const [activeNodes, setActiveNodes] = useState<number[]>([])

  useEffect(() => {
    // Determine active nodes based on system activity and attacks
    if (state.system_active) {
      if (state.attack_type || state.ml_status === 'FAILURE') {
        const attackNodes = [2, 4, 7]
        setActiveNodes(attackNodes)
      } else {
        const bgNodes = [1, 3, 5]
        setActiveNodes(bgNodes)
      }
    } else {
      setActiveNodes([])
    }
  }, [state.system_active, state.attack_type, state.ml_status])

  const nodes = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    cx: Math.cos((i / 8) * Math.PI * 2) * 120 + 200,
    cy: Math.sin((i / 8) * Math.PI * 2) * 80 + 150,
  }))

  const centerNode = { id: 0, cx: 200, cy: 150 }

  return (
    <div className="cyber-border rounded-lg p-4 sm:p-6 lg:col-span-2 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background h-full min-h-[300px]">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-sm font-semibold text-foreground bg-background/80 px-2 py-1 rounded backdrop-blur">Global Threat Prediction Map</h2>
      </div>

      {state.attack_type && (
        <div className="absolute top-4 right-4 z-10 animate-pulse text-red-500 font-bold border border-red-500/50 bg-red-500/10 px-3 py-1 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          {state.attack_type} DETECTED
        </div>
      )}

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <svg className="w-full h-full min-h-[300px] z-10 relative" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
        </defs>

        {/* Connections Line */}
        {nodes.map((node) => {
          const isActive = activeNodes.includes(node.id)
          const isAttack = state.attack_type !== null && isActive

          return (
            <line
              key={`connection-${node.id}`}
              x1={node.cx}
              y1={node.cy}
              x2={centerNode.cx}
              y2={centerNode.cy}
              className={`transition-colors duration-500 ${
                isAttack ? 'stroke-red-500/70' : isActive ? 'stroke-cyan-500/40' : 'stroke-gray-600/20'
              }`}
              strokeWidth={isAttack ? 2 : 1}
              strokeDasharray={isAttack ? "5,5" : "none"}
            >
              {/* Moving Packet Animation */}
              {isActive && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </line>
          )
        })}

        {/* Outer Nodes */}
        {nodes.map((node) => {
          const isActive = activeNodes.includes(node.id)
          const isAttack = state.attack_type !== null && isActive

          return (
            <g key={`node-${node.id}`}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isActive ? 6 : 4}
                className={`transition-all duration-300 ${
                  isAttack ? 'fill-red-500 animate-pulse' : isActive ? 'fill-cyan-400 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'fill-gray-600'
                }`}
              />
              <text x={node.cx} y={node.cy + 15} fontSize="8" fill="rgba(255,255,255,0.5)" textAnchor="middle">
                Node {node.id}
              </text>
            </g>
          )
        })}

        {/* Center Target Node */}
        <circle
          cx={centerNode.cx}
          cy={centerNode.cy}
          r={12}
          className={`${
            state.system_status === 'CRITICAL'
              ? 'fill-red-500 filter drop-shadow-[0_0_15px_rgba(239,68,68,1)] animate-ping'
              : state.system_status === 'WARNING'
              ? 'fill-yellow-500 filter drop-shadow-[0_0_12px_rgba(234,179,8,1)]'
              : state.system_active
              ? 'fill-green-500 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]'
              : 'fill-gray-500'
          } transition-colors duration-500`}
        />
        <text x={centerNode.cx} y={centerNode.cy + 25} fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">
          Edge Core
        </text>

        {/* Radar Sweep Effect */}
        {state.system_active && (
          <path
            d={`M 200 150 L 200 50 A 100 100 0 0 1 300 150 Z`}
            fill="url(#radarSweep)"
            className="origin-[200px_150px] animate-spin"
            style={{ animationDuration: '4s' }}
          />
        )}
        <defs>
          <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
