// Unit tests for the contact rules shared by the form and the API route.
// Run with `npm test` (Node's built-in test runner; Node strips the TypeScript types).
import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, LIMITS, topicSubject, validateContact } from "../app/lib/contact.ts";

const ok = { name: "Ana", email: "ana@example.com", message: "I need a site for my shop." };

test("a complete message has no errors", () => {
  assert.deepEqual(validateContact(ok), {});
});

test("empty fields each get their own error", () => {
  const errors = validateContact({ name: " ", email: "", message: "" });
  assert.ok(errors.name && errors.email && errors.message);
});

test("message must be at least the minimum length after trimming", () => {
  const short = "x".repeat(LIMITS.messageMin - 1);
  assert.ok(validateContact({ ...ok, message: `  ${short}  ` }).message);
  assert.equal(validateContact({ ...ok, message: "x".repeat(LIMITS.messageMin) }).message, undefined);
});

test("over-long fields are rejected", () => {
  assert.ok(validateContact({ ...ok, name: "a".repeat(LIMITS.name + 1) }).name);
  assert.ok(validateContact({ ...ok, message: "a".repeat(LIMITS.message + 1) }).message);
});

test("email format", () => {
  for (const good of ["a@b.co", "first.last+tag@sub.example.org", "o'neil@example.ph"]) {
    assert.equal(isValidEmail(good), true, good);
  }
  for (const bad of ["", "a@b", "a b@c.com", ".a@b.com", "a.@b.com", "a..b@c.com", "a@b.c", "a@-b.com", "@b.com"]) {
    assert.equal(isValidEmail(bad), false, bad);
  }
});

test("topic goes into the subject, unknown values fall back", () => {
  assert.equal(topicSubject("website"), "website project");
  assert.equal(topicSubject("job"), "job or internship");
  assert.equal(topicSubject("other"), "message");
  assert.equal(topicSubject("<script>"), "message");
  assert.equal(topicSubject(undefined), "message");
});
