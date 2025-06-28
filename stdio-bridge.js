#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/node/stdio.js';
import { WebSocket } from 'ws';

const WEBSOCKET_URL = process.argv[2] || 'wss://mcp-websocket-server.onrender.com/mcp';

async function main() {
  console.error(`Connecting to WebSocket: ${WEBSOCKET_URL}`);
  
  const ws = new WebSocket(WEBSOCKET_URL);
  const transport = new StdioServerTransport();
  
  // Wait for WebSocket to connect
  await new Promise((resolve, reject) => {
    ws.once('open', () => {
      console.error('WebSocket connected');
      resolve();
    });
    ws.once('error', (err) => {
      console.error('WebSocket connection error:', err);
      reject(err);
    });
  });

  // Forward messages from stdio to WebSocket
  transport.onmessage = async (message) => {
    console.error('Sending to WebSocket:', JSON.stringify(message).substring(0, 100) + '...');
    ws.send(JSON.stringify(message));
  };

  // Forward messages from WebSocket to stdio
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.error('Received from WebSocket:', JSON.stringify(message).substring(0, 100) + '...');
      transport.send(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.error('WebSocket closed');
    process.exit(0);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    process.exit(1);
  });

  // Start the stdio transport
  await transport.start();
  console.error('Bridge started successfully');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
