import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";
export const alt = "제이앤지시스템 | 정보통신설비 성능점검·유지보수관리 전문";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const [fontData, logoBuffer] = await Promise.all([
    Promise.resolve(
      readFileSync(join(process.cwd(), "public", "fonts", "Pretendard-Bold.ttf"))
    ),
    Promise.resolve(
      readFileSync(join(process.cwd(), "public", "JNGSYSTEM_2Line_Logo.png"))
    ),
  ]);

  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "linear-gradient(135deg, #0D2B5E 0%, #1A4A8A 100%)",
          padding: "52px 72px",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Pretendard",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 장식 원 — 우측 상단 */}
        <div
          style={{
            position: "absolute", right: -110, top: -110,
            width: 520, height: 520, borderRadius: "50%",
            background: "rgba(0,112,243,0.13)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute", right: 10, top: 10,
            width: 340, height: 340, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute", right: 80, top: 80,
            width: 190, height: 190, borderRadius: "50%",
            border: "1px solid rgba(0,112,243,0.20)",
            display: "flex",
          }}
        />

        {/* 상단: 로고 + 구분선 + 서브 태그 */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={160}
            height={48}
            alt="JNGSYSTEM"
            style={{ objectFit: "contain", objectPosition: "left center" }}
          />
          <div
            style={{
              width: 1, height: 30,
              background: "rgba(255,255,255,0.20)",
              display: "flex",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, letterSpacing: "0.08em" }}>
            정보통신설비 전문 기업
          </span>
        </div>

        {/* 중앙: 핵심 메시지 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            paddingTop: 8,
          }}
        >
          {/* 뱃지 */}
          <div style={{ display: "flex", marginBottom: 28 }}>
            <div
              style={{
                background: "rgba(0,112,243,0.22)",
                border: "1px solid rgba(96,176,255,0.50)",
                borderRadius: 100,
                padding: "8px 20px",
                display: "flex",
              }}
            >
              <span style={{ color: "#60B0FF", fontSize: 15, fontWeight: 700 }}>
                과기정통부 등록 정보통신공사업자
              </span>
            </div>
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#FFFFFF",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.18,
              marginBottom: 32,
            }}
          >
            <span>정보통신설비</span>
            <span>성능점검·유지보수관리</span>
          </div>

          {/* 서브 태그 3개 */}
          <div style={{ display: "flex", gap: 10 }}>
            {["법정 점검", "유지보수관리 위탁", "선임 기준 안내"].map(
              (label, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    background: "rgba(255,255,255,0.09)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8,
                    padding: "7px 18px",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 18 }}>
                    {label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* 하단 바 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.11)",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 3, height: 18,
                background: "#0070F3",
                borderRadius: 2,
                display: "flex",
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 16 }}>
              제이앤지시스템 | 22년 IT 인프라 운영 경험
            </span>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.30)",
              fontSize: 14,
              letterSpacing: "0.06em",
            }}
          >
            jngsystem.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: fontData, weight: 700, style: "normal" },
      ],
    }
  );
}
