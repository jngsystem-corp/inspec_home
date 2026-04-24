import Link from "next/link";
import { Home, Phone, ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function NotFound() {
  return (
    <PageLayout>
      <section
        className="min-h-[60vh] flex items-center"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="container-main py-20 text-center">
          {/* 404 숫자 */}
          <div
            className="text-8xl sm:text-9xl font-black font-inter mb-4 leading-none"
            style={{ color: "var(--color-accent-light)" }}
          >
            404
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-sm sm:text-base mb-10 max-w-md mx-auto leading-relaxed" style={{ color: "var(--color-gray-600)" }}>
            요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
            아래 링크를 통해 원하시는 정보를 찾아보세요.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
            >
              <Home size={16} /> 홈으로 돌아가기
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 font-bold rounded-xl hover:bg-white transition-colors"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              <Phone size={16} /> 무료 상담 신청
            </Link>
          </div>

          {/* 바로가기 링크 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-sm">
            {[
              { href: "/service",   label: "서비스 소개" },
              { href: "/target",    label: "대상건축물 확인" },
              { href: "/process",   label: "점검 절차" },
              { href: "/law",       label: "법령 안내" },
              { href: "/faq",       label: "자주 묻는 질문" },
              { href: "/equipment", label: "점검 대상 설비" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white rounded-xl border font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                style={{ borderColor: "var(--color-border)", color: "var(--color-primary)" }}
              >
                {label} <ArrowRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
