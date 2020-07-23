import { Cache } from "./mod.ts";
import { assert, assertEquals, resolve } from "./test_deps.ts";

Deno.test({
  name: "cache | local | relative",
  async fn(): Promise<void> {
    const url = "file://./README.md";

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("local");
    await local.purge();

    assert(!await local.exists(url));

    const file = await local.fetch(url);
    assertEquals(file.origin, Cache.Origin.FETCH);

    assert(await local.exists(url));

    await local.remove(url);
    assert(!await local.exists(url));
  },
});
Deno.test({
  name: "cache | local | abs/rel",
  async fn(): Promise<void> {
    const abs = `file://${resolve("./README.md")}`;
    const rel = `file://./README.md`;

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("local");
    await local.purge();

    assert(!await local.exists(abs));
    assert(!await local.exists(rel));

    const fileABS = await local.fetch(abs);
    const fileREL = await local.fetch(rel);

    assertEquals(fileABS.origin, Cache.Origin.FETCH);
    assertEquals(fileREL.origin, Cache.Origin.CACHE);

    assertEquals(fileREL.meta.url, fileABS.meta.url);

    assert(await local.exists(abs));
    assert(await local.exists(rel));

    await local.remove(abs);
    assert(!await local.exists(rel));
  },
});

Deno.test({
  name: "cache | remote",
  async fn(): Promise<void> {
    const url = "https://deno.land/std/version.ts";

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("remote");
    await local.purge();

    assert(!await local.exists(url));

    const file = await local.fetch(url);
    assertEquals(file.origin, Cache.Origin.FETCH);

    assert(await local.exists(url));

    await local.remove(url);
    assert(!await local.exists(url));
  },
});
