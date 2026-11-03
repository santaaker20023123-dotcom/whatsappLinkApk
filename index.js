const express = require('express');
const qrcode = require('qrcode');
const { Client } = require('whatsapp-web.js');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeData = null;

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async (qr) => {
  console.log('QR RECEIVED');
  qrCodeData = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
  qrCodeData = 'connected';
});

client.initialize();

// The to-do UI is available at /todo; keep the WhatsApp QR screen at /.
app.use('/todo', express.static(require('path').join(__dirname, 'public')));

app.get('/', async (req, res) => {
  if (!qrCodeData) {
    return res.send('<h2>Loading QR... please refresh after 5 seconds</h2>');
  }
  if (qrCodeData === 'connected') {
    return res.send('<h1>WhatsApp Connected Successfully! ✅</h1>');
  }
  res.send(`<div style="text-align:center; margin-top:50px;"><h2>Scan this QR with WhatsApp</h2><img src="${qrCodeData}" style="width:300px;"><br><br><button onclick="location.reload()">Refresh</button></div>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
