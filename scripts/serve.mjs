#!/usr/bin/env node
/**
 * cover-maker · 本地静态服务器
 * 部分 agent 内嵌浏览器不能打开 file: URL——浏览器验证前用这个把封面目录挂到 http://127.0.0.1。
 *
 * 用法: node serve.mjs [目录] [端口]
 *   目录默认当前工作目录; 端口默认从 8123 起找空闲。
 * 输出: 最后一行是 "URL=http://127.0.0.1:<port>" 供调用方解析。
 * 生命周期: 前台进程, 验证完 kill 掉; 也可用 --keep 让它常驻。
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';

const dir = process.argv[2] && process.argv[2] !== '--keep' ? path.resolve(process.argv[2]) : process.cwd();
const keep = process.argv.includes('--keep');
let wantPort = parseInt(process.argv.find((a, i) => i >= 2 && /^\d+$/.test(a)) || '8123', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

function portFree(p) {
  return new Promise((res) => {
    const s = net.createServer();
    s.once('error', () => res(false));
    s.once('listening', () => s.close(() => res(true)));
    s.listen(p, '127.0.0.1');
  });
}

let port = wantPort;
for (let i = 0; i < 20; i++) {
  if (await portFree(port)) break;
  port++;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let fp = path.join(dir, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
  if (!fp.startsWith(dir)) { res.writeHead(403); res.end(); return; }
  fs.stat(fp, (err, st) => {
    if (!err && st.isDirectory()) fp = path.join(fp, 'index.html');
    fs.readFile(fp, (err2, data) => {
      if (err2) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.error(`[cover-maker] serving ${dir}`);
  console.log(`URL=http://127.0.0.1:${port}`);
  if (!keep) setTimeout(() => process.exit(0), 10 * 60 * 1000); // 10 分钟自动退出, 防止挂后台
});
