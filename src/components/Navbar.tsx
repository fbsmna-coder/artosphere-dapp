'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ConnectButton } from './ConnectButton';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/discoveries', label: 'Discoveries' },
  { href: '/stake', label: 'Stake' },
  { href: '/swap', label: 'Swap' },
  { href: '/spectral', label: 'Spectral' },
  { href: '/review', label: 'Review' },
  { href: '/falsify', label: 'Falsify' },
  { href: '/quests', label: 'Quests' },
  { href: '/govern', label: 'Govern' },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-amber-500/10
      bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.jpeg"
              alt="Artosphere"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg shadow-lg shadow-amber-500/20
                group-hover:shadow-amber-500/40 transition-shadow duration-300"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-300
              bg-clip-text text-transparent hidden sm:block">
              Artosphere
            </span>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive =
                href === '/' ? pathname === '/' : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Wallet */}
          <ConnectButton />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-white/5 px-2 py-2
        flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap
                transition-all duration-200
                ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-white/50 hover:text-white/80'
                }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
