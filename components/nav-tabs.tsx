'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/films', label: 'Filmlar' },
  { href: '/serials', label: 'Seriallar' },
  { href: '/multfilms', label: 'Multfilmlar' },
  { href: '/favorites', label: 'Saralanganlar' }
];

export function NavTabs(){
  const path = usePathname();
  return (
    <nav className="relative flex gap-1 rounded-xl bg-card p-1">
      {tabs.map(t => {
        const active = path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={"relative rounded-lg px-3 py-1.5 text-sm " + (active ? "text-ink" : "text-mute")}>
            {active && (
              <motion.span layoutId="pill" className="absolute inset-0 rounded-lg bg-white/5" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
