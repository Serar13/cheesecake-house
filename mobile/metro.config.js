const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Watchman is broken on this machine, so Metro must use Node's file watcher.
config.resolver.useWatchman = false;

module.exports = config;
