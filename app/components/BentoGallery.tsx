"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { MediaItem } from "../context/MediaContext";

gsap.registerPlugin(ScrollTrigger);


interface Props {
  items: MediaItem[];
}

export default function BentoGallery({ items }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);


  useEffect(() => {
    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>(".bento-cell");
      gsap.fromTo(
        cells,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: { amount: 1.2, from: "start" },
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
      <div className="bento-grid" ref={gridRef}>
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="bento-cell"
            onClick={() => setLightbox(item.url)}
          >
            <Image
              src={item.url}
              alt={`Photo ${i + 1}`}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="video-modal-backdrop"
          onClick={() => setLightbox(null)}
          style={{ cursor: "none" }}
        >
          <div
            style={{ 
              position: "relative", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              maxWidth: "100%" 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setLightbox(null)}
              style={{ position: "relative", top: 0, right: 0, alignSelf: "flex-end", marginBottom: 16 }}
            >
              ✕ Close
            </button>
            <Image
              src={lightbox}
              alt="Lightbox"
              width={1600}
              height={1600}
              style={{ 
                maxWidth: "100%", 
                maxHeight: "85vh", 
                width: "auto", 
                height: "auto", 
                objectFit: "contain" 
              }}
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}
