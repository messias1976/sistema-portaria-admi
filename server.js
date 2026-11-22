const http = require('http');
const fs = require('fs');
const path = require('path');

// Porta configurável pela Shard Cloud (ex: process.env.PORT) ou 3000 por padrão
const PORT = process.env.PORT || 3000;
const pastaRaiz = __dirname;

const tiposMime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf'
};

const servidor = http.createServer((req, res) => {
  // Remove query string da URL (ex: ?v=1)
  const urlLimpa = (req.url || '/').split('?')[0];
  let caminhoRelativo = urlLimpa === '/' ? 'index.html' : urlLimpa.replace(/^\/+/, '');
  let caminhoArquivo = path.join(pastaRaiz, caminhoRelativo);

  // Proteção básica para não sair da pasta do projeto
  if (!caminhoArquivo.startsWith(pastaRaiz)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Acesso negado');
    return;
  }

  fs.stat(caminhoArquivo, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Arquivo não encontrado');
      return;
    }

    const extensao = path.extname(caminhoArquivo).toLowerCase();
    const contentType = tiposMime[extensao] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(caminhoArquivo).pipe(res);
  });
});

servidor.listen(PORT, () => {
  console.log(`Servidor da Portaria ADMI rodando na porta ${PORT}`);
});