import { useState, useEffect, useRef } from "react";
import { Upload, ArrowRight, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const actionCardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isSticky
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        <div className="bg-hero-dark/90 backdrop-blur-2xl border-b border-hero-border shadow-lg">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <span className="hidden sm:block font-bold text-lg text-hero-primary transition-transform duration-300 hover:scale-105">
                Clipperzz
              </span>

              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste a video link..."
                className="flex-1 h-11 px-4 rounded-xl bg-hero-surface/60 border border-hero-border text-hero-primary placeholder:text-hero-secondary/40 focus:outline-none focus:border-hero-accent/50 focus:ring-2 focus:ring-hero-accent/20 transition-all duration-300"
              />

              {/* Generate Button */}
              <button className="group h-11 px-5 rounded-xl bg-hero-accent text-hero-dark font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-[0_8px_30px_-8px_hsl(var(--hero-accent)/0.5)] hover:scale-[1.02] active:scale-[0.98]">
                <Zap className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className="hidden sm:inline">Generate</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Upload Button */}
              <button className="group h-11 px-4 rounded-xl bg-hero-surface/80 border border-hero-border text-hero-primary font-medium flex items-center gap-2 transition-all duration-300 hover:border-hero-copper/60 hover:shadow-[0_8px_25px_-8px_hsl(var(--hero-copper)/0.4)] hover:scale-[1.02] active:scale-[0.98]">
                <Upload className="w-4 h-4 text-hero-copper transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                <span className="hidden lg:inline">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Hero */}
      <section className="relative min-h-screen pt-32 pb-24 bg-hero-gradient">
        <div className="container mx-auto px-6">

          {/* Badge */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-hero-surface/40 border border-hero-border">
              <Sparkles className="w-4 h-4 text-hero-accent" />
              <span className="text-sm text-hero-secondary/70">
                Intelligent clip extraction
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hero-primary leading-tight">
              Clip what matters from your long videos{" "}
              <span className="text-hero-copper">Automatically.</span>
            </h1>

            <p className="mt-6 text-base text-hero-secondary/70 max-w-2xl mx-auto leading-relaxed">
              Drop in a video link or upload a file.<br />
              Clipperzz analyzes your content and extracts moments worth sharing.
            </p>
          </div>

          {/* Action Card */}
          <div ref={actionCardRef} className="max-w-2xl mx-auto mt-12">
            <div
              className={`rounded-2xl p-6 bg-hero-surface/60 border border-hero-border backdrop-blur-xl transition ${isFocused ? "border-hero-accent/50 shadow-lg" : ""
                }`}
            >
              <label className="text-sm text-hero-secondary/70">
                Video source
              </label>

              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Paste a video link (YouTube, podcast, MP4)"
                className="mt-2 w-full h-12 px-5 rounded-xl bg-hero-dark/50 border border-hero-border text-hero-primary placeholder:text-hero-secondary/40 focus:outline-none text-sm"
              />

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                {/* Generate Button */}
                <button
                  className="
                    group flex-1 h-14 rounded-xl
                    bg-hero-accent text-hero-dark font-semibold
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    hover:shadow-lg
                    active:scale-[0.97]
                  "
                >
                  Generate Clips
                  <ArrowRight
                    className="
                      w-5 h-5 transition-transform duration-200
                      group-hover:translate-x-1
                      group-active:translate-x-2
                    "
                  />
                </button>

                {/* Upload Button */}
                <button
                  className="
                    group h-14 px-6 rounded-xl
                    bg-hero-surface border border-hero-border
                    flex items-center justify-center gap-2
                    text-hero-primary
                    transition-all duration-200 ease-out
                    hover:border-hero-copper/60
                    hover:-translate-y-[1px]
                    hover:shadow-[0_8px_30px_-12px_hsl(var(--hero-copper)/0.35)]
                    active:translate-y-0
                  "
                >
                  <Upload
                    className="
                      w-5 h-5 text-hero-copper
                      transition-all duration-200
                      group-hover:-translate-y-0.5
                      group-hover:scale-105
                    "
                  />
                  <span className="font-medium">Upload Video</span>
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-hero-secondary/50">
                Supports YouTube, Vimeo, TikTok, and direct file uploads up to 2GB
              </p>
            </div>
          </div>

          {/* Trusted By */}
          <div className="mt-20 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-hero-secondary/60">
              Trusted by creators worldwide
            </p>

            <div className="mt-6 flex justify-center gap-10">
              <span className="text-xs text-hero-secondary/70 font-medium">
                YouTubers
              </span>
              <span className="text-xs text-hero-secondary/70 font-medium">
                Podcasters
              </span>
              <span className="text-xs text-hero-secondary/70 font-medium">
                Agencies
              </span>
              <span className="text-xs text-hero-secondary/70 font-medium">
                Editors
              </span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HeroSection;
