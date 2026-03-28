'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '@/components/Header'
import DevicePanel from '@/components/DevicePanel'
import TelemetryPanel from '@/components/TelemetryPanel'
import GraphPanel from '@/components/GraphPanel'
import MLDetectionPanel from '@/components/MLDetectionPanel'
import SecurityPanel from '@/components/SecurityPanel'
import RootCausePanel from '@/components/RootCausePanel'
import PredictionPanel from '@/components/PredictionPanel'
import MicroserviceGrid from '@/components/MicroserviceGrid'
import KubernetesFlow from '@/components/KubernetesFlow'
import LogPanel from '@/components/LogPanel'
import ControlPanel from '@/components/ControlPanel'

export interface DashboardState {
  device_name: string
  system_status: 'INITIALIZING' | 'ACTIVE' | 'HEALTHY' | 'WARNING' | 'CRITICAL'
  system_active: boolean
  cpu_usage: number
  memory_usage: number
  packet_loss: number
  response_time: number
  heartbeat_delay: number
  request_rate: number
  anomaly_score: number
  ml_status: 'NORMAL' | 'WARNING' | 'FAILURE'
  ml_confidence: number
  active_attack: string | null
  attack_type: string | null
  threat_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null
  defense_action: string | null
  root_cause: string | null
  predicted_failure: boolean
  prediction_confidence: number
  cpu_history: number[]
  memory_history: number[]
  delay_history: number[]
  services: Record<string, 'RUNNING' | 'RESTARTING'>
  logs: Record<string, string[]>
}

const SERVICES = [
  'edge_device_service',
  'telemetry_service',
  'detection_service',
  'security_service',
  'recovery_service',
  'orchestrator_service',
]

const generateMetrics = (active: boolean, isAnomalous: boolean) => {
  if (!active) {
    return {
      cpu: Math.random() * 15 + 10,
      memory: Math.random() * 20 + 20,
      packet_loss: Math.random() * 0.5,
      response_time: Math.random() * 0.3 + 0.1,
      request_rate: Math.random() * 30 + 10,
    }
  }

  if (isAnomalous) {
    return {
      cpu: Math.random() * 35 + 70,
      memory: Math.random() * 20 + 75,
      packet_loss: Math.random() * 8 + 5,
      response_time: Math.random() * 1 + 1.5,
      request_rate: Math.random() * 400 + 600,
    }
  }

  return {
    cpu: Math.random() * 35 + 40,
    memory: Math.random() * 35 + 50,
    packet_loss: Math.random() * 2,
    response_time: Math.random() * 0.9 + 0.3,
    request_rate: Math.random() * 120 + 80,
  }
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    device_name: 'Detecting Edge Device...',
    system_status: 'INITIALIZING',
    system_active: false,
    cpu_usage: 0,
    memory_usage: 0,
    packet_loss: 0,
    response_time: 0,
    heartbeat_delay: 0,
    request_rate: 0,
    anomaly_score: 0,
    ml_status: 'NORMAL',
    ml_confidence: 0,
    active_attack: null,
    attack_type: null,
    threat_level: null,
    defense_action: null,
    root_cause: null,
    predicted_failure: false,
    prediction_confidence: 0,
    cpu_history: [],
    memory_history: [],
    delay_history: [],
    services: {
      edge_device_service: 'RUNNING',
      telemetry_service: 'RUNNING',
      detection_service: 'RUNNING',
      security_service: 'RUNNING',
      recovery_service: 'RUNNING',
      orchestrator_service: 'RUNNING',
    },
    logs: {
      device: [],
      telemetry: [],
      detection: [],
      security: [],
      recovery: [],
      orchestrator: [],
    },
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        
        // Calculate additional UI-only state if needed
        const mlConfidence = data.anomaly_score > 1.5 ? Math.min(99, (data.anomaly_score / 3) * 100) : 
                            data.anomaly_score > 0.8 ? Math.min(95, (data.anomaly_score / 2) * 100) : 
                            Math.max(0, 100 - data.anomaly_score * 50);
        
        setState({
          ...data,
          ml_confidence: mlConfidence,
          root_cause: data.attack_type ? (data.attack_type === 'DDoS' ? 'Request rate spike' : data.attack_type === 'MITM' ? 'Network instability' : 'Compute overload') : null
        })
      } catch (error) {
        console.error('Failed to fetch system status:', error)
      }
    }

    const handleDisconnect = () => {
      console.log('Hardware disconnected')
      handleManualDisconnect()
    }

    if ('serial' in navigator) {
      (navigator as any).serial.addEventListener('disconnect', handleDisconnect)
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 1000)
    return () => {
      clearInterval(interval)
      if ('serial' in navigator) {
        (navigator as any).serial.removeEventListener('disconnect', handleDisconnect)
      }
    }
  }, [])

  const handleWebSerialConnect = async () => {
    try {
      if (!('serial' in navigator)) {
        alert('Web Serial API is not supported in this browser. Falling back to manual simulation.')
        await fetch('/api/control/connect', { method: 'POST', body: JSON.stringify({ name: 'Simulated Device' }) })
        return
      }

      // Request a port from the user
      const port = await (navigator as any).serial.requestPort()
      await port.open({ baudRate: 9600 })
      
      // Notify backend of successful hardware connection
      await fetch('/api/control/connect', { 
        method: 'POST', 
        body: JSON.stringify({ name: 'Arduino Uno (Web Serial)' }) 
      })
      
      console.log('Successfully connected via Web Serial')
    } catch (error) {
      console.error('Web Serial connection failed:', error)
      if ((error as any).name !== 'NotFoundError') {
        alert('Failed to connect to the serial port.')
      }
    }
  }

  const handleManualDisconnect = async () => {
    try {
      await fetch('/api/control/disconnect', { method: 'POST' })
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  const handleInjectAttack = async (type: string) => {
    try {
      await fetch('/api/control/attack', { 
        method: 'POST', 
        body: JSON.stringify({ attackType: type }) 
      })
    } catch (error) {
      console.error('Failed to inject attack:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyan-500/30">
      <Header deviceName={state.device_name} systemStatus={state.system_status} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground/90 uppercase">System Chaos Injection</h2>
            <div className="h-px flex-1 mx-4 bg-border/40"></div>
          </div>
          <ControlPanel
            onInjectTraffic={() => handleInjectAttack('ddos')}
            onInjectLatency={() => handleInjectAttack('mitm')}
            onForceAnomaly={() => handleInjectAttack('anomaly')}
            onInjectUnknownAttack={() => handleInjectAttack('unknown')}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          <DevicePanel 
            deviceName={state.device_name} 
            systemStatus={state.system_status} 
            systemActive={state.system_active}
            onConnect={handleWebSerialConnect} 
            onDisconnect={handleManualDisconnect} 
          />
          <TelemetryPanel state={state} />
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground/90 uppercase">Autonomous Intelligence Overview</h2>
            <div className="h-px flex-1 mx-4 bg-border/40"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <MLDetectionPanel state={state} />
            <SecurityPanel state={state} />
            <PredictionPanel state={state} />
          </div>

          <GraphPanel state={state} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground/90 uppercase">Chaos Recovery System</h2>
            <div className="h-px flex-1 mx-4 bg-border/40"></div>
          </div>
          <MicroserviceGrid state={state} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <KubernetesFlow state={state} />
          <RootCausePanel state={state} />
        </section>
        
        <LogPanel logs={state.logs} />
      </main>
    </div>
  )
}
