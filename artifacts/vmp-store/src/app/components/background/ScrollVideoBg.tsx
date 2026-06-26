'use client';

import { useEffect, useRef } from 'react';

export function ScrollVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let frame = 0;
    const syncVideo = () => {
      const video = videoRef.current;
      if (video?.duration) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        video.currentTime = Math.min(video.duration - 0.05, Math.max(0, percentage * video.duration));
      }
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncVideo);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-emerald-950 transform-gpu">
      <video ref={videoRef} src="/assets/bg-disposable-anime.mp4" muted playsInline preload="metadata" className="h-full w-full object-cover opacity-35 will-change-transform" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(236,253,245,0.72),rgba(15,23,42,0.18))] backdrop-blur-[4px]" />
    </div>
  );
}
