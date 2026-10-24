const { getDefaultConfig } = require('expo/metro-config');

// Expo SDK 54 defaults support Metro bundling for release Android builds.
module.exports = getDefaultConfig(__dirname);
