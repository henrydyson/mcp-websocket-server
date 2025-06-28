import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ana sayfa
app.get('/', (req, res) => {
  const host = req.headers.host || 'localhost';
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'wss' : 'ws';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MCP WebSocket Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        h1 {
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }
        .status {
          display: inline-block;
          padding: 8px 16px;
          background: #27ae60;
          color: white;
          border-radius: 20px;
          font-weight: 500;
        }
        .endpoint {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          font-family: 'Courier New', monospace;
          word-break: break-all;
        }
        .feature {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 15px;
          margin: 10px 0;
          border-radius: 0 8px 8px 0;
        }
        .feature strong {
          color: #1976d2;
        }
        pre {
          background: #f4f4f4;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          border: 1px solid #ddd;
        }
        .section {
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 MCP WebSocket Server</h1>
        <p><span class="status">✅ Sunucu Aktif</span></p>
        
        <div class="section">
          <h2>📡 WebSocket Endpoint</h2>
          <div class="endpoint">${protocol}://${host}/mcp</div>
        </div>
        
        <div class="section">
          <h2>🛠️ Mevcut Özellikler</h2>
          <div class="feature">
            <strong>mail_getir</strong> - Belirtilen email adresinin son mailini getirir
          </div>
          <div class="feature">
            <strong>mail_ara</strong> - Mail içeriğinde arama yapar
          </div>
          <div class="feature">
            <strong>mail_istatistik</strong> - Mail istatistiklerini gösterir
          </div>
          <div class="feature">
            <strong>test_baglanti</strong> - Bağlantıyı test eder
          </div>
        </div>
        
        <div class="section">
          <h2>⚙️ MCP Inspector ile Test</h2>
          <pre>npx @modelcontextprotocol/inspector ${protocol}://${host}/mcp</pre>
        </div>
        
        <p style="text-align: center; color: #666; margin-top: 40px;">
          <small>Sunucu zamanı: ${new Date().toLocaleString('tr-TR')}</small>
        </p>
      </div>
    </body>
    </html>
  `);
});

// HTTP sunucusu
const httpServer = createServer(app);

// WebSocket sunucusu
const wss = new WebSocketServer({ 
  server: httpServer,
  path: '/mcp'
});

// MCP Tool tanımları
const tools = [
  {
    name: 'test_baglanti',
    description: 'WebSocket bağlantısını test eder',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'mail_getir',
    description: 'Belirtilen email adresinin son mailini getirir',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Mail adresi (örn: user@example.com)',
        },
      },
      required: ['email'],
    },
  },
  {
    name: 'mail_ara',
    description: 'Mail içeriğinde arama yapar',
    inputSchema: {
      type: 'object',
      properties: {
        arama: {
          type: 'string',
          description: 'Aranacak kelime veya cümle',
        },
        email: {
          type: 'string',
          description: 'Belirli bir email adresi (opsiyonel)',
        },
        limit: {
          type: 'number',
          description: 'Maksimum sonuç sayısı (varsayılan: 10)',
        },
      },
      required: ['arama'],
    },
  },
  {
    name: 'mail_istatistik',
    description: 'Mail istatistiklerini gösterir',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Belirli bir email adresi (opsiyonel)',
        },
        gun: {
          type: 'number',
          description: 'Son kaç günün istatistiği (varsayılan: 7)',
        },
      },
    },
  },
];

// Tool handler
async function handleToolCall(name: string, args: any) {
  switch (name) {
    case 'test_baglanti':
      return {
        content: [{
          type: 'text',
          text: '✅ WebSocket bağlantısı başarılı!\nSunucu zamanı: ' + new Date().toLocaleString('tr-TR') + '\nSunucu versiyonu: 1.0.0',
        }],
      };
      
    case 'mail_getir':
      if (!args || !args.email) {
        throw new Error('Email adresi gerekli');
      }
      
      return {
        content: [{
          type: 'text',
          text: '📧 Son Mail Bilgisi:\nEmail: ' + args.email + '\nKonu: [Örnek] Aylık Rapor\nGönderen: manager@company.com\nTarih: ' + new Date().toLocaleDateString('tr-TR') + '\nİçerik: Bu bir test mailidir. Gerçek veriler MySQL MCP bağlantısı kurulduğunda gelecek.',
        }],
      };
      
    case 'mail_ara':
      if (!args || !args.arama) {
        throw new Error('Arama terimi gerekli');
      }
      
      const limit = args.limit || 10;
      const emailInfo = args.email ? 'Email: ' + args.email : 'Tüm mailler';
      
      return {
        content: [{
          type: 'text',
          text: '🔍 Arama Sonuçları:\nAranan: "' + args.arama + '"\n' + emailInfo + '\nLimit: ' + limit + '\n\nBulunan: 0 mail\n(MySQL MCP bağlantısı kurulduğunda gerçek sonuçlar görünecek)',
        }],
      };
      
    case 'mail_istatistik':
      const gun = args?.gun || 7;
      const email = args?.email || 'Tüm mailler';
      
      return {
        content: [{
          type: 'text',
          text: '📊 Mail İstatistikleri:\nDönem: Son ' + gun + ' gün\nEmail: ' + email + '\n\nToplam mail: 0\nGelen: 0\nGiden: 0\nEn çok mail gönderen: -\n(MySQL MCP bağlantısı kurulduğunda gerçek veriler görünecek)',
        }],
      };
      
    default:
      throw new Error('Bilinmeyen araç: ' + name);
  }
}

// WebSocket bağlantılarını yönet
wss.on('connection', async (ws) => {
  console.log('Yeni WebSocket bağlantısı');
  
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Gelen mesaj:', message.method);
      
      let response;
      
      if (message.method === 'initialize') {
        response = {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: 'mail-mcp-server',
              version: '1.0.0'
            }
          }
        };
      } else if (message.method === 'tools/list') {
        response = {
          jsonrpc: '2.0',
          id: message.id,
          result: { tools }
        };
      } else if (message.method === 'tools/call') {
        try {
          const result = await handleToolCall(message.params.name, message.params.arguments);
          response = {
            jsonrpc: '2.0',
            id: message.id,
            result
          };
        } catch (error) {
          response = {
            jsonrpc: '2.0',
            id: message.id,
            error: {
              code: -32603,
              message: error instanceof Error ? error.message : 'Internal error'
            }
          };
        }
      } else {
        response = {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32601,
            message: 'Method not found: ' + message.method
          }
        };
      }
      
      ws.send(JSON.stringify(response));
    } catch (error) {
      console.error('Mesaj işleme hatası:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket bağlantısı kapandı');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket hatası:', error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});

// Sunucuyu başlat
httpServer.listen(PORT, () => {
  console.log('🚀 MCP WebSocket sunucusu başlatıldı: http://localhost:' + PORT);
  console.log('📡 WebSocket endpoint: ws://localhost:' + PORT + '/mcp');
  console.log('🏥 Health check: http://localhost:' + PORT + '/health');
});
