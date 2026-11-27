// Price Patrol: the hand-in program for this entry (Node 22, standard
// library only). The site itself is the static files under app/ next to
// this file, and screenshots/ holds real renders of that site running.
// This program copies both folders into the output directory the harness
// provides, then writes dossier.json there using the vendored make.fun
// library, which is the only file that describes the hand-in to the
// scorer. vendor/makefun-frontend.ts is the kit's copy, left untouched.
//
// Local run:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The harness runs it with MAKEFUN_OUTPUT_DIR unset, meaning /output.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const appSource = join(repoRoot, 'app');
const shotsSource = join(repoRoot, 'screenshots');
const appTarget = join(outputDir, 'app');
const shotsTarget = join(outputDir, 'screenshots');

mkdirSync(outputDir, { recursive: true });
if (!existsSync(appSource)) {
  throw new Error(`app/ folder not found beside main.ts: ${appSource}`);
}
if (existsSync(appTarget)) rmSync(appTarget, { recursive: true, force: true });
cpSync(appSource, appTarget, { recursive: true });

mkdirSync(shotsTarget, { recursive: true });
if (existsSync(shotsSource)) cpSync(shotsSource, shotsTarget, { recursive: true });

// Caps from the scorer's reference: the text cap shapes the dossier's
// bytes, the rest refuse entries the scorer would refuse outright.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
