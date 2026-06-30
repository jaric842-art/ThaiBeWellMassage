import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { makeRequest, DistanceMatrixResult } from "./_core/map";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  calculator: router({
    calculateDistance: publicProcedure
      .input(
        z.object({
          destination: z.string().min(1, "Adres is verplicht"),
          service: z.enum(["60", "90", "120"]),
        })
      )
      .mutation(async ({ input }) => {
        const origin = "Putte 2580, België";
        const servicePrices: Record<string, number> = {
          "60": 80,
          "90": 120,
          "120": 135,
        };

        const result = await makeRequest<DistanceMatrixResult>(
          "/maps/api/distancematrix/json",
          {
            origins: origin,
            destinations: input.destination,
            mode: "driving",
            units: "metric",
            language: "nl",
          }
        );

        if (result.status !== "OK") {
          throw new Error("Kon de afstand niet berekenen. Probeer een ander adres.");
        }

        const element = result.rows[0]?.elements[0];
        if (!element || element.status !== "OK") {
          throw new Error("Adres niet gevonden. Controleer het adres en probeer opnieuw.");
        }

        const distanceKm = element.distance.value / 1000;
        const durationMinutes = element.duration.value / 60;

        // First 15 km are free
        const freeKm = 15;
        let travelCost = 0;
        let extraTravelMinutes = 0;

        if (distanceKm > freeKm) {
          // Calculate travel time proportional to extra distance
          const extraRatio = (distanceKm - freeKm) / distanceKm;
          extraTravelMinutes = Math.round(durationMinutes * extraRatio);
          // Travel cost = travel time in hours × €75
          travelCost = Math.round((extraTravelMinutes / 60) * 75 * 100) / 100;
        }

        const massagePrice = servicePrices[input.service];
        const totalPrice = Math.round((massagePrice + travelCost) * 100) / 100;

        return {
          distanceKm: Math.round(distanceKm * 10) / 10,
          distanceText: element.distance.text,
          durationText: element.duration.text,
          durationMinutes: Math.round(durationMinutes),
          extraTravelMinutes,
          travelCost,
          massagePrice,
          totalPrice,
          destinationAddress: result.destination_addresses[0] || input.destination,
        };
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Naam is verplicht"),
          phone: z.string().min(1, "Telefoonnummer is verplicht"),
          email: z.string().email().optional().or(z.literal("")),
          date: z.string().min(1, "Datum is verplicht"),
          time: z.string().optional(),
          service: z.string().min(1, "Kies een massage type"),
          address: z.string().min(1, "Adres is verplicht"),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const content = [
          `**Naam:** ${input.name}`,
          `**Telefoon:** ${input.phone}`,
          input.email ? `**E-mail:** ${input.email}` : null,
          `**Datum:** ${input.date}`,
          input.time ? `**Tijdstip:** ${input.time}` : null,
          `**Massage:** ${input.service}`,
          `**Adres:** ${input.address}`,
          input.message ? `**Bericht:** ${input.message}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        await notifyOwner({
          title: `Nieuwe boeking van ${input.name}`,
          content,
        });

        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
