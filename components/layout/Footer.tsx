import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-400 border-t border-white/5 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/5">
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <span className="flex items-center gap-2.5 font-bold text-white text-base tracking-tight select-none">
              <Image src="/images/logo.png" alt="UniVerdict Logo" width={32} height={32} className="flex-shrink-0" />
              <span>Uni<span className="text-brand-gold">Verdict</span></span>
            </span>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Honest student reviews, real placement analytics, and zero sponsored noise. Helping you navigate to your ideal future.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-white transition-colors">Colleges Directory</Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">Compare Engine</Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">Saved Shortlists</Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-white transition-colors">Sign In / Account</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional / Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Info &amp; Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 UniVerdict. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for students, by students with <Heart className="h-3.5 w-3.5 text-brand-gold fill-brand-gold" />
          </p>
        </div>
      </div>
    </footer>
  );
}
