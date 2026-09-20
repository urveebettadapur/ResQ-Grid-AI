// Offline Outbox Queue & Mesh Relay Simulator

const QUEUE_KEY = 'resq_offline_outbox_queue';
const MESH_HOPS_KEY = 'resq_mesh_node_count';

export function getOfflineQueue() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading offline queue:', e);
    return [];
  }
}

export function saveToOfflineQueue(sosPayload) {
  try {
    const queue = getOfflineQueue();
    const packet = {
      ...sosPayload,
      id: `OFFLINE-MESH-${Math.floor(1000 + Math.random() * 9000)}`,
      queuedAt: new Date().toISOString(),
      meshHops: Math.floor(1 + Math.random() * 3), // Simulates 1-3 peer hops
      isQueuedOffline: true
    };
    queue.unshift(packet);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return packet;
  } catch (e) {
    console.error('Error saving to offline queue:', e);
    return null;
  }
}

export function clearOfflineQueue() {
  try {
    localStorage.removeItem(QUEUE_KEY);
  } catch (e) {
    console.error('Error clearing offline queue:', e);
  }
}

export function getMeshPeerCount() {
  // Simulates 3 to 7 nearby peer nodes in direct WiFi-Direct/Bluetooth range
  return Math.floor(4 + Math.sin(Date.now() / 10000) * 2);
}
