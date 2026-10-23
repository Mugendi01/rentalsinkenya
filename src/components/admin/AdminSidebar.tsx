'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from '../ui/BrandLogo';
import {
  LayoutDashboard,
  Building2,
  Home,
  PlusCircle,
  Inbox,
  Calendar,
  Compass,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Users,
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Rental Listings', href: '/admin/rentals', icon: Home },
    { label: 'Airbnb Takeovers', href: '/admin/properties', icon: Building2 },
    { label: 'Add New Rental', href: '/admin/rentals/new', icon: PlusCircle },
    { label: 'Add New Takeover', href: '/admin/properties/new', icon: PlusCircle },
    { label: 'Enquiries / Leads CRM', href: '/admin/enquiries', icon: Inbox },
    { label: 'User Accounts', href: '/admin/users', icon: Users },
    { label: 'Viewing Appointments', href: '/admin/viewings', icon: Calendar },
    { label: 'Locations Manager', href: '/admin/locations', icon: Compass },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings },
    { label: 'Security Audit Logs', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-brand-navy border-b border-brand-royal/40 px-4 py-3 flex items-center justify-between z-30 sticky top-0">
        <BrandLogo variant="light" size="sm" href="/admin" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
          aria-label="Toggle admin sidebar"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-navy text-slate-300 border-r border-brand-royal/40 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Logo */}
        <div>
          <div className="p-5 border-b border-brand-royal/40">
            <BrandLogo variant="light" size="md" href="/admin" />
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Admin Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                      : 'text-slate-300 hover:bg-brand-royal/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile & Actions */}
        <div className="p-4 border-t border-brand-royal/40 space-y-3 bg-brand-darkest/40">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-sky-300 bg-brand-royal/30 hover:bg-brand-royal/60 border border-brand-royal/50 transition-colors"
          >
            <span className="font-semibold">View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-sky-600/30 border border-sky-400/30 flex items-center justify-center flex-shrink-0 text-sky-300">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}
