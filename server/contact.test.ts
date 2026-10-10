import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("accepts valid booking submission and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jan Janssen",
      phone: "0470 12 34 56",
      email: "jan@example.com",
      date: "2026-07-15",
      time: "14:00",
      service: "thai-traditional",
      address: "Kerkstraat 10, 2580 Putte",
      message: "Graag een rustige sfeer",
    });

    expect(result).toEqual({ success: true });
  });

  it("accepts submission without optional fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Sophie Vermeersch",
      phone: "0471 99 88 77",
      email: "",
      date: "2026-08-01",
      service: "sport",
      address: "Dorpstraat 5, 2580 Putte",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects submission with missing required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        phone: "0470 12 34 56",
        email: "",
        date: "2026-07-15",
        service: "thai-traditional",
        address: "Kerkstraat 10, 2580 Putte",
      })
    ).rejects.toThrow();
  });
});
