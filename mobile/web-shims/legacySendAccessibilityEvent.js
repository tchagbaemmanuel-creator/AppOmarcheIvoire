/** No-op on web — native-only accessibility bridge (RN has only .ios / .android). */
function legacySendAccessibilityEvent() {}

module.exports = legacySendAccessibilityEvent;
