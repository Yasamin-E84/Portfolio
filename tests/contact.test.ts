import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  contactSchema,
  handleAnalytics,
  handleContact,
  hashRateKey,
  readLimitedJson,
  RequestProblem,
} from "../lib/contact";
import {
  createStore,
  normalizeTrustedOrigin,
  type SqlDatabase,
  type SqlStatement,
} from "../lib/db";

const valid = {
  name: "Test Visitor",
  email: "test@example.com",
  message: "This is a test message about a possible project.",
  locale: "en",
  website: "",
};
const salt = "a-private-test-only-salt-of-at-least-32-characters";
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: {
      origin: "https://portfolio.example",
      "content-type": "application/json",
      "cf-connecting-ip": "192.0.2.1",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

/** Executes the production SQL against actual SQLite, not a simulated limiter. */
function database() {
  const sqlite = new DatabaseSync(":memory:");
  for (const file of readdirSync(join(process.cwd(), "drizzle"))
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    sqlite.exec(readFileSync(join(process.cwd(), "drizzle", file), "utf8"));
  }
  const db: SqlDatabase = {
    prepare(sql) {
      let values: (string | number | null)[] = [];
      const statement: SqlStatement = {
        bind(...input) {
          values = input;
          return statement;
        },
        async first<T>() {
          return (sqlite.prepare(sql).get(...values) ?? null) as T | null;
        },
        async run() {
          return sqlite.prepare(sql).run(...values);
        },
      };
      return statement;
    },
  };
  return { sqlite, store: createStore(db) };
}

test("validates and trims real fields with Persian field errors", () => {
  const result = contactSchema("en").safeParse({
    ...valid,
    name: "  Yasamin  ",
  });
  assert.ok(result.success);
  assert.equal(result.data.name, "Yasamin");
  const invalid = contactSchema("fa").safeParse({
    ...valid,
    email: "invalid",
    message: "short",
  });
  assert.equal(invalid.success, false);
  if (!invalid.success)
    assert.ok(
      invalid.error.issues.some((issue) => issue.message.includes("ایمیل")),
    );
});

test("rejects unbounded chunked bodies and invalid UTF-8/JSON", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(4096));
      controller.enqueue(new Uint8Array(4097));
      controller.close();
    },
  });
  const streaming = new Request("https://portfolio.example", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: stream,
    duplex: "half",
  } as RequestInit);
  await assert.rejects(
    readLimitedJson(streaming),
    (error: unknown) => error instanceof RequestProblem && error.status === 413,
  );
  await assert.rejects(
    readLimitedJson(
      new Request("https://portfolio.example", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{broken",
      }),
    ),
    (error: unknown) => error instanceof RequestProblem && error.status === 400,
  );
  await assert.rejects(
    readLimitedJson(
      new Request("https://portfolio.example", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: new Uint8Array([0xc3, 0x28]),
      }),
    ),
    (error: unknown) => error instanceof RequestProblem && error.status === 400,
  );
});

test("rejects cross-origin, absent-origin and filled honeypot before database work", async () => {
  let resolved = false;
  const resolver = async () => {
    resolved = true;
    return null;
  };
  assert.equal(
    (
      await handleContact(
        request(valid, { origin: "https://attacker.example" }),
        resolver,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handleContact(request(valid, { origin: "" }), resolver)).status,
    403,
  );
  assert.equal(
    (
      await handleContact(
        request({ ...valid, website: "bot.example" }),
        resolver,
      )
    ).status,
    400,
  );
  assert.equal(resolved, false);
});

test("explicit trusted deployment origin survives internal adapter URL rewriting without trusting forwarded headers", async () => {
  const store = {
    reserveContact: async () => true,
    saveContact: async () => {},
  };
  const resolver = async () => ({ store, salt });
  const internal = new Request("https://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://portfolio.example",
    },
    body: JSON.stringify(valid),
  });
  assert.equal(
    (await handleContact(internal, resolver, "https://portfolio.example"))
      .status,
    201,
  );
  assert.equal(
    (
      await handleContact(
        request(valid, {
          origin: "https://attacker.example",
          "x-forwarded-host": "attacker.example",
          "x-forwarded-proto": "https",
        }),
        resolver,
        "https://portfolio.example",
      )
    ).status,
    403,
  );
  assert.equal((await handleContact(request(), resolver, "")).status, 403);
  assert.equal(
    (
      await handleAnalytics(
        request({ consent: true, locale: "en", path: "/en" }),
        async () => ({ recordView: async () => true }),
        "https://portfolio.example",
      )
    ).status,
    204,
  );
});

test("trusted origin configuration accepts public HTTPS and exact local HTTP origins only", () => {
  assert.equal(
    normalizeTrustedOrigin("https://portfolio.example/"),
    "https://portfolio.example",
  );
  assert.equal(
    normalizeTrustedOrigin("http://127.0.0.1:8787"),
    "http://127.0.0.1:8787",
  );
  assert.equal(
    normalizeTrustedOrigin("http://localhost:3000"),
    "http://localhost:3000",
  );
  for (const origin of [
    "http://public.example",
    "https://user:secret@public.example",
    "javascript:alert(1)",
    "",
    undefined,
  ]) {
    assert.equal(normalizeTrustedOrigin(origin), "");
  }
});

test("reports localized field errors and honest unavailable responses", async () => {
  const invalid = await handleContact(
    request({ ...valid, locale: "fa", name: "" }),
    async () => null,
  );
  assert.equal(invalid.status, 422);
  const errors = await invalid.json();
  assert.ok(errors.fieldErrors.name[0].includes("نام"));
  const unavailable = await handleContact(request(), async () => null);
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).success, false);
});

test("stores the message before returning its saved reference", async () => {
  const { sqlite, store } = database();
  try {
    const response = await handleContact(request(), async () => ({
      store,
      salt,
    }));
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.equal(body.status, "saved");
    const saved = sqlite
      .prepare("SELECT * FROM contact_messages WHERE id = ?")
      .get(body.id);
    assert.equal(saved?.email, valid.email);
    assert.equal(saved?.message, valid.message);
    assert.equal(Object.keys(saved ?? {}).includes("ip"), false);
  } finally {
    sqlite.close();
  }
});

test("never claims success when storage fails or rate salt is absent", async () => {
  const store = {
    reserveContact: async () => true,
    saveContact: async () => {
      throw new Error("private-provider-secret");
    },
  };
  const failure = await handleContact(request(), async () => ({ store, salt }));
  assert.equal(failure.status, 503);
  assert.equal(
    (await failure.text()).includes("private-provider-secret"),
    false,
  );
  assert.equal(
    (await handleContact(request(), async () => ({ store, salt: "" }))).status,
    503,
  );
});

test("atomic sliding limit accepts only five concurrent requests and expires after 15 minutes", async () => {
  const { sqlite, store } = database();
  try {
    const decisions = await Promise.all(
      Array.from({ length: 12 }, () =>
        store.reserveContact("hashed-test-key", 10000),
      ),
    );
    assert.equal(decisions.filter(Boolean).length, 5);
    assert.equal(await store.reserveContact("hashed-test-key", 10899), false);
    assert.equal(await store.reserveContact("hashed-test-key", 10900), true);
    assert.equal(await store.reserveContact("another-key", 10900), true);
  } finally {
    sqlite.close();
  }
});

test("rate response includes Retry-After and only hashes, never raw addresses, are retained", async () => {
  const { sqlite, store } = database();
  try {
    for (let index = 0; index < 5; index++)
      assert.equal(
        (await handleContact(request(), async () => ({ store, salt }))).status,
        201,
      );
    const response = await handleContact(request(), async () => ({
      store,
      salt,
    }));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "900");
    const key = sqlite
      .prepare("SELECT rate_key FROM contact_rate_events LIMIT 1")
      .get()?.rate_key;
    assert.equal(typeof key, "string");
    assert.notEqual(key, "192.0.2.1");
    assert.equal(String(key).length, 64);
    assert.notEqual(
      await hashRateKey("192.0.2.1", salt),
      await hashRateKey("192.0.2.1", `${salt}changed`),
    );
  } finally {
    sqlite.close();
  }
});

test("analytics requires explicit consent and rejects arbitrary routes and identifiers", async () => {
  let resolved = false;
  const resolver = async () => {
    resolved = true;
    return null;
  };
  for (const body of [
    { locale: "en", path: "/en" },
    { consent: false, locale: "en", path: "/en" },
    { consent: true, locale: "en", path: "/en/arbitrary-123" },
    { consent: true, locale: "fa", path: "/en" },
    { consent: true, locale: "en", path: "/en", visitorId: "private" },
  ])
    assert.equal((await handleAnalytics(request(body), resolver)).status, 400);
  assert.equal(resolved, false);
});

test("analytics aggregates one bounded row per daily page and limits bursts without visitor identifiers", async () => {
  const { sqlite, store } = database();
  try {
    const response = await handleAnalytics(
      request({ consent: true, locale: "fa", path: "/fa" }),
      async () => store,
    );
    assert.equal(response.status, 204);
    for (let i = 0; i < 120; i++)
      assert.equal(
        await store.recordView("2026-09-23", "/en", "en", 10000),
        true,
      );
    assert.equal(
      await store.recordView("2026-09-23", "/en", "en", 10001),
      false,
    );
    assert.equal(
      await store.recordView("2026-09-23", "/en", "en", 10060),
      true,
    );
    const row = sqlite
      .prepare(
        "SELECT * FROM analytics_daily WHERE day = '2026-09-23' AND path = '/en'",
      )
      .get();
    assert.equal(row?.views, 121);
    assert.deepEqual(Object.keys(row ?? {}).sort(), [
      "day",
      "locale",
      "minute_start",
      "minute_views",
      "path",
      "views",
    ]);
    sqlite
      .prepare(
        "UPDATE analytics_daily SET views = 20000 WHERE day = '2026-09-23' AND path = '/en'",
      )
      .run();
    assert.equal(
      await store.recordView("2026-09-23", "/en", "en", 20000),
      false,
    );
  } finally {
    sqlite.close();
  }
});

test("message retention cleanup removes old entries on the next successful submission", async () => {
  const { sqlite, store } = database();
  try {
    await store.saveContact("old", contactSchema("en").parse(valid), 10000);
    await store.saveContact(
      "new",
      contactSchema("en").parse(valid),
      10000 + 91 * 86400,
    );
    assert.equal(
      sqlite.prepare("SELECT COUNT(*) AS count FROM contact_messages").get()
        ?.count,
      1,
    );
    assert.equal(
      sqlite.prepare("SELECT id FROM contact_messages").get()?.id,
      "new",
    );
  } finally {
    sqlite.close();
  }
});
