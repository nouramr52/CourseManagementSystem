/**
 * errorMiddleware.js — Centralised error handling (Single Responsibility Principle)
 *
 * This is Express's 4-argument error handler. Any unhandled error thrown
 * inside a route or middleware reaches here via next(err).
 *
 * Benefits:
 *  - Controllers stay thin — they just throw, not format errors
 *  - Consistent JSON error shape across the whole API
 *  - One place to add logging, monitoring, or Sentry integration
 */

import { errorStatus } from "../utils/helpers.js";

/**
 * Global error handler middleware.
 * Must be registered LAST in app.js (after all routes).
 */
const errorMiddleware = (err, req, res, next) => {
    // Determine the right HTTP status from the error message
    const status = err.status ?? errorStatus(err.message, 500);

    // Never leak stack traces to the client in production
    const isDev = process.env.NODE_ENV !== "production";

    res.status(status).json({
        message: err.message || "An unexpected error occurred",
        ...(isDev && { stack: err.stack }),
    });
};

export default errorMiddleware;
