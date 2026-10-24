'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from '../ui/BrandLogo';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Building2,
  Home,
  Calculator,
  Compass,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  User,
  LogOut,
  LayoutDashboard,
  Info,
} from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/formatters';

interface HeaderProps {
  whatsappNumber?: string;
  phoneNumber?: string;
}

export default function Header({
  whatsappNumber = '254100382352',
  phoneNumber = '+254100382352',
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { label: 'Rental Apartments', href: '/#rental-listings', icon: Home, priority: true },
    { label: 'Airbnb Takeovers', href: '/properties', icon: Building2, priority: true },
    { label: 'Locations', href: '/locations', icon: Compass, priority: true },
    { label: 'Calculator', href: '/calculator', icon: Calculator, priority: true },
    { label: 'Why Invest', href: '/why-invest', icon: TrendingUp, priority: false },
    { label: 'About Us', href: '/about', icon: Info, priority: false },
    { label: 'Contact', href: '/contact', icon: Phone, priority: true },
  ];

  const whatsappLink = buildWhatsAppUrl(
    whatsappNumber,
    'Hello Rentals Kenya, I am inquiring about rental apartments and houses on Rentals.ke.'
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-navy/95 backdrop-blur-md shadow-xl border-b border-brand-muted/30 py-3'
          : 'bg-brand-navy border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandLogo variant="light" size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
                    !item.priority ? 'hidden xl:inline-block' : 'inline-block'
                  } ${
                    isActive
                      ? 'text-sky-400 bg-brand-royal/50'
                      : 'text-slate-200 hover:text-white hover:bg-brand-royal/30'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* WhatsApp Quick Link */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 transition-all shadow-sm"
              title="Chat directly on WhatsApp"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-white/15 pl-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-white/15 pl-3">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20 active:scale-[0.98]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 rounded-lg"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-brand-royal/60 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-navy border-b border-brand-muted/40 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-brand-royal text-sky-300 font-semibold'
                      : 'text-slate-200 hover:bg-brand-royal/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-sky-400" />}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-brand-muted/40 space-y-2">
            {currentUser ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-sky-500 text-slate-950 font-bold text-sm shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard ({currentUser.name})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-rose-500/30 text-rose-400 font-semibold text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-white/20 text-white font-bold text-xs"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center py-2.5 px-4 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs"
                >
                  Register
                </Link>
              </div>
            )}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp (+254100382352)
            </a>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-400 px-1">
              <span>Support: {phoneNumber}</span>
              <Link href="/admin/login" className="text-sky-400 hover:underline">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
