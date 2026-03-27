import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageAdapter } from "../localstorage-adapter";
import { createMockTask } from "@/test/mocks";
import { StorageError } from "../errors";

describe("LocalStorageAdapter", () => {
  let adapter: LocalStorageAdapter;
  const STORE = "tasks";

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter();
  });

  it("returns empty array for empty store", async () => {
    const result = await adapter.getAll(STORE);
    expect(result).toEqual([]);
  });

  it("puts and retrieves an item by id", async () => {
    const task = createMockTask({ id: "t1", title: "Buy milk" });
    await adapter.put(STORE, task);

    const retrieved = await adapter.getById(STORE, "t1");
    expect(retrieved).toEqual(task);
  });

  it("updates an existing item", async () => {
    const task = createMockTask({ id: "t1", title: "Buy milk" });
    await adapter.put(STORE, task);

    const updated = { ...task, title: "Buy oat milk" };
    await adapter.put(STORE, updated);

    const all = await adapter.getAll(STORE);
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(updated);
  });

  it("deletes an item", async () => {
    const task = createMockTask({ id: "t1" });
    await adapter.put(STORE, task);
    await adapter.delete(STORE, "t1");

    const result = await adapter.getById(STORE, "t1");
    expect(result).toBeUndefined();
  });

  it("queries items with a filter", async () => {
    await adapter.put(STORE, createMockTask({ id: "t1", status: "todo" }));
    await adapter.put(STORE, createMockTask({ id: "t2", status: "done" }));
    await adapter.put(STORE, createMockTask({ id: "t3", status: "todo" }));

    const todos = await adapter.query(STORE, (t: { status: string }) => t.status === "todo");
    expect(todos).toHaveLength(2);
  });

  it("clears all items in a store", async () => {
    await adapter.put(STORE, createMockTask({ id: "t1" }));
    await adapter.put(STORE, createMockTask({ id: "t2" }));
    await adapter.clear(STORE);

    const all = await adapter.getAll(STORE);
    expect(all).toEqual([]);
  });

  it("throws StorageError on corrupted data", async () => {
    localStorage.setItem("todo-app:tasks", '"not-an-array"');
    await expect(adapter.getAll(STORE)).rejects.toThrow(StorageError);
  });
});
