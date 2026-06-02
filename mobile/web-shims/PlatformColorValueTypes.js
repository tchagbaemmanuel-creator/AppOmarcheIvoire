/**
 * Web shim — RN only ships .ios / .android for this module.
 * Mirrors the Android stubs enough for processColor / normalizeColor.
 */
const PlatformColor = (...names) => ({ resource_paths: names });

function normalizeColorObject(color) {
  if (color && typeof color === 'object' && 'resource_paths' in color) {
    return color;
  }
  return null;
}

function processColorObject(color) {
  return color;
}

module.exports = {
  PlatformColor,
  normalizeColorObject,
  processColorObject,
};
