import { Flower, Flower2, Sprout, Heart, Sparkles, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-garden-700 via-garden-500 to-lavender-600 flex flex-col">
      {/* Animated blurred color blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-sunshine-400 opacity-30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-petal-400 opacity-30 blur-3xl animate-pulse [animation-duration:5s]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-garden-300 opacity-20 blur-3xl animate-pulse [animation-duration:7s]" />

      {/* Floating decorative icons */}
      <Flower className="pointer-events-none absolute top-16 right-[8%] w-14 h-14 text-white/25 rotate-12 animate-pulse [animation-duration:4s]" />
      <Flower2 className="pointer-events-none absolute bottom-40 left-[6%] w-20 h-20 text-white/20 -rotate-12" />
      <Sprout className="pointer-events-none absolute top-1/3 left-[8%] w-10 h-10 text-white/30 animate-pulse [animation-duration:6s]" />
      <Leaf className="pointer-events-none absolute bottom-1/3 right-[10%] w-12 h-12 text-white/25 rotate-45" />
      <Sparkles className="pointer-events-none absolute top-[18%] left-[18%] w-7 h-7 text-sunshine-200/70 animate-pulse" />
      <Sparkles className="pointer-events-none absolute bottom-[22%] right-[22%] w-6 h-6 text-petal-200/70 animate-pulse [animation-duration:3s]" />
      <Flower className="pointer-events-none absolute top-[55%] right-[6%] w-9 h-9 text-white/25" />

      {/* Hero content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16 md:py-20">
        <div className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-white/95 text-sm md:text-base font-medium mb-8 shadow-lg">
            <span className="w-2 h-2 bg-sunshine-300 rounded-full animate-pulse" />
            The 2026 Flower Sale Is Complete
          </div>

          <h1 className="font-display font-bold text-white leading-[0.95] drop-shadow-2xl mb-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Thank You,
            <br />
            Mt. Lebanon!
          </h1>

          <p className="text-white text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-6 drop-shadow">
            Your generosity made this year&apos;s flower sale a{" "}
            <span className="font-semibold text-sunshine-200">
              blooming success.
            </span>
          </p>

          <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-6">
            Every purchase stays right here in Mt Lebanon — supporting the local nonprofits
            that make our community so special. A heartfelt thank-you to{" "}
            <span className="font-semibold text-sunshine-200">Dean&apos;s Greenhouse</span>{" "}
            for growing something beautiful with us.
          </p>

          <p className="text-white/85 text-lg md:text-xl italic font-light max-w-3xl mx-auto">
            Keep an eye out — we&apos;ll see you again later this year for our next community fundraiser.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-12 text-white/60">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/60" />
            <Flower2 className="w-5 h-5" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/60" />
          </div>
        </div>
      </main>

      {/* Bottom credit strip */}
      <footer className="relative z-10 text-center text-white/70 text-sm pb-6 pt-4 space-y-1">
        <p className="flex items-center justify-center gap-1.5">
          Made with <Heart className="w-4 h-4 text-petal-300 fill-petal-300" /> by Craig Grella
        </p>
        <p>&copy; {new Date().getFullYear()} Mt. Lebanon Flower Sale</p>
      </footer>
    </div>
  );
}
