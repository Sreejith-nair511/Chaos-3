let SerialPortInstance: any = null;

export interface ServiceStatus {
  edge_device_service: 'RUNNING' | 'RESTARTING';
  telemetry_service: 'RUNNING' | 'RESTARTING';
  detection_service: 'RUNNING' | 'RESTARTING';
  security_service: 'RUNNING' | 'RESTARTING';
  recovery_service: 'RUNNING' | 'RESTARTING';
  orchestrator_service: 'RUNNING' | 'RESTARTING';
}

export interface GlobalState {
  device_name: string;
  system_active: boolean;
  cpu_usage: number;
  memory_usage: number;
  packet_loss: number;
  response_time: number;
  request_rate: number;
  heartbeat_delay: number;
  anomaly_score: number;
  ml_status: 'NORMAL' | 'WARNING' | 'FAILURE';
  active_attack: string | null;
  attack_type: string | null;
  threat_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
  defense_action: string | null;
  predicted_failure: boolean;
  prediction_confidence: number;
  system_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  services: ServiceStatus;
  cpu_history: number[];
  memory_history: number[];
  delay_history: number[];
  logs: Record<string, string[]>;
}

const initialState: GlobalState = {
  device_name: 'Detecting Edge Device...',
  system_active: false,
  cpu_usage: 0,
  memory_usage: 0,
  packet_loss: 0,
  response_time: 0,
  request_rate: 0,
  heartbeat_delay: 0,
  anomaly_score: 0,
  ml_status: 'NORMAL',
  active_attack: null,
  attack_type: null,
  threat_level: null,
  defense_action: null,
  predicted_failure: false,
  prediction_confidence: 0,
  system_status: 'HEALTHY',
  services: {
    edge_device_service: 'RUNNING',
    telemetry_service: 'RUNNING',
    detection_service: 'RUNNING',
    security_service: 'RUNNING',
    recovery_service: 'RUNNING',
    orchestrator_service: 'RUNNING',
  },
  cpu_history: [],
  memory_history: [],
  delay_history: [],
  logs: {
    device: [],
    telemetry: [],
    detection: [],
    security: [],
    recovery: [],
    orchestrator: [],
  },
};

// Use global to persist state in development (HMR)
const globalForSystem = global as unknown as { systemState: GlobalState; loopsStarted: boolean };

if (!globalForSystem.systemState) {
  globalForSystem.systemState = { ...initialState };
}

export const state = globalForSystem.systemState;

const addLog = (category: string, message: string) => {
  if (!state.logs[category]) state.logs[category] = [];
  state.logs[category] = [message, ...state.logs[category]].slice(0, 10);
};

// 1. Edge Device Service
async function edgeDeviceService() {
  try {
    if (!SerialPortInstance) {
      try {
        const sp = require('serialport');
        SerialPortInstance = sp.SerialPort;
      } catch (e) {
        SerialPortInstance = { list: async () => [] };
      }
    }
    const ports = await SerialPortInstance.list();
    const hasCOM = ports.length > 0;
    
    if (hasCOM && !state.system_active) {
      state.device_name = "Arduino Uno";
      state.system_active = true;
      addLog("device", "DEVICE CONNECTED: Arduino Uno");
    } else if (!hasCOM && state.system_active) {
      // Don't auto-disconnect if manually connected? 
      // For now, follow the "IF any COM port exists... ELSE... system_active = False" rule.
      state.device_name = "Detecting Edge Device...";
      state.system_active = false;
      addLog("device", "DEVICE DISCONNECTED");
    }
  } catch (e) {
    // Fallback if serialport fails or not available
  }
}

export function manualConnect(name?: string) {
  state.device_name = name || "Arduino Uno (Manual)";
  state.system_active = true;
  addLog("device", `MANUAL CONNECTION ESTABLISHED: ${state.device_name}`);
}

export function manualDisconnect() {
  state.device_name = "Detecting Edge Device...";
  state.system_active = false;
  addLog("device", "MANUAL DISCONNECTION");
}

export function injectAttack(type: string) {
  if (!state.system_active) return;
  
  if (type === 'ddos') {
    state.active_attack = 'ddos';
    addLog("security", "MANUAL TRIGGER: Injecting DDoS traffic");
  } else if (type === 'mitm') {
    state.active_attack = 'mitm';
    addLog("security", "MANUAL TRIGGER: Injecting MITM latency");
  } else if (type === 'anomaly') {
    state.active_attack = 'anomaly';
    addLog("detection", "MANUAL TRIGGER: Forcing ML Anomaly");
  } else if (type === 'unknown') {
    state.active_attack = 'unknown';
    addLog("security", "MANUAL TRIGGER: Injecting unknown zero-day");
  }
}

// 2. Telemetry Service
function telemetryService() {
  if (state.system_active) {
    if (state.active_attack === 'ddos') {
      state.cpu_usage = Math.floor(Math.random() * 10 + 85);
      state.request_rate = Math.floor(Math.random() * 200 + 800);
      state.memory_usage = Math.floor(Math.random() * 10 + 75);
      state.packet_loss = Math.floor(Math.random() * 2 + 1);
    } else if (state.active_attack === 'mitm') {
      state.response_time = Number((Math.random() * 1.5 + 2.0).toFixed(2));
      state.packet_loss = Math.floor(Math.random() * 5 + 5);
      state.cpu_usage = Math.floor(Math.random() * 20 + 40);
      state.request_rate = Math.floor(Math.random() * 50 + 100);
    } else if (state.active_attack === 'anomaly') {
      state.response_time = Number((Math.random() * 0.8 + 1.5).toFixed(2));
      state.cpu_usage = Math.floor(Math.random() * 20 + 70);
      state.packet_loss = Math.floor(Math.random() * 3 + 2);
    } else if (state.active_attack === 'unknown') {
      state.cpu_usage = Math.floor(Math.random() * 30 + 60);
      state.response_time = Number((Math.random() * 1.0 + 1.0).toFixed(2));
      state.packet_loss = Math.floor(Math.random() * 10 + 2);
    } else {
      state.cpu_usage = Math.floor(Math.random() * (75 - 40 + 1)) + 40;
      state.memory_usage = Math.floor(Math.random() * (85 - 50 + 1)) + 50;
      state.packet_loss = Math.floor(Math.random() * 3); // 0-2
      state.response_time = Number((Math.random() * (1.2 - 0.3) + 0.3).toFixed(2));
      state.request_rate = Math.floor(Math.random() * (200 - 80 + 1)) + 80;
    }
    state.heartbeat_delay = Number((state.response_time * 0.8).toFixed(2));
  } else {
    state.cpu_usage = 0;
    state.memory_usage = 0;
    state.packet_loss = 0;
    state.response_time = 0;
    state.request_rate = 0;
    state.heartbeat_delay = 0;
  }
  
  if (state.system_active) {
    state.cpu_history = [...state.cpu_history, state.cpu_usage].slice(-30);
    state.memory_history = [...state.memory_history, state.memory_usage].slice(-30);
    state.delay_history = [...state.delay_history, state.response_time].slice(-30);
    addLog("telemetry", "TELEMETRY UPDATED");
  }
}

// 3. Detection Service (ML)
function detectionService() {
  state.anomaly_score = Number((state.response_time * 0.6 + state.cpu_usage * 0.01 + state.packet_loss * 0.2).toFixed(2));
  
  if (state.anomaly_score > 1.5) {
    state.ml_status = 'FAILURE';
    addLog("detection", "ML DETECTED ANOMALY");
  } else if (state.anomaly_score > 0.8) {
    state.ml_status = 'WARNING';
  } else {
    state.ml_status = 'NORMAL';
  }
}

// 4. Security Service
function securityService() {
  if (state.request_rate > 180) {
    state.attack_type = "DDoS";
    state.threat_level = 'CRITICAL';
    state.defense_action = "throttle traffic";
    addLog("security", "ATTACK DETECTED: DDoS");
    addLog("security", "DEFENSE APPLIED: throttle traffic");
  } else if (state.response_time > 1.0 && state.packet_loss > 1) {
    state.attack_type = "MITM";
    state.threat_level = 'HIGH';
    state.defense_action = "secure channel";
    addLog("security", "ATTACK DETECTED: MITM");
    addLog("security", "DEFENSE APPLIED: secure channel");
  } else if (state.ml_status === 'FAILURE') {
    state.attack_type = "UNKNOWN";
    state.threat_level = 'MEDIUM';
    state.defense_action = "isolate node";
    addLog("security", "ATTACK DETECTED: UNKNOWN");
    addLog("security", "DEFENSE APPLIED: isolate node");
  } else {
    state.attack_type = null;
    state.threat_level = 'LOW';
    state.defense_action = null;
  }
}

// 5. Orchestrator Service (K8s)
async function orchestratorService() {
  if (state.ml_status === 'FAILURE' || state.attack_type) {
    addLog("orchestrator", "K8s restarting services");
    Object.keys(state.services).forEach(s => {
      state.services[s as keyof ServiceStatus] = 'RESTARTING';
    });
    
    setTimeout(() => {
      Object.keys(state.services).forEach(s => {
        state.services[s as keyof ServiceStatus] = 'RUNNING';
      });
      state.active_attack = null; // Clear the attack flag after recovery
      addLog("orchestrator", "K8s stabilized");
    }, 2000);
  }
}

// 6. Recovery Service
function recoveryService() {
  const previousStatus = state.system_status;
  
  // Determine new status based on ML and Security
  if (state.attack_type || state.ml_status === 'FAILURE') {
    state.system_status = 'CRITICAL';
  } else if (state.ml_status === 'WARNING') {
    state.system_status = 'WARNING';
  } else {
    state.system_status = 'HEALTHY';
  }

  // Log recovery only when transitioning back to HEALTHY from a worse state
  if (previousStatus !== 'HEALTHY' && state.system_status === 'HEALTHY') {
    addLog("recovery", "RECOVERY COMPLETE: System health restored");
  }
}

// Prediction Engine (Trend based)
function predictionEngine() {
  const cpuTrend = state.cpu_history.slice(-5);
  const delayTrend = state.delay_history.slice(-5);
  
  const isCpuRising = cpuTrend.length >= 5 && cpuTrend[4] > cpuTrend[0] + 10;
  const isDelayRising = delayTrend.length >= 5 && delayTrend[4] > delayTrend[0] + 0.3;
  
  if (isCpuRising && isDelayRising) {
    state.predicted_failure = true;
    state.prediction_confidence = 85;
    addLog("recovery", "PREDICTED FAILURE"); // Putting it in recovery or detection? User log list just said "PREDICTED FAILURE".
  } else {
    state.predicted_failure = false;
    state.prediction_confidence = 0;
  }
}

export function startServices() {
  if (globalForSystem.loopsStarted) return;
  globalForSystem.loopsStarted = true;

  setInterval(() => {
    edgeDeviceService();
    telemetryService();
    detectionService();
    securityService();
    orchestratorService();
    recoveryService();
    predictionEngine();
  }, 1000);
}
