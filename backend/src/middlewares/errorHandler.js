/**
 * Middleware global para el manejo estandarizado de errores HTTP.
 */
export function errorHandler(err, req, res, next) {
  console.error('[Error API]:', err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Error interno del servidor',
  });
}
