export function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}

export function notFound(req, _res, next) {
  next(httpError(404, `Route not found: ${req.method} ${req.path}`));
}

export function errorHandler(err, _req, res, _next) {
  const status = Number(err.status ?? 500);
  const payload = {
    error: err.message ?? "Internal Server Error"
  };
  if (err.details) payload.details = err.details;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json(payload);
}

