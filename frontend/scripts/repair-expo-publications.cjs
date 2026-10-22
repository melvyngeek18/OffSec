#!/usr/bin/env node
/**
 * Expo SDK 54 autolinking guard.
 * Expo's Gradle plugin requires publication.version on each Android project.
 * Some otherwise valid expo-module.config.json files omit this metadata.
 * Identify the *actual* resolved module first, and complete metadata using its
 * own package.json version. No arbitrary or global version is invented.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function resolved() {
  const bin = require.resolve('expo-modules-autolinking/package.json');
  const root = path.dirname(bin);
  const executable = path.join(root, 'bin', 'expo-modules-autolinking.js');
  const candidates = [
    () => cp.execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['--no-install', 'expo-modules-autolinking', 'resolve', '--platform', 'android'], { encoding: 'utf8' })
  ];
  for (const command of candidates) {
    try { return JSON.parse(command()); } catch (error) {
      if (command === candidates[candidates.length - 1]) throw error;
    }
  }
}
function missing(data) {
  const list = [];
  (data.modules || []).forEach((mod, i) => (mod.projects || []).forEach((project, j) => {
    if (project.publication && !project.publication.version) list.push({ mod, project, i, j });
  }));
  return list;
}
const before = resolved();
const defects = missing(before);
console.log('Expo modules:', (before.modules || []).length);
(before.modules || []).forEach((m,i)=>console.log('Module index '+i+': '+m.packageName+' version '+(m.packageVersion||'unknown')));
for (const {mod, project, i, j} of defects) {
  console.log('Missing publication.version:', JSON.stringify({
    location: 'modules[' + i + '].projects[' + j + '].publication',
    packageName: mod.packageName,
    sourceDir: project.sourceDir,
    publication: project.publication
  }));
  if (!mod.packageName || !project.sourceDir) throw Error('Autolinking entry has no package metadata');
  const candidate = path.resolve(project.sourceDir, '..');
  const packageRoots = [
    candidate,
    path.resolve(project.sourceDir, '../..'),
    path.resolve('node_modules', mod.packageName)
  ];
  let root, pkg;
  for (const p of packageRoots) {
    const manifest = path.join(p, 'package.json');
    if (!fs.existsSync(manifest)) continue;
    const item = JSON.parse(fs.readFileSync(manifest,'utf8'));
    if (item.name === mod.packageName && typeof item.version === 'string' && item.version.trim()) {
      root = p; pkg = item; break;
    }
  }
  if (!root) throw Error('Unable to safely identify package/version for ' + mod.packageName);
  const configFile = ['expo-module.config.json', 'unimodule.json'].map(name => path.join(root,name)).find(file => fs.existsSync(file));
  if (!configFile) throw Error('No Expo config found for ' + mod.packageName);
  const config = JSON.parse(fs.readFileSync(configFile,'utf8'));
  if (!config.android) throw Error('Android config missing for ' + mod.packageName);
  const entries = [config.android, ...(config.android.projects || [])];
  const entry = entries.find(e => e.name === project.name || (project.sourceDir && path.resolve(root,e.path || 'android') === path.resolve(project.sourceDir)));
  if (!entry || !entry.publication) throw Error('Publication config did not match ' + mod.packageName);
  entry.publication.version = pkg.version;
  fs.writeFileSync(configFile, JSON.stringify(config,null,2)+'\n');
  console.log('Patched metadata of',mod.packageName,'with its package version',pkg.version);
}
const after = resolved();
if (missing(after).length) throw Error('Unresolved Expo publication version metadata after repair');
console.log('Expo publication metadata verified:', (after.modules || []).length, 'modules; repaired:', defects.length);
