# MCP WebSocket Server

A Model Context Protocol (MCP) server that operates over WebSocket. Designed for mail operations and communication.

## Features

- 🔌 WebSocket connection
- 📧 Mail retrieval and search
- 📊 Mail statistics
- 🚀 Can be hosted on Render.com
- 🏥 Health check endpoint

## Installation

```bash
npm install
npm run build
npm start
```

## Usage

### Claude Desktop Configuration

There are two ways to configure Claude Desktop to use this server:

#### Option 1: Using the deployed server on Render (Recommended)

Add to your `%APPDATA%\Claude\claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "mail-mcp-server": {
      "command": "node",
      "args": [
        "C:\\Users\\Thinkpad\\Desktop\\mcp-websocket-server\\stdio-bridge.js",
        "wss://mcp-websocket-server.onrender.com/mcp"
      ]
    }
  }
}
```

#### Option 2: Using a local server

First start your local server:
```bash
npm start
```

Then configure Claude Desktop:
```json
{
  "mcpServers": {
    "mail-mcp-server": {
      "command": "node",
      "args": [
        "C:\\Users\\Thinkpad\\Desktop\\mcp-websocket-server\\stdio-bridge.js",
        "ws://localhost:3000/mcp"
      ]
    }
  }
}
```

## API Endpoints

- `/` - Web interface
- `/health` - Health check endpoint
- `/mcp` - WebSocket endpoint for MCP

## Available Tools

- `test_baglanti` - Test the connection
- `mail_getir` - Get the latest mail for a specified email address
- `mail_ara` - Search within mail content
- `mail_istatistik` - Show mail statistics

## Deployment

### Deploy on Render.com:

1. Push to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm start`
   - **Health check path**: `/health`

### Environment

- Node.js 16.0.0 or higher required
- Automatically uses `PORT` environment variable

## Testing

Test your deployment:
- Main page: `https://mcp-websocket-server.onrender.com/`
- Health check: `https://mcp-websocket-server.onrender.com/health`
- WebSocket: `wss://mcp-websocket-server.onrender.com/mcp`

Test the WebSocket connection directly:
```bash
npm install -g wscat
wscat -c wss://mcp-websocket-server.onrender.com/mcp
```

## Troubleshooting

If you see errors like "Unexpected token" in Claude Desktop logs:
1. Make sure you're using the stdio-bridge.js file
2. Ensure the WebSocket URL is correct
3. Check that the server is running and accessible

## License

MIT
