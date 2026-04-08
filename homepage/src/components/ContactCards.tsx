"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Copy, Check } from "lucide-react";

const items = [
  { icon: Phone, label: "전화", value: "02-3444-3570", href: "tel:02-3444-3570", copyable: true },
  { icon: Mail, label: "이메일", value: "sales@jngsystem.co.kr", href: "mailto:sales@jngsystem.co.kr", copyable: true },
  { icon: MapPin, label: "주소", value: "서울 성동구 아차산로 103 2101호 (영동테크노타워)", href: null, copyable: true },
  { icon: Clock, label: "운영시간", value: "평일 09:00 ~ 18:00", href: null, copyable: false },
];

export default function ContactCards() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleCopy(value: string, index: number) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  }

  return (
    <div className="space-y-4">
      {items.map(({ icon: Icon, label, value, href, copyable }, index) => (
        <div key={label} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[var(--color-border)] card-shadow">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--color-accent-light)" }}>
            <Icon size={16} style={{ color: "var(--color-accent)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-gray-600)" }}>{label}</p>
            {href ? (
              <a href={href} className="text-sm font-semibold font-inter hover:underline" style={{ color: "var(--color-primary)" }}>{value}</a>
            ) : (
              <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{value}</p>
            )}
          </div>
          {copyable && (
            <button
              onClick={() => handleCopy(value, index)}
              className="shrink-0 mt-1 text-gray-300 hover:text-gray-500 transition-colors"
              aria-label={`${label} 복사`}
              title={`${label} 복사`}
            >
              {copiedIndex === index ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
