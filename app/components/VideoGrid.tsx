"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaItem } from "../context/MediaContext";
import { Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  items: MediaItem[];
}


export default function VideoGrid({ items }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);


  useEffect(() => {
    const ctx = gsap.context(() => {
      const cellEls = gsap.utils.toArray<HTMLElement>(".video-bento-cell");
      gsap.fromTo(
        cellEls,
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: { amount: 1.4, from: "start" },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <>
      <div className="bento-grid video-grid" ref={gridRef}>
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="bento-cell video-bento-cell"
            onClick={() => setActiveVideo(item.url)}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => {
              const v = e.currentTarget.querySelector("video");
              if (v) v.play().catch(() => {});
            }}
            onMouseLeave={(e) => {
              const v = e.currentTarget.querySelector("video");
              if (v) { v.pause(); v.currentTime = 0; }
            }}
          >
            <video
              src={item.url}
              muted
              playsInline
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
            />
            <div className="play-btn">
              <div className="play-btn-inner">
                <Play size={18} fill="white" color="white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="video-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setActiveVideo(null)}
            >
              ✕ Close
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: "100%", maxHeight: "85vh", objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
