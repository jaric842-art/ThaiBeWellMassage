import { describe, expect, it, vi } from "vitest";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterProps(props)}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...filterProps(props)}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...filterProps(props)}>{children}</h1>,
    a: ({ children, ...props }: any) => <a {...filterProps(props)}>{children}</a>,
    form: ({ children, ...props }: any) => <form {...filterProps(props)}>{children}</form>,
  },
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
  AnimatePresence: ({ children }: any) => children,
}));

function filterProps(props: any) {
  const { variants, initial, animate, exit, whileInView, transition, style, className, ...rest } = props;
  return { style, className, ...rest };
}

describe("Home page content", () => {
  it("contains all required section identifiers", async () => {
    // Read the source file to verify section IDs exist
    const fs = await import("fs");
    const path = await import("path");
    const homeContent = fs.readFileSync(
      path.resolve(__dirname, "./Home.tsx"),
      "utf-8"
    );

    // Verify all section IDs are present
    expect(homeContent).toContain('id="home"');
    expect(homeContent).toContain('id="services"');
    expect(homeContent).toContain('id="pricing"');
    expect(homeContent).toContain('id="how-it-works"');
    expect(homeContent).toContain('id="reviews"');
    expect(homeContent).toContain('id="contact"');
    expect(homeContent).toContain('id="about"');
  });

  it("contains correct business information", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const homeContent = fs.readFileSync(
      path.resolve(__dirname, "./Home.tsx"),
      "utf-8"
    );

    // Business name
    expect(homeContent).toContain("Be Well Thai Massage");
    // Phone number
    expect(homeContent).toContain("0470 24 29 29");
    // Location
    expect(homeContent).toContain("Putte (2580)");
    // WhatsApp link
    expect(homeContent).toContain("https://wa.me/32470242929");
    // Services
    expect(homeContent).toContain("Thai Traditional Massage");
    expect(homeContent).toContain("Sport Massage");
    expect(homeContent).toContain("Deep Tissue Massage");
    expect(homeContent).toContain("Anti Stress Massage");
    // Pricing
    expect(homeContent).toContain("€80");
    expect(homeContent).toContain("€120");
    expect(homeContent).toContain("€135");
    // Promotion
    expect(homeContent).toContain("Tijdelijke Promotie");
    expect(homeContent).toContain("120 minuten");
  });

  it("contains booking form with address field", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const homeContent = fs.readFileSync(
      path.resolve(__dirname, "./Home.tsx"),
      "utf-8"
    );

    // Form fields
    expect(homeContent).toContain("name:");
    expect(homeContent).toContain("phone:");
    expect(homeContent).toContain("email:");
    expect(homeContent).toContain("date:");
    expect(homeContent).toContain("time:");
    expect(homeContent).toContain("service:");
    expect(homeContent).toContain("address:");
    // Address label
    expect(homeContent).toContain("Adres (voor massage aan huis)");
  });

  it("contains navigation links", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const homeContent = fs.readFileSync(
      path.resolve(__dirname, "./Home.tsx"),
      "utf-8"
    );

    expect(homeContent).toContain("#home");
    expect(homeContent).toContain("#services");
    expect(homeContent).toContain("#pricing");
    expect(homeContent).toContain("#how-it-works");
    expect(homeContent).toContain("#reviews");
    expect(homeContent).toContain("#contact");
  });

  it("contains SEO-relevant content", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const homeContent = fs.readFileSync(
      path.resolve(__dirname, "./Home.tsx"),
      "utf-8"
    );

    expect(homeContent).toContain("Professionele Thaise Massage");
    expect(homeContent).toContain("Aan Huis");
    expect(homeContent).toContain("Boek Uw Massage");
    expect(homeContent).toContain("Massage Bij U Thuis");
  });
});
