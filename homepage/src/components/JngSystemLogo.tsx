interface JngSystemLogoProps {
  className?: string;
  height?: number;
  /** "dark" = 어두운 아이콘+텍스트 (밝은 배경용) | "white" = 흰색 텍스트 (어두운 배경용) */
  variant?: "dark" | "white";
}

const ICON_COLOR = "#2D1B5E"; // 로고 원본 다크 퍼플

export default function JngSystemLogo({
  className,
  height = 48,
  variant = "dark",
}: JngSystemLogoProps) {
  // viewBox: 280 x 80
  const vw = 280;
  const vh = 80;
  const width = Math.round(height * (vw / vh));

  const isDark = variant === "dark";

  // 아이콘 박스: dark=다크퍼플 채우기 / white=투명(테두리만)
  const boxFill   = isDark ? ICON_COLOR : "rgba(255,255,255,0.12)";
  const boxStroke = isDark ? "none"     : "rgba(255,255,255,0.6)";
  const jgColor   = isDark ? "#FFFFFF"  : "#FFFFFF";

  // 텍스트
  const textColor = isDark ? ICON_COLOR : "#FFFFFF";

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="제이앤지시스템 로고"
      role="img"
    >
      {/* 아이콘 박스 */}
      <rect x="2" y="4" width="72" height="72" rx="12" fill={boxFill} stroke={boxStroke} strokeWidth="2" />

      {/* J 글자 — 오른쪽 세로획 + 하단 곡선 */}
      <line x1="46" y1="20" x2="46" y2="56" stroke={jgColor} strokeWidth="7" strokeLinecap="round" />
      <path d="M46 56 Q46 68 34 68 Q26 68 24 62" fill="none" stroke={jgColor} strokeWidth="7" strokeLinecap="round" />

      {/* G 글자 */}
      {/* 왼쪽 반원 호 */}
      <path d="M60 20 Q44 20 44 40 Q44 60 60 60" fill="none" stroke={jgColor} strokeWidth="7" strokeLinecap="round" />
      {/* 오른쪽 가로선 (중간) */}
      <line x1="60" y1="40" x2="68" y2="40" stroke={jgColor} strokeWidth="7" strokeLinecap="round" />
      {/* 오른쪽 세로선 (하단) */}
      <line x1="68" y1="40" x2="68" y2="60" stroke={jgColor} strokeWidth="7" strokeLinecap="round" />
      {/* 하단 가로선 */}
      <line x1="60" y1="60" x2="68" y2="60" stroke={jgColor} strokeWidth="7" strokeLinecap="round" />

      {/* J&G 텍스트 */}
      <text
        x="92"
        y="42"
        fontFamily="'Pretendard', 'Noto Sans KR', Arial, sans-serif"
        fontWeight="700"
        fontSize="30"
        fill={textColor}
        letterSpacing="0.5"
      >
        J&amp;G
      </text>

      {/* SYSTEM 텍스트 */}
      <text
        x="93"
        y="67"
        fontFamily="'Pretendard', 'Noto Sans KR', Arial, sans-serif"
        fontWeight="400"
        fontSize="18"
        fill={textColor}
        letterSpacing="4"
        opacity={isDark ? "0.75" : "0.85"}
      >
        SYSTEM
      </text>
    </svg>
  );
}
