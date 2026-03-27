import { describe, it, expect, beforeEach } from "vitest";
import { createMockStorageAdapter, createMockTask } from "@/test/mocks";
import type { StorageAdapter } from "../adapter";

describe("createMockStorageAdapter", () => {
  let adapter: StorageAdapter;

  beforeEach(() => {
    adapter = createMockStorageAdapter();
  });

  it("implements all StorageAdapter methods", () => {
    expect(adapter.getAll).toBeInstanceOf(Function);
    expect(adapter.getById).toBeInstanceOf(Function);
    expect(adapter.put).toBeInstanceOf(Function);
    expect(adapter.delete).toBeInstanceOf(Function);
    expect(adapter.query).toBeInstanceOf(Function);
    expect(adapter.clear).toBeInstanceOf(Function);
  });

  it("stores and retrieves items", async () => {
    const task = createMockTask({ id: "t1" });
    await adapter.put("tasks", task);

    const result = await adapter.getById("tasks", "t1");
    expect(result).toEqual(task);
  });

  it("isolates stores from each other", async () => {
    await adapter.put("tasks", createMockTask({ id: "t1" }));
    const notes = await adapter.getAll("notes");
    expect(notes).toEqual([]);
  });
});
