"use client";

import { useState } from "react";
import { Send, CheckCircle2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

/* ─────────────────────────────────────────────── */

type FormData = {
  name: string;
  company: string;
  phone: string;
  email: string;
  buildingArea: string;
  buildingAddress: string;
  message: string;
};

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: {
          address: string;
          addressType: string;
          bname: string;
          buildingName: string;
        }) => void;
      }) => { open: () => void };
    };
  }
}

/* 연면적 → 의무 구간 자동 판별 */
function getAreaInfo(raw: string) {
  const num = parseInt(raw.replace(/,/g, ""), 10);
  if (!num || isNaN(num)) return null;
  if (num >= 30000) return { range: "연면적 3만㎡ 이상",   deadline: "2025.7.18 시행 중", color: "var(--color-success)", urgent: false };
  if (num >= 10000) return { range: "연면적 1만~3만㎡",    deadline: "2026.7.18 마감",    color: "#E85C0D",              urgent: true  };
  if (num >=  5000) return { range: "연면적 5천~1만㎡",    deadline: "2027.7.18",         color: "var(--color-accent)",  urgent: false };
  return               { range: "연면적 5천㎡ 미만",    deadline: "대상 여부 확인 필요", color: "var(--color-gray-600)", urgent: false };
}

const WEB3FORMS_KEY   = "08ac26e2-da08-4bbd-8871-ca08b59572f0";
const RATE_LIMIT_KEY  = "last_submit_time";
const RATE_LIMIT_MS   = 60_000; // 1분

/* ─────────────────────────────────────────────── */

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [form,      setForm]      = useState<FormData>({
    name: "", company: "", phone: "", email: "",
    buildingArea: "", buildingAddress: "", message: "",
  });

  /* 카카오 주소 검색 */
  const handleAddressSearch = () => {
    if (typeof window !== "undefined" && window.daum) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          let fullAddress = data.address;
          let extra = "";
          if (data.addressType === "R") {
            if (data.bname)        extra += data.bname;
            if (data.buildingName) extra += extra ? `, ${data.buildingName}` : data.buildingName;
            fullAddress += extra ? ` (${extra})` : "";
          }
          setForm((prev) => ({ ...prev, buildingAddress: fullAddress }));
        },
      }).open();
    } else {
      alert("주소 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  /* 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /* 클라이언트 사이드 Rate Limiting */
      const now = Date.now();
      const last = localStorage.getItem(RATE_LIMIT_KEY);
      if (last && now - parseInt(last) < RATE_LIMIT_MS) {
        const sec = Math.ceil((RATE_LIMIT_MS - (now - parseInt(last))) / 1000);
        setError(`${sec}초 후에 다시 시도해주세요. (전송 제한 1분)`);
        setLoading(false);
        return;
      }

      const areaLabel = form.buildingArea
        ? `${form.buildingArea}㎡ (${getAreaInfo(form.buildingArea)?.range ?? "확인 필요"})`
        : "미입력";

      const payload = {
        subject:        `[상담신청] ${form.company} — 정보통신설비 성능점검`,
        from_name:      "제이앤지시스템 홈페이지",
        "신청유형":     "상담신청",
        name:           form.name,
        "회사·건물명":  form.company,
        "연락처":       form.phone,
        email:          form.email,
        "건물 소재지":  form.buildingAddress || "미입력",
        "건물 연면적":  areaLabel,
        "문의 내용":    form.message || "없음",
      };

      /* 1. Supabase CRM 저장 (환경변수 미설정 시 건너뜀) */
      if (supabase) {
        try {
          await supabase.from("inquiries").insert([{
            name:         form.name,
            phone:        form.phone,
            company:      form.company,
            inquiry_type: "상담신청",
            details:      JSON.stringify(payload),
            status:       "신규 문의",
          }]);
        } catch {
          /* Supabase 실패해도 이메일 발송은 계속 진행 */
        }
      }

      /* 2. Web3Forms 이메일 발송 */
      const res  = await fetch("https://api.web3forms.com/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
        setSubmitted(true);
      } else {
        setError("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  /* 완료 화면 */
  if (submitted) {
    return (
      <div className="text-center py-10">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--color-accent-light)" }}
        >
          <CheckCircle2 size={32} style={{ color: "var(--color-accent)" }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>
          상담 신청이 완료되었습니다
        </h3>
        <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
          영업일 기준 1일 이내에 담당자가 연락드립니다.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg " +
    "focus:outline-none focus:ring-2 focus:border-transparent bg-white";
  const focusStyle = { "--tw-ring-color": "var(--color-accent)" } as React.CSSProperties;
  const labelClass = "block text-sm font-semibold mb-1.5";

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* 담당자명 + 건물명 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: "var(--color-primary)" }}>
              담당자명 <span style={{ color: "var(--color-warning)" }}>*</span>
            </label>
            <input
              type="text" required placeholder="홍길동"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass} style={focusStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--color-primary)" }}>
              건물명 <span style={{ color: "var(--color-warning)" }}>*</span>
            </label>
            <input
              type="text" required placeholder="○○빌딩"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inputClass} style={focusStyle}
            />
          </div>
        </div>

        {/* 연락처 + 이메일 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: "var(--color-primary)" }}>
              연락처 <span style={{ color: "var(--color-warning)" }}>*</span>
            </label>
            <input
              type="tel" required placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`${inputClass} font-inter`} style={focusStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--color-primary)" }}>이메일</label>
            <input
              type="email" placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`${inputClass} font-inter`} style={focusStyle}
            />
          </div>
        </div>

        {/* 건물 소재지 */}
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            건물 소재지 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text" required placeholder="주소 찾기 버튼을 눌러주세요"
              value={form.buildingAddress}
              onChange={(e) => setForm({ ...form, buildingAddress: e.target.value })}
              className={inputClass} style={focusStyle}
            />
            <button
              type="button" onClick={handleAddressSearch}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg border transition-all"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", background: "white" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
            >
              <Search size={14} /> 주소 찾기
            </button>
          </div>
        </div>

        {/* 건물 연면적 */}
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            건물 연면적 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text" inputMode="numeric" required placeholder="예: 12,500"
              value={form.buildingArea}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, "");
                setForm({ ...form, buildingArea: digits ? parseInt(digits).toLocaleString("ko-KR") : "" });
              }}
              className={`${inputClass} pr-10`} style={focusStyle}
            />
            <span className="absolute right-3 text-sm font-semibold pointer-events-none" style={{ color: "var(--color-gray-600)" }}>
              ㎡
            </span>
          </div>
          {(() => {
            const info = getAreaInfo(form.buildingArea);
            if (!info) return (
              <p className="mt-1.5 text-xs" style={{ color: "var(--color-gray-600)" }}>
                실제 연면적을 숫자로 입력하시면 의무 기한을 즉시 확인할 수 있습니다.
              </p>
            );
            return (
              <div
                className="mt-1.5 flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: `color-mix(in srgb, ${info.color} 10%, white)`, borderLeft: `3px solid ${info.color}` }}
              >
                <span className="font-semibold" style={{ color: info.color }}>→ {info.range}</span>
                <span className="font-bold" style={{ color: info.urgent ? "#E85C0D" : info.color }}>
                  의무 기한: {info.deadline}
                </span>
              </div>
            );
          })()}
        </div>

        {/* 문의 내용 */}
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>문의 내용</label>
          <textarea
            rows={4} placeholder="문의하실 내용을 자유롭게 작성해주세요."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputClass} resize-none`} style={focusStyle}
          />
        </div>

        <p className="text-xs" style={{ color: "var(--color-gray-600)" }}>
          제출하신 정보는 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다.
        </p>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "var(--color-accent)" }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-primary-mid)"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-accent)"; }}
        >
          <Send size={16} />
          {loading ? "전송 중..." : "상담 신청하기"}
        </button>
      </form>
    </>
  );
}
