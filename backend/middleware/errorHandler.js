// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err.message || err);
  
  // Custom response formatting
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

module.exports = errorHandler;
