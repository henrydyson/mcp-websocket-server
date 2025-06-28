#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

class EmailMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'email-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // mail_getir fonksiyonu
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'mail_getir':
          return {
            content: [
              {
                type: 'text',
                text: `Email getirildi: ${args.email || 'test@example.com'}\nSon mail: Test mail içeriği`,
              },
            ],
          };

        case 'mail_ara':
          return {
            content: [
              {
                type: 'text',
                text: `Mail arama sonucu: "${args.query || 'test'}" için 3 sonuç bulundu`,
              },
            ],
          };

        case 'mail_istatistik':
          return {
            content: [
              {
                type: 'text',
                text: 'Mail İstatistikleri:\nToplam: 156\nOkunmuş: 89\nOkunmamış: 67',
              },
            ],
          };

        case 'test_baglanti':
          return {
            content: [
              {
                type: 'text',
                text: '✅ Bağlantı başarılı! Server çalışıyor.',
              },
            ],
          };

        default:
          throw new Error(`Bilinmeyen araç: ${name}`);
      }
    });

    // Araçları listele
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'mail_getir',
            description: 'Belirtilen email adresinin son mailini getirir',
            inputSchema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Email adresi',
                },
              },
            },
          },
          {
            name: 'mail_ara',
            description: 'Mail içeriğinde arama yapar',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Arama terimi',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'mail_istatistik',
            description: 'Mail istatistiklerini gösterir',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'test_baglanti',
            description: 'Bağlantıyı test eder',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Email MCP Server started on stdio');
  }
}

const server = new EmailMCPServer();
server.run().catch(console.error);
