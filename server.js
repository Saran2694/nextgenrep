/**
 * ============================================================================
 * NEXTGEN DMA VENTURES - SERVER ENTRYPOINT (BACKWARD-COMPATIBLE)
 * ============================================================================
 * Delegates directly to the modular application instance in src/server/app.js.
 */

const app = require('./src/server/app');
module.exports = app;
