#!/usr/bin/env node
'use strict';
/**
 * 通用文生图脚本（OpenAI images API 兼容）
 *
 * 用法:
 *   node gen_image.mjs --prompt "..." --out cover.png [--model m1] [--size 1024x1536] [--n 1]
 *   node gen_image.mjs --prompt "..." --out cover.png --config my-images.json
 *
 * 配置来源（优先级从高到低）:
 *   1. --config <file>  JSON: { "baseUrl": "https://api.example.com/v1", "apiKey": "...", "models": ["m1","m2"] }
 *   2. 环境变量         IMAGE_API_BASE / IMAGE_API_KEY / IMAGE_MODELS(逗号分隔)
 *
 * 兜底链: 命令行指定的模型失败后，自动依次尝试配置里的其余模型。
 * 不内置任何服务商——端点、key、模型名全部由配置提供。
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const TAG = '[gen_image]';

function parseArgs() {
  const argv = process.argv.slice(2);
  const next = () => argv[argv.indexOf(argv[i++]) + 1];
  const out = { prompt: '', out: '', model: '', size: '1024x1536', n: 1, config: '' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--prompt') out.prompt = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--model') out.model = argv[++i];
    else if (a === '--size') out.size = argv[++i];
    else if (a === '--n') out.n = Number(argv[++i]) || 1;
    else if (a === '--config') out.config = argv[++i];
  }
  if (!out.prompt || !out.out) {
    console.error('用法: node gen_image.mjs --prompt "..." --out cover.png [--model m1] [--size 1024x1536] [--config img.json]');
    process.exit(1);
  }
  return out;
}

function loadConfig(args) {
  // 1) --config 文件
  if (args.config) {
    if (!fs.existsSync(args.config)) fail(`配置文件不存在: ${args.config}`);
    const j = JSON.parse(fs.readFileSync(args.config, 'utf8'));
    if (!j.baseUrl || !j.apiKey || !Array.isArray(j.models) || !j.models.length) {
      fail('配置文件需要字段: baseUrl, apiKey, models[]');
    }
    return { baseUrl: j.baseUrl.replace(/\/+$/, ''), apiKey: j.apiKey, models: j.models };
  }
  // 2) 环境变量
  if (process.env.IMAGE_API_BASE && process.env.IMAGE_API_KEY && process.env.IMAGE_MODELS) {
    const models = process.env.IMAGE_MODELS.split(',').map((s) => s.trim()).filter(Boolean);
    if (models.length) {
      return { baseUrl: process.env.IMAGE_API_BASE.replace(/\/+$/, ''), apiKey: process.env.IMAGE_API_KEY, models };
    }
  }
  fail('未配置图像服务。用 --config img.json 或环境变量 IMAGE_API_BASE / IMAGE_API_KEY / IMAGE_MODELS。\n' +
       'img.json 示例: {"baseUrl":"https://api.example.com/v1","apiKey":"sk-...","models":["model-a","model-b"]}');
}

function fail(msg) {
  console.error(`${TAG} ${msg}`);
  process.exit(1);
}

/** 单模型一次生成；成功落盘返回 true，HTTP/业务失败返回 false（让上层走兜底链） */
function tryOnce(cfg, model, args) {
  const body = { model, prompt: args.prompt, n: args.n, size: args.size };
  const tmpReq = path.join(os.tmpdir(), `img-req-${Date.now()}.json`);
  const tmpRes = path.join(os.tmpdir(), `img-res-${Date.now()}.json`);
  fs.writeFileSync(tmpReq, JSON.stringify(body));
  try {
    // 用 curl 而非 fetch：避免 node 版本差异与代理配置分歧；-sS 静默但保留错误
    execFileSync('curl', [
      '-sS', '-m', '300', '-w', '%{http_code}',
      '-X', 'POST', `${cfg.baseUrl}/images/generations`,
      '-H', `Authorization: Bearer ${cfg.apiKey}`,
      '-H', 'Content-Type: application/json',
      '-o', tmpRes, '-d', `@${tmpReq}`,
    ], { stdio: ['ignore', 'pipe', 'inherit'] }).toString().split('\n').pop();
    if (!fs.existsSync(tmpRes)) return false;
    const j = JSON.parse(fs.readFileSync(tmpRes, 'utf8'));
    const items = j.data || [];
    if (!items.length) {
      console.error(`${TAG} ${model}: 无返回图片 ${JSON.stringify(j).slice(0, 200)}`);
      return false;
    }
    const dir = path.dirname(path.resolve(args.out));
    fs.mkdirSync(dir, { recursive: true });
    const saved = [];
    items.forEach((item, idx) => {
      const outPath = items.length > 1
        ? args.out.replace(/(\.[a-z]+)$/i, `-${idx + 1}$1`)
        : args.out;
      if (item.b64_json) {
        fs.writeFileSync(outPath, Buffer.from(item.b64_json, 'base64'));
        saved.push(outPath);
      } else if (item.url) {
        const imgTmp = path.join(os.tmpdir(), `img-dl-${Date.now()}-${idx}`);
        execFileSync('curl', ['-sS', '-m', '120', '-L', '-o', imgTmp, item.url], { stdio: ['ignore', 'ignore', 'inherit'] });
        fs.copyFileSync(imgTmp, outPath);
        fs.unlinkSync(imgTmp);
        saved.push(outPath);
      }
    });
    if (!saved.length) return false;
    console.log(`${TAG} saved ${saved.length} image(s) via ${model}: ${saved.join(', ')}`);
    return true;
  } catch (e) {
    console.error(`${TAG} ${model}: ${String(e.message || e).slice(0, 160)}`);
    return false;
  } finally {
    for (const t of [tmpReq, tmpRes]) { try { fs.unlinkSync(t); } catch {} }
  }
}

const args = parseArgs();
const cfg = loadConfig(args);
const chain = [args.model, ...cfg.models.filter((m) => m !== args.model)].filter(Boolean);
for (const model of chain) {
  console.log(`${TAG} trying model: ${model}`);
  if (tryOnce(cfg, model, args)) process.exit(0);
}
fail(`ALL MODELS FAILED (chain: ${chain.join(' → ')})`);
