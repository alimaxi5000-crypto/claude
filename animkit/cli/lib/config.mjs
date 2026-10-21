// Where the studio and its stream resource live. Order: command line (--studio, --stream),
// environment (ANIMKIT_STUDIO, ANIMKIT_STREAM), animkit/animkit.config.json, then the folders
// next to animkit (repository layout: ../jj_animstudio and ../jj_animstudio_stream).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ANIMKIT = path.resolve(HERE, '..', '..');
export const CONFIG_FILE = path.join(ANIMKIT, 'animkit.config.json');

export function opt(args, name) {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

export function readConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); } catch (e) {
    throw new Error(`animkit.config.json is not valid JSON: ${e.message}`);
  }
}

export function resolvePaths(args = []) {
  const cfg = readConfig();
  const rel = (p) => (p ? path.resolve(ANIMKIT, p) : null);
  const studio = path.resolve(opt(args, '--studio') || process.env.ANIMKIT_STUDIO || rel(cfg.studio) || path.join(ANIMKIT, '..', 'jj_animstudio'));
  const stream = path.resolve(opt(args, '--stream') || process.env.ANIMKIT_STREAM || rel(cfg.stream) || path.join(path.dirname(studio), 'jj_animstudio_stream'));
  return { studio, stream, config: fs.existsSync(CONFIG_FILE) ? CONFIG_FILE : null };
}
