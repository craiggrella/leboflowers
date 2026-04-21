import Link from "next/link";
import { Flower2 } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-garden-100 shadow-sm">
      <div className="container flex items-center h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <Flower2 className="w-8 h-8 text-rose-500 group-hover:text-rose-600 transition-colors" />
          <div className="leading-tight">
            <span className="font-display text-xl font-bold text-garden-800 block">
              Mt. Lebanon
            </span>
            <span className="text-xs text-earth-700 tracking-wide uppercase">
              Flower Sale
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
