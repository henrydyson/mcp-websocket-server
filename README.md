# MCP WebSocket Server

WebSocket üzerinden çalışan MCP sunucusu. Mail işlemleri için tasarlanmıştır.

## Özellikler

- 🔌 WebSocket bağlantısı
- 📧 Mail getirme ve arama
- 📊 Mail istatistikleri
- 🚀 Render.com'da host edilebilir

## Kurulum

```bash
npm install
npm run build
npm start
```

## Kullanım

### Claude Desktop Yapılandırması

`%APPDATA%\Claude\claude_desktop_config.json` dosyasına ekleyin:

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

- `/` - Web arayüzü
- `/mcp` - WebSocket endpoint

## Araçlar

- `test_baglanti` - Bağlantıyı test eder
- `mail_getir` - Email adresine göre son maili getirir
- `mail_ara` - Mail içeriğinde arama yapar
- `mail_istatistik` - Mail istatistiklerini gösterir

## Deployment

Render.com üzerinde deploy etmek için:

1. GitHub'a push edin
2. Render.com'da yeni Web Service oluşturun
3. GitHub repo'nuzu bağlayın
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
