import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so any rejected promise (DB hiccup, bug, etc.)
 * is forwarded to Express's error middleware via next(err) instead of becoming
 * an unhandled rejection that hangs the request (client sees "Load failed")
 * or, depending on the Node version's config, crashes the whole process —
 * which would explain unrelated-looking symptoms like login suddenly failing
 * or events "disappearing" right after a checkout error elsewhere.
 */
export function asyncHandler<T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
}
