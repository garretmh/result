# Simple result object

A minimal Result type implementation for JavaScript and TypeScript.

It can be useful to have a simple standard way to represent a result that could
either have succeeded or failed (outside try...catch or rejected promises).

The implementations I see online always seem over-engineered. Many are classes
based on the Rust Result enum. I think writing such a class is a fun exercise,
I've done it myself, but I don't think the result is something I'd actually want
to use. Meanwhile, a Plain Old JavaScript Object with a standard interface can
give you everything you need.

## Example

```ts
import type { Result, Success, Failure } from '@garretmh/result'
import { ok, fail, attempt, asyncResult } from '@garretmh/result'

type Entity = { id: number }

async function loadEntity(url: string): Promise<Result<Entity>> {
  const urlResult = attempt(() => new URL(url))
  if (!urlResult.ok) {
    urlResult satisfies Failure
    return urlResult
  }
  urlResult satisfies Success<URL>
  const url_ = urlResult.value
  url_.searchParams.append('lang', 'js')

  const responseResult = await asyncResult(fetch(url))
  if (!responseResult.ok) {
    return responseResult
  }
  const response = responseResult.value
  if (!response.ok) {
    return fail(new Error(
      `HTTP status: ${response.status} ${response.statusText}`,
      { cause: response })
    )
  }
  const jsonResult = await asyncResult(response.json())
  if (!jsonResult.ok) {
    return jsonResult
  }
  return ok(jsonResult.value.entity)
}
```
