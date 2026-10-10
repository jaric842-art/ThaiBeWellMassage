import { useEffect, useRef, useState, type TouchEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

type MassageVideo = {
  id: string;
  title: string;
  src: string;
  description: string;
  durationSeconds: number;
};

// Add each new user-provided clip here, using its massage name as the title.
const massageVideos: MassageVideo[] = [
  {
    id: "voetmassage",
    title: "Voetmassage",
    src: "/videos/voet-massage.mp4",
    description: "Een korte video-impressie van de voetmassage aan huis.",
    durationSeconds: 13,
  },
  {
    id: "gezichtmassage",
    title: "Gezichtmassage",
    src: "/videos/gezicht-massage.mp4",
    description: "Een korte video-impressie van de gezichtsmassage aan huis.",
    durationSeconds: 19,
  },
  {
    id: "thaise-relaxing-oliemassage",
    title: "Thaise oliemassage",
    src: "/videos/thaise-relaxing-oliemassage.mp4",
    description: "Een korte video-impressie van de Thaise oliemassage aan huis.",
    durationSeconds: 16,
  },
  {
    id: "rug-nek-schouder",
    title: "Rug-, nek- en schoudermassage",
    src: "/videos/rug-nek-schouder.mp4",
    description: "Een korte video-impressie van de rug-, nek- en schoudermassage aan huis.",
    durationSeconds: 30,
  },
  {
    id: "hot-stone-massage",
    title: "Hotstonemassage",
    src: "/videos/hot-stone-massage.mp4",
    description: "Een korte video-impressie van de hotstonemassage aan huis.",
    durationSeconds: 9,
  },
  {
    id: "sportmassage",
    title: "Sportmassage",
    src: "/videos/sport-massage.mp4",
    description: "Een korte video-impressie van de sportmassage aan huis.",
    durationSeconds: 12,
  },
  {
    id: "deep-tissue-massage",
    title: "Deep-tissuemassage",
    src: "/videos/deep-tissue-massage.mp4",
    description: "Een korte video-impressie van de deep-tissuemassage aan huis.",
    durationSeconds: 14,
  },
  {
    id: "lymfedrainage-massage",
    title: "Lymfedrainagemassage",
    src: "/videos/lymfedrainage-massage.mp4",
    description: "Een korte video-impressie van de lymfedrainagemassage aan huis.",
    durationSeconds: 36,
  },
  {
    id: "anti-stress-massage",
    title: "Anti-stressmassage",
    src: "/videos/anti-stress-massage.mp4",
    description: "Een korte video-impressie van de anti-stressmassage aan huis.",
    durationSeconds: 28,
  },
];

function formatDuration(seconds: number) {
  const wholeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = wholeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function MassageVideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [duration, setDuration] = useState(massageVideos[0].durationSeconds);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const activeVideo = massageVideos[activeIndex];
  const canNavigate = massageVideos.length > 1;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [activeIndex]);

  const goTo = (index: number) => {
    if (!canNavigate) return;
    setVideoError(false);
    setDuration(massageVideos[index].durationSeconds);
    setActiveIndex(index);
  };

  const move = (direction: -1 | 1) => {
    const nextIndex = (activeIndex + direction + massageVideos.length) % massageVideos.length;
    goTo(nextIndex);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const target = event.target;
    if (target instanceof Element && target.closest("video, button, a")) return;
    const touch = event.touches[0];
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !canNavigate) return;

    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      move(deltaX < 0 ? 1 : -1);
    }
  };

  return (
    <section
      id="massage-videos"
      aria-labelledby="massage-videos-heading"
      className="section-padding overflow-hidden bg-beige"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="max-w-xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <p className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary">
              <Film aria-hidden="true" className="h-4 w-4" />
              Massage in beeld
            </p>
            <h2
              id="massage-videos-heading"
              className="mb-5 text-3xl text-foreground sm:text-4xl lg:text-5xl"
            >
              Ontdek de massage, in alle rust
            </h2>
            <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
              Bekijk een korte video-impressie van de behandeling en ontdek welke massage bij u past.
            </p>

            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/75 p-5 shadow-sm sm:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Film aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.16em] text-primary">
                  Video-impressie
                </p>
                <h3 className="text-xl font-semibold text-foreground">{activeVideo.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {activeVideo.description}
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Bespreek uw massage
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto w-full max-w-[460px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="rounded-[1.75rem] border border-white/80 bg-white p-3 shadow-[0_24px_70px_rgba(39,57,50,0.14)] sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-4 px-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Be Well Thai Massage
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{activeVideo.title}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-beige px-3 py-1.5 text-xs font-medium tabular-nums text-foreground">
                  <Clock aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                  {formatDuration(duration)}
                </span>
              </div>

              <motion.div
                key={activeVideo.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden rounded-[1.25rem] bg-[#17221f]"
              >
                <video
                  ref={videoRef}
                  src={activeVideo.src}
                  controls
                  playsInline
                  preload="auto"
                  aria-label={`Videovoorbeeld: ${activeVideo.title}`}
                  className="aspect-[4/5] w-full bg-[#17221f] object-contain"
                  onLoadedMetadata={(event) => {
                    const measuredDuration = event.currentTarget.duration;
                    if (Number.isFinite(measuredDuration) && measuredDuration > 0) {
                      setDuration(Math.round(measuredDuration));
                    }
                  }}
                  onError={() => setVideoError(true)}
                />
              </motion.div>

              {videoError && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  Deze video kan nu niet worden geladen. Probeer het later opnieuw.
                </p>
              )}

              <div className="mt-4 flex items-center justify-between gap-4 px-1">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    aria-label="Vorige massagevideo"
                    disabled={!canNavigate}
                    onClick={() => move(-1)}
                    className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowLeft aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    aria-label="Volgende massagevideo"
                    disabled={!canNavigate}
                    onClick={() => move(1)}
                    className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
                <p className="text-sm font-medium tabular-nums text-muted-foreground" aria-live="polite">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="mx-1.5 text-primary/50">/</span>
                  {String(massageVideos.length).padStart(2, "0")}
                </p>
              </div>

              {canNavigate && (
                <div className="mt-4 flex justify-center gap-2" aria-label="Kies een massagevideo">
                  {massageVideos.map((video, index) => (
                    <button
                      key={video.id}
                      type="button"
                      aria-label={`Toon ${video.title}`}
                      aria-pressed={index === activeIndex}
                      onClick={() => goTo(index)}
                      className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        index === activeIndex ? "w-7 bg-primary" : "w-2.5 bg-primary/25 hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
