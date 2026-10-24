// Browser-only ESM bridge. Never import this file from Expo/Metro.
// The accompanying MediaPipe files are copied locally during the PWA build.
import * as vision from './vision_bundle.mjs';
window.__offsecVision = vision;
