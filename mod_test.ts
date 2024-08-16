import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import { asyncResult, attempt, fail, isResultLike, ok } from "./mod.ts";

Deno.test("ok", () => {
  const success = ok("value");
  assertExists(success);
  assertEquals(success.ok, true);
  assert("value" in success);
  assertEquals(success.value, "value");
  assert(!("cause" in success));
});

Deno.test("fail", () => {
  const failure = fail("cause");
  assertExists(failure);
  assertEquals(failure.ok, false);
  assert("cause" in failure);
  assertEquals(failure.cause, "cause");
  assert(!("value" in failure));
});

Deno.test("attempt", () => {
  const success = attempt(() => {
    return "value";
  });
  assertExists(success);
  assertEquals(success.ok, true);
  assert("value" in success);
  assertEquals(success.value, "value");
  assert(!("cause" in success));

  const failure = attempt(() => {
    throw "cause";
  });
  assertExists(failure);
  assertEquals(failure.ok, false);
  assert("cause" in failure);
  assertEquals(failure.cause, "cause");
  assert(!("value" in failure));
});

Deno.test("asyncResult", async () => {
  const success = await asyncResult(Promise.resolve("value"));
  assertExists(success);
  assertEquals(success.ok, true);
  assert("value" in success);
  assertEquals(success.value, "value");
  assert(!("cause" in success));

  const failure = await asyncResult(Promise.reject("cause"));
  assertExists(failure);
  assertEquals(failure.ok, false);
  assert("cause" in failure);
  assertEquals(failure.cause, "cause");
  assert(!("value" in failure));
});

Deno.test("isResultLike", () => {
  assert(isResultLike(ok("foo")));
  assert(isResultLike(fail("foo")));
  assert(isResultLike({ ok: true, value: "foo" }));
  assert(isResultLike({ ok: false, cause: "foo" }));

  assert(!isResultLike(undefined));
  assert(!isResultLike(null));
  assert(!isResultLike({}));
  assert(!isResultLike({ ok: false }));
  assert(!isResultLike({ ok: true }));
  assert(!isResultLike({ value: "foo" }));
  assert(!isResultLike({ cause: "foo" }));
  assert(!isResultLike({ ok: false, value: "foo" }));
  assert(!isResultLike({ ok: true, cause: "foo" }));
});
