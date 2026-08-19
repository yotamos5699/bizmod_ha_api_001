const wizlib = require("wizcloud-api");

const sessions = new Map();
const INIT_INTERVAL = 300_000;

const wizlibClient = {
  ...wizlib,

  init: (userPrivateKey, userServerName) => {
    // Use whatever identifies an auth session uniquely.
    const sessionKey = `${userServerName}:${userPrivateKey}`;

    const now = Date.now();
    const lastInit = sessions.get(sessionKey);

    // Already initialized within the last 30 seconds
    if (lastInit && now - lastInit < INIT_INTERVAL) {
      return;
    }

    // Actually authenticate
    const result = wizlib.init(userPrivateKey, userServerName);

    // Only mark it authenticated if init succeeded
    sessions.set(sessionKey, now);

    return result;
  },
};

module.exports = wizlibClient;
