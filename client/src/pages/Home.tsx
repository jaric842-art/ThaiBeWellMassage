import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import {
  Phone,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  Calendar,
  CheckCircle,
  Home as HomeIcon,
  Heart,
  Shield,
  Users,
  Sparkles,
  Award,
  Send,
  Calculator,
  Navigation,
  Car,
  Banknote,
  Info,
} from "lucide-react";

// Image URLs
const IMAGES = {
  hero: "https://res.cloudinary.com/dbixnvc2a/image/upload/v1782846386/ee5533b2-6080-4e41-994f-3e52269df1ba_h07lcc.png",
  therapist: "https://res.cloudinary.com/dbixnvc2a/image/upload/v1782763400/WhatsApp_Image_2026-06-24_at_13.46.32_2_j9ioqn.jpg",
  gallery1: "https://res.cloudinary.com/dbixnvc2a/image/upload/v1782842085/WhatsApp_Image_2026-06-24_at_21.13.05_1_qhbfub.jpg",
  gallery2: "https://res.cloudinary.com/dbixnvc2a/image/upload/v1782842283/WhatsApp_Image_2026-06-24_at_13.46.32_3_b8g6lr.jpg",
  gallery3: "https://res.cloudinary.com/dbixnvc2a/image/upload/v1782846485/WhatsApp_Image_2026-06-24_at_21.11.46_nujkjw.jpg",
  logo: "/logo.png",

};


// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Thai-inspired decorative divider
function ThaiDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary/50">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
      </svg>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}

// Section wrapper with fade-in animation
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Navigation
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Behandelingen" },
    { href: "#pricing", label: "Tarieven" },
    { href: "#how-it-works", label: "Werkwijze" },
    { href: "#reviews", label: "Reviews" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-28 md:h-36 px-4 lg:px-8">
        <a href="#home" className="flex items-center">
          <img
            src="/manus-storage/logo-transparent_73240e7a.png"
            alt="Be Well Thai Massage"
            className={`h-28 md:h-36 w-auto transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                scrolled ? "text-foreground/80" : "text-white/90"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+32492767644"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-wide transition-transform hover:scale-105 active:scale-95"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Phone className="w-4 h-4" />
            Boek Nu
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 ${scrolled ? "text-foreground" : "text-white"}`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden bg-white border-b border-border shadow-lg"
        >
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-foreground/80 text-base font-medium py-2 border-b border-border/50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+32492767644"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium mt-2"
            >
              <Phone className="w-4 h-4" />
              Bel 0492 76 76 44
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Professionele Thaise Massage Aan Huis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative container mx-auto px-4 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gold-light text-sm md:text-base tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "var(--font-body)", color: "var(--gold-light)" }}
          >
            Mobiele Thaise Massage
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-6"
          >
            Professionele Thaise Massage{" "}
            <span style={{ color: "var(--gold-light)" }}>Aan Huis</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Ontspan in uw eigen vertrouwde omgeving met authentieke Thaise massage. 
            Professionele service, persoonlijke aanpak.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-medium tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Calendar className="w-5 h-5" />
              Boek Uw Massage
            </a>
            <a
              href="tel:+32492767644"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full text-base font-medium tracking-wide transition-all hover:bg-white/20"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Phone className="w-5 h-5" />
              Bel 0492 76 76 44
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    {
      title: "Thai Traditional Massage",
      description: "Authentieke Thaise massage die het hele lichaam strekt en ontspant. Verbetert flexibiliteit en energiestroom door drukpunttechnieken.",
      duration: "vanaf 120 min",
      price: "vanaf €135",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "Sport Massage",
      description: "Gerichte massage voor sporters en actieve mensen. Helpt bij herstel, voorkomt blessures en verlicht spierspanning.",
      duration: "vanaf 120 min",
      price: "vanaf €135",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Deep Tissue Massage",
      description: "Intensieve diepe weefselmassage die chronische spanning en knopen aanpakt. Ideaal bij hardnekkige klachten.",
      duration: "vanaf 120 min",
      price: "vanaf €135",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Anti Stress Massage",
      description: "Zachte, ontspannende massage die stress en spanning vermindert. Perfect voor mentale rust en diepe ontspanning.",
      duration: "vanaf 120 min",
      price: "vanaf €135",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Onze Behandelingen
          </motion.p>
          <motion.div variants={fadeInUp}><ThaiDivider className="mb-4" /></motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Authentieke Thaise Massage
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Ervaar de helende kracht van traditionele Thaise massagetechnieken, 
            professioneel uitgevoerd in het comfort van uw eigen huis.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={fadeInUp}
              className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {service.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-1" style={{ fontFamily: "var(--font-body)" }}>
                  <Clock className="w-4 h-4" /> {service.duration}
                </span>
                <span className="text-lg font-semibold text-primary">{service.price}</span>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// Promotion Section
function PromotionSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, var(--turquoise), oklch(0.45 0.08 180))" }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative">
        <AnimatedSection className="text-center">
          <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm mb-6 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
            Geldig tot 30 september 2026
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Tijdelijke Promotie
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/90 text-xl md:text-2xl mb-8" style={{ fontFamily: "var(--font-body)" }}>
            Geniet van <span className="font-bold text-white">120 minuten</span> massage voor slechts <span className="line-through text-white/60">€135</span>
          </motion.p>
          <motion.div variants={fadeInUp} className="inline-flex items-baseline gap-1 mb-8">
            <span className="text-5xl md:text-7xl font-bold text-white">€120</span>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full text-base font-medium tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Calendar className="w-5 h-5" />
              Boek Deze Aanbieding
            </a>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const plans = [
    { duration: "60 minuten", price: "€80", description: "Gerichte behandeling", popular: false, bookable: false },
    { duration: "90 minuten", price: "€120", description: "Uitgebreide ontspanning", popular: false, bookable: false },
    { duration: "120 minuten", price: "€135", description: "Volledige luxe wellness ervaring", popular: true, bookable: true },
  ];

  return (
    <section id="pricing" className="section-padding bg-beige">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Tarieven
          </motion.p>
          <motion.div variants={fadeInUp}><ThaiDivider className="mb-4" /></motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Transparante Prijzen
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Alle prijzen zijn inclusief professionele materialen en verplaatsing binnen 15 km van Putte.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.duration}
              variants={fadeInUp}
              className={`relative bg-white rounded-xl p-8 text-center transition-all duration-300 ${
                plan.popular ? "ring-2 ring-primary shadow-lg scale-105 hover:shadow-xl hover:-translate-y-1" : "border border-border opacity-75"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                  Minimum Boeking
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2">{plan.duration}</h3>
              <p className="text-muted-foreground text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-3 mb-8 text-left" style={{ fontFamily: "var(--font-body)" }}>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> Alle massagetypes beschikbaar</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> Professionele materialen inbegrepen</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> Bij u thuis</li>
              </ul>
              {plan.bookable ? (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all bg-primary text-primary-foreground hover:scale-105"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Boek Nu <ChevronRight className="w-4 h-4" />
                </a>
              ) : (
                <span className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-wide bg-muted text-muted-foreground cursor-default" style={{ fontFamily: "var(--font-body)" }}>
                  Niet apart te boeken
                </span>
              )}
            </motion.div>
          ))}
        </AnimatedSection>

        <AnimatedSection className="mt-8 text-center">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
            <Clock className="w-4 h-4" />
            Minimum boeking: 120 minuten (2 uur)
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Price Calculator Section
function PriceCalculatorSection() {
  const [address, setAddress] = useState("");
  const [selectedMassage, setSelectedMassage] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ description: string; place_id: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const calculateMutation = trpc.calculator.calculateDistance.useMutation();

  const massageTypes = [
    { id: "thai-traditional", name: "Thai Traditional Massage", icon: "✨" },
    { id: "sport", name: "Sport Massage", icon: "⚡" },
    { id: "deep-tissue", name: "Deep Tissue Massage", icon: "💪" },
    { id: "anti-stress", name: "Anti Stress Massage", icon: "🌿" },
  ];

  // Load Google Maps script for autocomplete
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
    const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
    const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

    const loadScript = () => {
      if (window.google?.maps?.places) {
        autocompleteRef.current = new window.google.maps.places.AutocompleteService();
        return;
      }
      const script = document.createElement("script");
      script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=places`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        autocompleteRef.current = new window.google.maps.places.AutocompleteService();
      };
      document.head.appendChild(script);
    };
    loadScript();
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 2 && autocompleteRef.current) {
      autocompleteRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "be" },
          types: ["address"],
        },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(predictions.map(p => ({ description: p.description, place_id: p.place_id })));
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: { description: string }) => {
    setAddress(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleCalculate = () => {
    if (!address.trim()) return;
    calculateMutation.mutate({ destination: address, service: "120" });
  };

  const result = calculateMutation.data;

  // Build WhatsApp message with calculation results
  const getWhatsAppLink = () => {
    const massage = massageTypes.find(m => m.id === selectedMassage);
    let msg = `Hallo! Ik wil graag een massage boeken.\n\n`;
    msg += `💆 Massage: ${massage?.name || "Nog te kiezen"}\n`;
    msg += `⏰ Duur: 120 minuten\n`;
    if (result) {
      msg += `📍 Adres: ${address}\n`;
      msg += `💰 Geschatte prijs: €${result.totalPrice.toFixed(2).replace(".", ",")}\n`;
    } else if (address) {
      msg += `📍 Adres: ${address}\n`;
    }
    msg += `\nKunt u mij bevestigen?`;
    return `https://wa.me/32492767644?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="calculator" className="section-padding bg-gradient-to-b from-beige to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Prijscalculator
          </motion.p>
          <motion.div variants={fadeInUp}><ThaiDivider className="mb-4" /></motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Bereken Uw Prijs
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Kies uw massage, voer uw adres in en ontdek direct uw totaalprijs.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="relative backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            style={{ backdropFilter: "blur(20px)" }}
          >
            {/* Step 1: Massage type selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3" style={{ fontFamily: "var(--font-body)" }}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mr-2">1</span>
                Kies uw massage
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {massageTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedMassage(type.id)}
                    className={`relative px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-left flex items-center gap-3 ${
                      selectedMassage === type.id
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30 scale-[1.02]"
                        : "bg-white/80 text-foreground border border-border hover:border-primary/50 hover:bg-white hover:shadow-sm"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.name}</span>
                    {selectedMassage === type.id && (
                      <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-body)" }}>
                <Clock className="w-3.5 h-3.5" />
                Minimum boeking: 120 minuten • €135
              </p>
            </div>

            {/* Step 2: Address input with autocomplete */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-foreground mb-3" style={{ fontFamily: "var(--font-body)" }}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mr-2">2</span>
                Uw adres
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                  placeholder="Voer uw adres of postcode in..."
                  className="w-full pl-12 pr-4 py-4 bg-white/90 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              {/* Autocomplete suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-border shadow-xl z-50 overflow-hidden"
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={s.place_id || i}
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors text-sm text-foreground border-b border-border/50 last:border-0 flex items-center gap-3"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      {s.description}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Calculate button */}
            <motion.button
              onClick={handleCalculate}
              disabled={!address.trim() || calculateMutation.isPending}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium text-base tracking-wide transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {calculateMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Berekenen...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Bereken Mijn Prijs
                </>
              )}
            </motion.button>

            {/* Error */}
            {calculateMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {calculateMutation.error?.message || "Er ging iets mis. Probeer opnieuw."}
              </motion.div>
            )}

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="mt-8"
              >
                <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-xl p-6 border border-primary/10">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    Uw Prijsindicatie
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                        <Car className="w-4 h-4" /> Afstand
                      </span>
                      <span className="font-medium text-foreground">{result.distanceText}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                        <Clock className="w-4 h-4" /> Reistijd boven gratis zone
                      </span>
                      <span className="font-medium text-foreground">
                        {result.extraTravelMinutes > 0 ? `${result.extraTravelMinutes} minuten` : "Gratis (binnen 15 km)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                        <Banknote className="w-4 h-4" /> Verplaatsingskost
                      </span>
                      <span className="font-medium text-foreground">
                        {result.travelCost > 0 ? `€${result.travelCost.toFixed(2).replace(".", ",")}` : "Gratis"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                        <Heart className="w-4 h-4" /> Massageprijs (120 min)
                      </span>
                      <span className="font-medium text-foreground">€{result.massagePrice}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 bg-primary/10 rounded-lg px-4 -mx-2 mt-2">
                      <span className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        Totaalprijs
                      </span>
                      <span className="text-2xl font-bold text-primary">€{result.totalPrice.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>De berekende prijs is een indicatie. De definitieve prijs wordt bevestigd bij het maken van de afspraak.</p>
                </div>

                {/* Booking CTAs */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-medium text-base tracking-wide transition-all hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Boek via WhatsApp
                  </a>
                  <a
                    href="tel:+32492767644"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-base tracking-wide transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <Phone className="w-5 h-5" />
                    Bel Direct
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="relative">
              <img
                src={IMAGES.therapist}
                alt="Professionele Thai Massage Therapeut"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-[3/4]"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>10+ jaar ervaring</p>
              </div>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection>
            <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
              Over Ons
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl text-foreground mb-6">
              Passie voor Authentieke Thaise Massage
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-base mb-4 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Met meer dan tien jaar ervaring in traditionele Thaise massagetechnieken brengt Be Well Thai Massage 
              professionele wellness direct bij u thuis. Opgeleid in Thailand en gecertificeerd in diverse 
              massagetechnieken, combineer ik authentieke kennis met een persoonlijke aanpak.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-base mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Het concept van mobiele massage stelt u in staat om volledig te ontspannen in uw eigen vertrouwde 
              omgeving, zonder de stress van verplaatsing. Ik breng alle professionele materialen mee zodat u 
              enkel hoeft te genieten.
            </motion.p>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {[
                { icon: <Award className="w-5 h-5" />, text: "Gecertificeerd in Thailand" },
                { icon: <Users className="w-5 h-5" />, text: "500+ tevreden klanten" },
                { icon: <Shield className="w-5 h-5" />, text: "Verzekerd & professioneel" },
                { icon: <Heart className="w-5 h-5" />, text: "Persoonlijke aanpak" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="text-primary">{item.icon}</div>
                  <span className="text-sm text-foreground font-medium" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Boek",
      description: "Bel of vul het contactformulier in. Kies uw gewenste massage, datum en tijdstip.",
      icon: <Calendar className="w-7 h-7" />,
    },
    {
      step: "02",
      title: "Bevestig",
      description: "U ontvangt een bevestiging met alle details. Wij bereiden alles voor.",
      icon: <CheckCircle className="w-7 h-7" />,
    },
    {
      step: "03",
      title: "Ontspan",
      description: "Wij komen bij u thuis met alle professionele materialen. U hoeft enkel te genieten.",
      icon: <HomeIcon className="w-7 h-7" />,
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-beige">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Werkwijze
          </motion.p>
          <motion.div variants={fadeInUp}><ThaiDivider className="mb-4" /></motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Massage Bij U Thuis
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Be Well Thai Massage komt bij u thuis zodat u kunt genieten van een professionele massage 
            in uw eigen vertrouwde omgeving.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {steps.map((step, index) => (
            <motion.div key={step.step} variants={fadeInUp} className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
              )}
            </motion.div>
          ))}
        </AnimatedSection>

        {/* Important conditions */}
        <AnimatedSection className="max-w-3xl mx-auto">
          <motion.div variants={fadeInUp} className="bg-white rounded-xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Belangrijke Voorwaarden</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Clock className="w-5 h-5" />, text: "Minimum boeking: 120 minuten (2 uur)" },
                { icon: <MapPin className="w-5 h-5" />, text: "Service binnen 15 km van Putte (2580)" },
                { icon: <ChevronRight className="w-5 h-5" />, text: "Buiten 15 km: extra reistijd per uur" },
                { icon: <HomeIcon className="w-5 h-5" />, text: "Uitsluitend bij klanten thuis" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 p-3">
                  <div className="text-primary mt-0.5 flex-shrink-0">{item.icon}</div>
                  <span className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyChooseUsSection() {
  const reasons = [
    { icon: <Shield className="w-6 h-6" />, title: "Professionele Service", description: "Gecertificeerd en verzekerd voor uw gemoedsrust" },
    { icon: <HomeIcon className="w-6 h-6" />, title: "Ontspanning Thuis", description: "Geen verplaatsing nodig, wij komen bij u" },
    { icon: <Calendar className="w-6 h-6" />, title: "Flexibele Afspraken", description: "Boek op het moment dat het u past" },
    { icon: <Heart className="w-6 h-6" />, title: "Persoonlijke Aanpak", description: "Elke massage afgestemd op uw behoeften" },
    { icon: <Sparkles className="w-6 h-6" />, title: "Authentieke Technieken", description: "Traditionele Thaise methoden uit Thailand" },
    { icon: <Star className="w-6 h-6" />, title: "Rustgevende Ervaring", description: "Volledige ontspanning van begin tot eind" },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Waarom Wij
          </motion.p>
          <motion.div variants={fadeInUp}><ThaiDivider className="mb-4" /></motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Waarom Kiezen Voor Ons
          </motion.h2>
        </AnimatedSection>

        <AnimatedSection className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={fadeInUp}
              className="flex items-start gap-4 p-5 rounded-xl hover:bg-secondary/50 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {reason.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{reason.title}</h3>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// Reviews Section
function ReviewsSection() {
  const reviews = [
    {
      name: "Sophie V.",
      rating: 5,
      text: "Fantastische ervaring! De massage was zeer professioneel en ontspannend. Het gemak van thuis is onbetaalbaar.",
      date: "2 weken geleden",
    },
    {
      name: "Marc D.",
      rating: 5,
      text: "Na mijn sportblessure heeft de sport massage enorm geholpen. Zeer deskundig en vriendelijk. Absolute aanrader!",
      date: "1 maand geleden",
    },
    {
      name: "Lies B.",
      rating: 5,
      text: "De anti-stress massage was precies wat ik nodig had. Professioneel, punctueel en zeer ontspannend. Ik boek zeker opnieuw.",
      date: "3 weken geleden",
    },
  ];

  return (
    <section id="reviews" className="section-padding bg-beige">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Ervaringen
          </motion.p>
          <motion.div variants={fadeInUp}><ThaiDivider className="mb-4" /></motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Wat Onze Klanten Zeggen
          </motion.h2>
        </AnimatedSection>

        <AnimatedSection className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {reviews.map((review) => (
            <motion.div
              key={review.name}
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed italic" style={{ fontFamily: "var(--font-body)" }}>
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{review.name}</span>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>{review.date}</span>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>

        {/* Review platform links */}
        <AnimatedSection className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            variants={fadeInUp}
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-border rounded-full hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>Google Reviews</span>
          </motion.a>
          <motion.a
            variants={fadeInUp}
            href="https://www.tripadvisor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-border rounded-full hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#34E0A1"/>
              <circle cx="8.5" cy="12" r="3" fill="white"/>
              <circle cx="15.5" cy="12" r="3" fill="white"/>
              <circle cx="8.5" cy="12" r="1.5" fill="#333"/>
              <circle cx="15.5" cy="12" r="1.5" fill="#333"/>
              <path d="M12 7l-1 -2h2l-1 2z" fill="#FF0000"/>
            </svg>
            <span className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>Tripadvisor</span>
          </motion.a>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Gallery Section
function GallerySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Galerij
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground">
            Sfeerbeelden
          </motion.h2>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[IMAGES.gallery1, IMAGES.gallery2, IMAGES.gallery3].map((img, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative overflow-hidden rounded-xl group aspect-[4/3]"
            >
              <img
                src={img}
                alt={`Wellness sfeerbeeld ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// Service Area Section
function ServiceAreaSection() {
  return (
    <section className="section-padding bg-beige">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Werkgebied
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Ons Servicegebied
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Wij bieden onze diensten aan in Putte (2580) en omgeving binnen een straal van 15 km.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="max-w-3xl mx-auto">
          <motion.div variants={fadeInUp} className="bg-white rounded-xl p-8 border border-border shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Putte (2580) en Omgeving</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {["Putte", "Mechelen", "Lier", "Bonheiden", "Heist-op-den-Berg", "Berlaar", "Duffel", "Sint-Katelijne-Waver"].map((city) => (
                <div key={city} className="flex items-center gap-2 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {city}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground border-t border-border pt-4" style={{ fontFamily: "var(--font-body)" }}>
              Buiten een straal van 15 km wordt extra reistijd aangerekend per uur.
            </p>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "",
    duration: "120",
    address: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message || "Er is een fout opgetreden. Probeer het opnieuw."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    submitMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || "",
      date: formData.date,
      time: formData.time,
      service: `${formData.service} (120 min)`,
      address: formData.address,
      message: formData.message,
    });
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeInUp} className="text-primary text-sm tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Contact
          </motion.p>
          <motion.div variants={fadeInUp}><ThaiDivider className="mb-4" /></motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Boek Uw Massage
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Vul het formulier in of bel ons direct voor een afspraak.
          </motion.p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <AnimatedSection className="lg:col-span-3">
            {submitted ? (
              <motion.div variants={fadeInUp} className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Bedankt voor uw bericht!</h3>
                <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  Wij nemen zo snel mogelijk contact met u op om uw afspraak te bevestigen.
                </p>
              </motion.div>
            ) : (
              <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Naam *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      style={{ fontFamily: "var(--font-body)" }}
                      placeholder="Uw volledige naam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Telefoon *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      style={{ fontFamily: "var(--font-body)" }}
                      placeholder="Uw telefoonnummer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="Uw e-mailadres"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Gewenste Datum *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Gewenst Tijdstip</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Type Massage *</label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <option value="">Selecteer een massage</option>
                    <option value="thai-traditional">Thai Traditional Massage</option>
                    <option value="sport">Sport Massage</option>
                    <option value="deep-tissue">Deep Tissue Massage</option>
                    <option value="anti-stress">Anti Stress Massage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Duur *</label>
                  <div className="w-full px-4 py-3 rounded-lg border border-primary/30 bg-primary/5 text-foreground text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                    120 minuten — €135
                  </div>
                  <p className="text-xs text-primary mt-1.5 font-medium" style={{ fontFamily: "var(--font-body)" }}>⚠️ Minimum boeking: 120 minuten (2 uur)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Adres (voor massage aan huis) *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="Straat, huisnummer, postcode, gemeente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Bericht (optioneel)</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="Eventuele opmerkingen of wensen"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm" style={{ fontFamily: "var(--font-body)" }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-medium tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <Send className="w-5 h-5" />
                  {submitMutation.isPending ? "Verzenden..." : "Verstuur Aanvraag"}
                </button>
              </motion.form>
            )}
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection className="lg:col-span-2">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  <a href="tel:+32492767644" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>Telefoon</p>
                      <p className="text-base font-semibold">0492 76 76 44</p>
                    </div>
                  </a>
                  <a href="https://wa.me/32492767644" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>WhatsApp</p>
                      <p className="text-base font-semibold">Stuur een bericht</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>Werkgebied</p>
                      <p className="text-base font-semibold">Putte (2580) en omgeving</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-primary rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">Bel Nu Voor Een Afspraak</h3>
                <p className="text-primary-foreground/80 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  Wij staan klaar om u te helpen
                </p>
                <a
                  href="tel:+32492767644"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-primary rounded-full text-lg font-semibold tracking-wide transition-transform hover:scale-105 active:scale-95"
                >
                  <Phone className="w-5 h-5" />
                  0492 76 76 44
                </a>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <img
              src="/manus-storage/logo-transparent_73240e7a.png"
              alt="Be Well Thai Massage"
              className="h-16 w-auto brightness-0 invert mb-3"
            />
            <p className="text-white/60 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Putte (2580) en omgeving
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "var(--font-body)" }}>Navigatie</h4>
            <div className="space-y-2">
              {["Home", "Behandelingen", "Tarieven", "Werkwijze", "Reviews", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link === "Home" ? "home" : link === "Behandelingen" ? "services" : link === "Tarieven" ? "pricing" : link === "Werkwijze" ? "how-it-works" : link.toLowerCase()}`}
                  className="block text-white/60 text-sm hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "var(--font-body)" }}>Contact</h4>
            <div className="space-y-2">
              <a href="tel:+32492767644" className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                <Phone className="w-4 h-4" /> 0492 76 76 44
              </a>
              <a href="https://wa.me/32492767644" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                </svg>
              </a>
              <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-white/40 text-xs leading-relaxed text-center" style={{ fontFamily: "var(--font-body)" }}>
            Massages worden uitsluitend bij klanten thuis uitgevoerd. Minimum boeking van 120 minuten (2 uur). 
            Extra reistijd buiten een straal van 15 km rond Putte wordt aangerekend.
          </p>
          <p className="text-white/30 text-xs text-center mt-3" style={{ fontFamily: "var(--font-body)" }}>
            &copy; {new Date().getFullYear()} Be Well Thai Massage. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Floating WhatsApp Button
function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://wa.me/32492767644"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
      <a
        href="tel:+32492767644"
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        aria-label="Bel ons"
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}

// Main Home Page
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PromotionSection />
      <PricingSection />
      <PriceCalculatorSection />
      <AboutSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <ReviewsSection />
      <GallerySection />
      <ServiceAreaSection />
      <ContactSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
