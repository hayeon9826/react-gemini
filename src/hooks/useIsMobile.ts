// hooks/useIsMobile.ts
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 600; // px

export default function useIsMobile(initial = false) {
  const [isMobile, setIsMobile] = useState(initial);

  useEffect(() => {
    // ① 브라우저가 없을 수도 있는 SSR 대비
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    // ② 리스너 콜백
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);

    // ③ 최초 실행 + 리스너 등록
    handleChange(mq);
    mq.addEventListener("change", handleChange);

    // ④ 정리
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
