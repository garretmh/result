/**
 * Represents the result of an operation that could succeed or fail.
 */
export type Result<T, E = unknown> = Success<T> | Failure<E>;

/**
 * Represents the result of an operation that succeeded.
 */
export type Success<T> = { ok: true; value: T };

/**
 * Represents the result of an operation that failed.
 */
export type Failure<E = unknown> = { ok: false; cause: E };

/**
 * Creates a Success result with the given value
 */
export function ok<T>(value: T): Success<T> {
  return { ok: true, value };
}

/**
 * Creates a Failure result with the given cause
 */
export function fail<E>(cause: E): Failure<E> {
  return { ok: false, cause };
}

/**
 * Returns a Result with the value returned by a function or the error it throws.
 *
 * @example
 * const outcome = attempt(() => new URL(url))
 * if (!outcome.ok) {
 *   console.error(outcome.reason)
 *   outcome.reason satisfies unknown
 * } else {
 *   console.log(outcome.value)
 *   outcome.reason satisfies URL
 * }
 */
export function attempt<T>(fn: () => T): Result<T> {
  try {
    const value = fn();
    return ok(value);
  } catch (reason) {
    return fail(reason);
  }
}

/**
 * Promises a Result with the value resolved by a promise or the error it rejects.
 *
 * @example
 * const outcome = await asyncResult(fetch(url))
 * if (!outcome.ok) {
 *   console.error(outcome.error)
 *   outcome.reason satisfies unknown
 * } else {
 *   console.log(outcome.value)
 *   outcome.reason satisfies URL
 * }
 */
export function asyncResult<T>(promise: Promise<T>): Promise<Result<T>> {
  return promise.then(ok, fail);
}

/**
 * Whether a value qualifies as a Result.
 */
export function isResultLike(value: unknown): value is Result<unknown> {
  return typeof value === "object" && value !== null && "ok" in value && (
    value.ok ? "value" in value : "cause" in value
  );
}
