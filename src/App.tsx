import { useState, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import {
  profile,
  socials,
  stats,
  brands,
  selectedWork,
  services,
  whatsNext,
  press,
} from "./data";
import { generateMediaKitPDF } from "./pdf-generator";
import { useReveal } from "./useReveal";

function DownloadButton({
  variant = "solid",
  className = "",
}: {
  variant?: "solid" | "outline";
  className?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const base =
    "magnetic-button group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide";
  const styles =
    variant === "solid"
      ? "bg-gold text-ink hover:bg-parchment hover:text-ink"
      : "border border-parchment/40 text-parchment hover:border-gold hover:text-gold";

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const button = buttonRef.current;
    if (!button) return;
    const bounds = button.getBoundingClientRect();
    button.style.setProperty("--magnet-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.1}px`);
    button.style.setProperty("--magnet-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.16}px`);
  };

  const reset = () => {
    buttonRef.current?.style.setProperty("--magnet-x", "0px");
    buttonRef.current?.style.setProperty("--magnet-y", "0px");
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => generateMediaKitPDF()}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={`${base} ${styles} ${className}`}
    >
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      Download media kit (PDF)
    </button>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty("transform", `scaleX(${distance > 0 ? window.scrollY / distance : 0})`);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const links = [
    ["About", "about"],
    ["The Show", "show"],
    ["Work", "work"],
    ["Services", "services"],
    ["What's Next", "next"],
    ["Press", "press"],
    ["Contact", "contact"],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/95 backdrop-blur-md py-3 shadow-xl shadow-ink/20" : "bg-gradient-to-b from-ink/70 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex flex-col leading-none">
          <span className="font-serif text-lg font-semibold tracking-tight text-parchment">
            CITY<span className="text-gold">MAKOTI</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-parchment/50">
            Anika Dambuza
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="nav-link text-xs font-medium uppercase tracking-widest text-parchment/75 transition-colors hover:text-gold focus-visible:text-gold"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => generateMediaKitPDF()}
            className="hidden rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-all hover:bg-parchment active:scale-95 sm:inline-flex"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-parchment transition-colors hover:bg-parchment/10 active:bg-parchment/20 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-nav mt-3 border-t border-parchment/10 bg-ink px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-parchment/80"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
      <div ref={progressRef} className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gold" aria-hidden="true" />
    </header>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  const movePhoto = (clientX: number, clientY: number) => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = hero.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      hero.style.setProperty("--shift-x", `${(0.5 - x) * 22}px`);
      hero.style.setProperty("--shift-y", `${(0.5 - y) * 16}px`);
      hero.style.setProperty("--glow-x", `${x * 100}%`);
      hero.style.setProperty("--glow-y", `${y * 100}%`);
      hero.dataset.interacting = "true";
      frameRef.current = null;
    });
  };

  const resetPhoto = () => {
    const hero = heroRef.current;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (!hero) return;
    hero.style.setProperty("--shift-x", "0px");
    hero.style.setProperty("--shift-y", "0px");
    hero.style.setProperty("--glow-x", "75%");
    hero.style.setProperty("--glow-y", "45%");
    delete hero.dataset.interacting;
  };

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="hero relative isolate overflow-hidden bg-ink text-parchment"
      onPointerMove={(event: ReactPointerEvent<HTMLElement>) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") movePhoto(event.clientX, event.clientY);
      }}
      onPointerLeave={resetPhoto}
      onTouchStart={(event: ReactTouchEvent<HTMLElement>) => {
        const touch = event.touches[0];
        if (touch) movePhoto(touch.clientX, touch.clientY);
      }}
      onTouchMove={(event: ReactTouchEvent<HTMLElement>) => {
        const touch = event.touches[0];
        if (touch) movePhoto(touch.clientX, touch.clientY);
      }}
      onTouchEnd={resetPhoto}
    >
      <div className="hero-photo-parallax pointer-events-none absolute -inset-[3%]" aria-hidden="true">
        <div className="hero-photo-breath h-full w-full">
          <img
            src="/images/citymakoti-hero.jpg"
            alt=""
            className="hero-photo h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>
      </div>
      <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="hero-layout relative z-10 mx-auto flex w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="hero-content max-w-[680px]">
          <p className="hero-kicker mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            CITYMAKOTI (Pty) Ltd
          </p>

          <h1 className="hero-title font-serif font-medium tracking-[-0.035em]">
            <span className="hero-line-mask"><span className="hero-line hero-line-one">Anika</span></span>
            <span className="hero-line-mask"><span className="hero-line hero-line-two">Dambuza</span></span>
          </h1>

          <p className="hero-alias mt-4 font-serif text-3xl font-light italic text-parchment/90 sm:text-4xl">
            The City Makoti <span className="mx-2 text-gold/70">/</span> {profile.tagline}
          </p>

          <p className="hero-copy mt-6 max-w-[540px] text-[15px] leading-[1.75] text-parchment/85 sm:text-base">
            Storyteller, entrepreneur and founder of a South African media company built on real life, shared across cultures.
          </p>

          <div className="hero-actions mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <DownloadButton />
            <a href="#contact" className="hero-text-link group inline-flex items-center gap-3 text-sm font-semibold text-parchment">
              Book a partnership
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value }: { value: string }) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = numberRef.current;
    const parts = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!element || !parts || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const target = Number(parts[1]);
    const decimals = parts[1].includes(".") ? 1 : 0;
    const suffix = parts[2];
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - started) / 1300, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={numberRef} aria-label={value}>{value}</span>;
}

function Stats() {
  return (
    <section className="border-y border-ink/10 bg-parchment">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-ink/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((s, i) => (
          <div
            key={s.platform}
            className="reveal px-6 py-10 md:px-10"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">
                {s.platform}
              </span>
              <span className="text-xs text-ink/40">{s.handle}</span>
            </div>
            <p className="mt-4 font-serif text-5xl font-medium text-ink"><AnimatedNumber value={s.primary} /></p>
            <p className="mt-1 text-sm text-ink/60">{s.primaryLabel}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="font-serif text-xl text-emerald">{s.secondary}</span>
              <span className="text-ink/50">{s.secondaryLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <section className="overflow-hidden bg-ink py-8">
      <div className="mb-6 px-6">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">
          Trusted by leading brands
        </p>
      </div>
      <div className="marquee-track relative flex overflow-hidden">
        <div className="animate-marquee flex shrink-0">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={copy === 1}>
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="whitespace-nowrap font-serif text-2xl italic text-parchment/60 transition-colors hover:text-blush md:text-3xl"
                >
                  {brand}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  kicker,
  title,
  accent = "emerald",
}: {
  kicker: string;
  title: string;
  accent?: "emerald" | "burgundy" | "gold";
}) {
  const color =
    accent === "burgundy" ? "text-burgundy" : accent === "gold" ? "text-gold" : "text-emerald";
  const bar =
    accent === "burgundy" ? "bg-burgundy" : accent === "gold" ? "bg-gold" : "bg-emerald";
  return (
    <div className="reveal mb-12 max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <span className={`h-px w-10 ${bar}`} />
        <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${color}`}>{kicker}</span>
      </div>
      <h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-[2.75rem]">
        {title}
      </h2>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="bg-parchment py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead kicker="About" title="A real life, told out loud." />
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div className="reveal space-y-5 text-lg leading-relaxed text-ink/80">
            <p>
              Anika Dambuza is a South African content creator, entrepreneur, reality TV star and
              founder of <span className="font-semibold text-emerald">CITYMAKOTI (Pty) Ltd</span>,
              a media company established in 2024.
            </p>
            <p>
              "The City Makoti" started as a platform name, not a character. It's her real life.
              Her brand is built on being a white woman in an interracial, intercultural marriage,
              blending her <span className="text-burgundy">Afrikaans</span> background with the{" "}
              <span className="text-burgundy">Xhosa</span> culture she married into. The result is
              honest, funny content about marriage, motherhood, culture-blending and modern
              womanhood.
            </p>
            <p>
              Alongside her husband and co-star Sihle Dambuza, she stars in{" "}
              <span className="italic">The Real City Makoti</span> on Mzansi Wethu, taking a growing
              online community into living rooms across South Africa.
            </p>
          </div>

          <aside className="reveal border-l border-ink/15 pl-8 lg:pl-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">The point of view</span>
            <p className="mt-8 font-serif text-[2.6rem] font-light leading-[1.02] text-ink sm:text-5xl">
              Content is where it started. <span className="italic text-emerald">Not where it stops.</span>
            </p>
            <div className="mt-8 h-px w-12 bg-gold" aria-hidden="true" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink/60">
              Afrikaans roots. Xhosa family. One honest voice for modern South Africa.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="relative overflow-hidden bg-burgundy py-24 text-parchment">
      <div className="paper-texture absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="font-serif text-7xl leading-none text-gold">"</span>
        <blockquote className="reveal -mt-6 font-serif text-4xl font-light italic leading-snug md:text-[2.6rem]">
          Success does not make them less feminine, less respectful, or less deserving of love.
        </blockquote>
        <p className="reveal mt-8 text-sm uppercase tracking-[0.25em] text-blush">
          Anika Dambuza · on the viral "breadwinner" conversation
        </p>
      </div>
    </section>
  );
}

function Show() {
  return (
    <section id="show" className="bg-ink py-24 text-parchment">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div className="reveal">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                Reality TV
              </span>
            </div>
            <h2 className="font-serif text-4xl font-medium leading-tight md:text-5xl">
              The Real City Makoti
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-parchment/75">
              An unscripted look at love, race, family and being the breadwinner. Anika stars
              alongside her husband and co-star Sihle Dambuza, bringing their real life to a
              national audience.
            </p>
            <div className="mt-8 border-t border-parchment/20 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Mzansi Wethu <span className="mx-3 text-parchment/35">/</span> DStv Channel 163 <span className="mx-3 text-parchment/35">/</span> With Sihle Dambuza
            </div>
          </div>

          <div className="reveal border-l border-gold/40 pl-8 lg:pl-12">
            <span className="font-serif text-[8rem] font-light leading-[0.7] tracking-tight text-gold sm:text-[11rem] lg:text-[13rem]">163</span>
            <p className="mt-7 font-serif text-3xl font-light italic leading-tight text-parchment/90 sm:text-4xl">
              From the feed to the living room.
            </p>
            <span className="mt-5 block text-xs uppercase tracking-[0.25em] text-parchment/45">The story continues on screen</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const [activeWork, setActiveWork] = useState<number | null>(null);
  return (
    <section id="work" className="bg-parchment py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead kicker="Selected Work" title="Campaigns & collaborations." accent="gold" />
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {selectedWork.map((w, i) => (
            <div
              key={w.title}
              className={`work-item reveal ${activeWork === i ? "is-active" : ""}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <button
                type="button"
                className="work-trigger group grid w-full grid-cols-[2rem_1fr_1.5rem] items-center gap-3 py-7 text-left md:grid-cols-[3.5rem_1fr_auto_2rem] md:gap-8"
                aria-expanded={activeWork === i}
                aria-controls={`work-detail-${i}`}
                onClick={() => setActiveWork(activeWork === i ? null : i)}
              >
                <span className="font-serif text-base text-ink/40">0{i + 1}</span>
                <span className="font-serif text-[1.85rem] font-medium leading-tight text-ink transition-colors duration-300 group-hover:text-emerald group-focus-visible:text-emerald md:text-[2.5rem]">
                  {w.title}
                </span>
                <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-emerald md:block">
                  {w.type}
                </span>
                <svg className="work-chevron h-5 w-5 text-ink/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </button>
              <div id={`work-detail-${i}`} className={`work-detail ${activeWork === i ? "is-open" : ""}`} aria-hidden={activeWork !== i}>
                <div className="work-detail-inner">
                  <p className="pb-8 pl-11 text-base leading-relaxed text-ink/65 md:pl-[5.5rem]">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-emerald md:hidden">{w.type}</span>
                    {w.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [openService, setOpenService] = useState<number | null>(0);
  return (
    <section id="services" className="bg-white/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead kicker="Services" title="How we work with brands." />
        <div className="grid gap-x-16 md:grid-cols-2">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`service-item reveal border-t border-ink/20 ${openService === i ? "is-open" : ""}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <button
                type="button"
                className="service-trigger flex w-full items-center justify-between gap-6 py-7 text-left"
                aria-expanded={openService === i}
                aria-controls={`service-detail-${i}`}
                onClick={() => setOpenService(openService === i ? null : i)}
              >
                <span className="font-serif text-[1.65rem] font-medium leading-none text-ink transition-colors duration-300 md:text-[1.85rem]">{s.title}</span>
                <span className="service-plus relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald/35 text-emerald" aria-hidden="true">
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="service-plus-vertical absolute h-3 w-px bg-current" />
                </span>
              </button>
              <div id={`service-detail-${i}`} className={`service-detail ${openService === i ? "is-open" : ""}`} aria-hidden={openService !== i}>
                <div className="service-detail-inner">
                  <p className="max-w-md pb-7 pr-10 text-sm leading-relaxed text-ink/65">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsNext() {
  return (
    <section id="next" className="relative overflow-hidden bg-emerald py-24 text-parchment">
      <div className="paper-texture absolute inset-0 opacity-15" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="reveal mb-12 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              What's Next
            </span>
          </div>
          <h2 className="font-serif text-4xl font-medium leading-tight md:text-5xl">
            Where CITYMAKOTI is headed.
          </h2>
        </div>
        <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {whatsNext.map((n, i) => (
            <div
              key={n.title}
              className="next-item reveal border-t border-parchment/30 py-8"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <h3 className="font-serif text-[1.7rem] font-medium leading-none text-gold">{n.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-parchment/75">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Press() {
  return (
    <section id="press" className="bg-parchment py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead kicker="In the Press" title="National coverage." accent="burgundy" />
        <p className="reveal -mt-6 mb-10 max-w-2xl text-ink/60">
          Much of this coverage traces back to a single viral TikTok on being the breadwinner in
          her marriage. It sparked a national conversation across South African media.
        </p>
        <div className="divide-y divide-ink/10 border-t border-ink/10">
          {press.map((p, i) => (
            <div
              key={i}
              className="reveal group flex flex-col gap-1 py-5 md:flex-row md:items-center md:gap-6"
            >
              <span className="w-40 shrink-0 text-xs font-bold uppercase tracking-widest text-burgundy">
                {p.outlet}
              </span>
              <p className="font-serif text-lg leading-snug text-ink transition-colors group-hover:text-emerald md:text-xl">
                {p.headline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 text-parchment">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-burgundy/20 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="font-serif text-xl italic text-blush">"{profile.tagline}"</p>
        <h2 className="mt-4 font-serif text-5xl font-medium leading-[1.05] md:text-7xl">
          Let's build something
          <br />
          <span className="text-gold italic font-light">worth talking about.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-parchment/70">
          For brand partnerships, national campaigns, speaking and press, let's start a conversation.
        </p>

        <div className="mt-10 border-y border-parchment/20 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Brand & partnership enquiries / Press & media</p>
          <a href={`mailto:${profile.email}`} className="contact-email mt-3 inline-block break-words font-serif text-3xl font-light text-parchment sm:text-5xl">
            {profile.email}
          </a>
        </div>

        <p className="mt-8 text-sm text-parchment/50">{profile.company}</p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <DownloadButton />
          <div className="flex flex-wrap justify-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-parchment/20 px-5 py-2.5 text-sm font-medium text-parchment/80 transition-all hover:border-blush hover:text-blush"
              >
                {s.label} <span className="text-parchment/40">·</span> {s.handle}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-20 max-w-7xl border-t border-parchment/10 px-6 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-parchment/40 sm:flex-row">
          <span className="font-serif text-base text-parchment/70">
            CITY<span className="text-gold">MAKOTI</span> (Pty) Ltd
          </span>
          <span>© {new Date().getFullYear()} Anika Dambuza · The City Makoti · South Africa</span>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useReveal();
  return (
    <div className="min-h-screen bg-parchment">
      <Nav />
      <Hero />
      <Stats />
      <Marquee />
      <About />
      <Quote />
      <Show />
      <Work />
      <Services />
      <WhatsNext />
      <Press />
      <Contact />
    </div>
  );
}
