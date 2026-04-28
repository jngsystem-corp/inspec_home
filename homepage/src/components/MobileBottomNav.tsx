"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Building2, Cpu, ClipboardList, MessageCircle } from "lucide-react";

const bottomNavItems = [
  { href: "/service",   label: "서비스",    icon: Wrench },
  { href: "/target",    label: "대상건축물", icon: Building2 },
  { href: "/equipment", label: "점검설비",   icon: Cpu },
  { href: "/process",   label: "점검절차",   icon: ClipboardList },
  { href: "/contact",   label: "상담",      icon: MessageCircle },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-border)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="하단 바로가기 메뉴"
    >
      <div className="flex items-stretch">
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const isContact = href === "/contact";

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                isContact
                  ? "bg-[var(--color-accent)] text-white"
                  : isActive
                  ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
                  : "text-[var(--color-gray-600)] hover:text-[var(--color-primary)]"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
