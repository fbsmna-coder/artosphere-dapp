'use client';

import { type ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  suffix?: string;
  className?: string;
}

export function StatCard({ label, value, icon, suffix, className = '' }: StatCardProps) {
  return (
    <div
      className={`relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm
        border border-amber-500/20 hover:border-amber-500/40
        transition-all duration-300 group ${className}`}
    >
      {/* Golden corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-2xl">
        <div className="absolute -top-6 -right-6 w-12 h-12 rotate-45
          bg-gradient-to-br from-amber-500/20 to-transparent" />
      </div>

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-white/40 font-medium">
          {label}
        </span>
        {icon && (
          <span className="text-amber-500/60 group-hover:text-amber-400
            transition-colors duration-300">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-white tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-amber-400/70 font-medium">
            {suffix}
          </span>
        )}
      </div>

      {/* Bottom golden line */}
      <div className="absolute bottom-0 left-4 right-4 h-px
        bg-gradient-to-r from-transparent via-amber-500/30 to-transparent
        group-hover:via-amber-500/50 transition-all duration-300" />
    </div>
  );
}
