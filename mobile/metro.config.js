const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const defaultResolveRequest = config.resolver.resolveRequest;

function webShimFile(moduleName) {
  if (typeof moduleName !== 'string') return null;
  const normalized = moduleName.replace(/\\/g, '/');
  if (normalized.includes('legacySendAccessibilityEvent')) {
    return path.resolve(__dirname, 'web-shims/legacySendAccessibilityEvent.js');
  }
  if (
    /[/\\]PlatformColorValueTypes$/.test(normalized) ||
    normalized.endsWith('PlatformColorValueTypes')
  ) {
    if (normalized.includes('PlatformColorValueTypesIOS')) return null;
    return path.resolve(__dirname, 'web-shims/PlatformColorValueTypes.js');
  }
  return null;
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    const shim = webShimFile(moduleName);
    if (shim) {
      return { type: 'sourceFile', filePath: shim };
    }
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
