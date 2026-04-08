"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Copy, Check } from "lucide-react";

const contacts = [
  { icon: Phone, label: "전화", value: "02-3444-3570", href: "tel:02-3444-3570" },
  { icon: Mail, label: "이메일", value: "sales@jngsystem.co.kr", href: "mailto:sales@jngsystem.co.kr" },
  { icon: MapPin, label: "주소", value: "서울 성동구 아차산로 103 2101호 (영동테크노타워)", href: null },
];

export default function FooterContact() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleCopy(value: string, index: number) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  }

  return (
    <ul className="space-y-3 text-sm text-white/70">
      {contacts.map(({ icon: Icon, label, value, href }, index) => (
        <li key={label} className="flex items-start gap-2">
          <Icon size={14} className="mt-0.5 shrink-0" />
          <span className="flex-1">
            {href ? (
              <a href={href} className="hover:text-white transition-colors">{value}</a>
            ) : (
              value
            )}
          </span>
          <button
            onClick={() => handleCopy(value, index)}
            className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
            aria-label={`${label} 복사`}
            title={`${label} 복사`}
          >
            {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </li>
      ))}
    </ul>
  );
}
