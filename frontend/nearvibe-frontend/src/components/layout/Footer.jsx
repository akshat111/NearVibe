// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-gradient-to-r from-slate-950/50 to-slate-900/50 backdrop-blur-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              NearVibe
            </p>
            <p className="text-sm text-slate-400">Find your vibe, near you</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="/events" className="hover:text-slate-200 transition">
                  Explore Events
                </a>
              </li>
              <li>
                <a href="/buddy" className="hover:text-slate-200 transition">
                  Buddy Connect
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-200 transition">
                  For Organisers
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-slate-200 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-200 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-200 transition">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-slate-200 transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-200 transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-200 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <span>
            © {new Date().getFullYear()} NearVibe. All rights reserved.
          </span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300 transition">
              Twitter
            </a>
            <a href="#" className="hover:text-slate-300 transition">
              Instagram
            </a>
            <a href="#" className="hover:text-slate-300 transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
