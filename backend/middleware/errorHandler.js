/**
 * Central Error Handler Middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ [POLAR-SAFE Server Error]:', err.stack || err.message);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: message,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
