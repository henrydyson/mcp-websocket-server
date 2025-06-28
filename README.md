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

Add to your `%APPDATA%\Claude\claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "mail-mcp-server": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/inspector",
        "wss://your-app.onrender.com/mcp"
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
- Main page: `https://your-app.onrender.com/`
- Health check: `https://your-app.onrender.com/health`
- WebSocket: `wss://your-app.onrender.com/mcp`

Use MCP Inspector to test the WebSocket connection:
```bash
npx @modelcontextprotocol/inspector wss://your-app.onrender.com/mcp
```

## License

MIT
