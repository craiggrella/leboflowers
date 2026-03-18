import { Heart, Flower2 } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-garden-800 text-garden-100 mt-16">
      <div className="container py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flower2 className="w-6 h-6 text-petal-400" />
              <span className="font-display text-lg font-bold text-white">
                Mt. Lebanon Flower Sale
              </span>
            </div>
            <p className="text-garden-200 text-sm leading-relaxed">
              A community fundraiser supporting our local church and swimming club.
              All flowers provided by Dean&apos;s Greenhouse.
            </p>
          </div>

          <div>
            <h3 className="font-display text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Shop All</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">View Cart</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-white font-semibold mb-3">About This Sale</h3>
            <p className="text-garden-200 text-sm leading-relaxed">
              Proceeds stay in and support Mt Lebanon community organizations.
              Thank you for helping us grow something beautiful together!
            </p>
          </div>
        </div>

        <div className="border-t border-garden-700 mt-8 pt-6 text-center text-sm text-garden-300">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> by our community
          </p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Mt. Lebanon Flower Sale</p>
        </div>
      </div>
    </footer>
  );
}
