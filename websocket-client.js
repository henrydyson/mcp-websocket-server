#!/usr/bin/env node

import { WebSocket } from 'ws';
import { createInterface } from 'readline';

const WS_URL = process.argv[2] || 'wss://mcp-websocket-server.onrender.com/mcp';

console.error(`Connecting to ${WS_URL}...`);

const ws = new WebSocket(WS_URL);
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

ws.on('open', () => {
  console.error('Connected to WebSocket server');
  
  // Forward stdin to WebSocket
  rl.on('line', (line) => {
    ws.send(line);
  });
});

ws.on('message', (data) => {
  // Forward WebSocket messages to stdout
  console.log(data.toString());
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
  process.exit(1);
});

ws.on('close', () => {
  console.error('WebSocket connection closed');
  process.exit(0);
});

// Handle process termination
process.on('SIGINT', () => {
  ws.close();
  process.exit(0);
});
