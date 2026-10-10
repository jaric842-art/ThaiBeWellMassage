import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the map module
vi.mock("./_core/map", () => ({
  makeRequest: vi.fn().mockResolvedValue({
    status: "OK",
    origin_addresses: ["Putte 2580, België"],
    destination_addresses: ["Antwerpen, België"],
    rows: [
      {
        elements: [
          {
            status: "OK",
            distance: { text: "35 km", value: 35000 },
            duration: { text: "30 min", value: 1800 },
          },
        ],
      },
    ],
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("calculator.calculateDistance", () => {
  it("calculates distance and price correctly for a location beyond 15km", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.calculateDistance({
      destination: "Antwerpen, België",
      service: "120",
    });

    expect(result.distanceKm).toBe(35);
    expect(result.distanceText).toBe("35 km");
    expect(result.durationMinutes).toBe(30);
    expect(result.massagePrice).toBe(135);
    // Extra travel: (35-15)/35 * 30 = ~17 minutes
    // Travel cost: 17/60 * 75 = ~21.25
    expect(result.extraTravelMinutes).toBeGreaterThan(0);
    expect(result.travelCost).toBeGreaterThan(0);
    expect(result.totalPrice).toBe(result.massagePrice + result.travelCost);
  });

  it("returns zero travel cost for locations within 15km", async () => {
    const { makeRequest } = await import("./_core/map");
    (makeRequest as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: "OK",
      origin_addresses: ["Putte 2580, België"],
      destination_addresses: ["Mechelen, België"],
      rows: [
        {
          elements: [
            {
              status: "OK",
              distance: { text: "10 km", value: 10000 },
              duration: { text: "12 min", value: 720 },
            },
          ],
        },
      ],
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.calculateDistance({
      destination: "Mechelen, België",
      service: "90",
    });

    expect(result.distanceKm).toBe(10);
    expect(result.travelCost).toBe(0);
    expect(result.extraTravelMinutes).toBe(0);
    expect(result.massagePrice).toBe(120);
    expect(result.totalPrice).toBe(120);
  });

  it("throws error for invalid address", async () => {
    const { makeRequest } = await import("./_core/map");
    (makeRequest as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: "OK",
      origin_addresses: ["Putte 2580, België"],
      destination_addresses: [""],
      rows: [
        {
          elements: [
            {
              status: "NOT_FOUND",
              distance: { text: "", value: 0 },
              duration: { text: "", value: 0 },
            },
          ],
        },
      ],
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.calculator.calculateDistance({
        destination: "xyznonexistent",
        service: "90",
      })
    ).rejects.toThrow();
  });
});
