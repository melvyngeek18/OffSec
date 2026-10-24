const { getDefaultConfig } = require('expo/metro-config');

// Keep Expo SDK 54 defaults for Android and web. Custom Metro cache and
// resolver configuration can conflict with Expo Router's web export.
module.exports = getDefaultConfig(__dirname);
