"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

interface TravelItem {
  id: number;
  title: string;
  description: string;
  img: string;
  order: number;
}

/* ===================== IMAGE NORMALIZER ===================== */
const normalizeImageUrl = (img: string) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (!img.startsWith("/360/")) {
    return `/360/${img.replace(/^\/+/, "")}`;
  }
  return img;
};

/* ===================== PANORAMA ===================== */
function Panorama({
  imageUrl,
  onLoad,
  onError,
}: {
  imageUrl: string;
  onLoad: () => void;
  onError: (e: string) => void;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      onError("Image URL yo‘q");
      return;
    }

    let mounted = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      imageUrl,
      (tex) => {
        if (!mounted) return;

        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;

        setTexture(tex);
        onLoad();
      },
      undefined,
      () => {
        if (!mounted) return;
        onError(imageUrl);
      },
    );

    return () => {
      mounted = false;
    };
  }, [imageUrl]);

  if (!texture) {
    return (
      <Html center>
        <div className="text-white">Loading...</div>
      </Html>
    );
  }

  return (
    <Sphere args={[500, 64, 64]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  );
}

/* ===================== CAMERA ===================== */
function CameraController({ autoRotate }: { autoRotate: boolean }) {
  const { camera } = useThree();
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useFrame(() => {
    if (autoRotate && !dragging) {
      camera.rotation.y += 0.002;
    }
  });

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const down = (e: MouseEvent) => {
      setDragging(true);
      setPos({ x: e.clientX, y: e.clientY });
    };

    const move = (e: MouseEvent) => {
      if (!dragging) return;

      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      camera.rotation.y += dx * 0.005;
      camera.rotation.x += dy * 0.005;

      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x),
      );

      setPos({ x: e.clientX, y: e.clientY });
    };

    const up = () => setDragging(false);

    canvas.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      canvas.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, pos]);

  useEffect(() => {
    const reset = () => {
      camera.rotation.set(0, 0, 0);
    };

    window.addEventListener("resetCamera", reset);
    return () => window.removeEventListener("resetCamera", reset);
  }, [camera]);

  return null;
}

/* ===================== MAIN ===================== */
export default function Travel360() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const lang =
    pathname?.split("/")[1] &&
    ["uz", "en", "ru"].includes(pathname.split("/")[1])
      ? pathname.split("/")[1]
      : "uz";

  const [items, setItems] = useState<TravelItem[]>([
    {
      id: 3,
      title: "Test Panorama",
      description: "Demo 360 view",
      img: "photo_2026-04-21_11-09-10.jpg",
      order: 1,
    },
  ]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  /* FETCH */
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch(`/api/travel360?lang=${lang}`);
  //       const data = await res.json();

  //       if (!res.ok) throw new Error("API error");

  //       setItems(
  //         data.data.sort((a: TravelItem, b: TravelItem) => a.order - b.order),
  //       );
  //     } catch (e) {
  //       setError("Ma'lumot yuklanmadi");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [lang]);

  const images = items.map((i) => normalizeImageUrl(i.img));

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
    setLoading(true);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setLoading(true);
  }, [images.length]);

  if (!images.length) {
    return <div className="text-white text-center p-10">No images</div>;
  }

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 75, position: [0, 0, 0.1] }}
        gl={{ antialias: false }}
      >
        <Suspense fallback={null}>
          <Panorama
            imageUrl={images[index]}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              setError(e);
              setLoading(false);
            }}
          />
          <CameraController autoRotate={autoRotate} />
        </Suspense>
      </Canvas>

      {/* LOADING */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
          Loading...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white">
          {error}
        </div>
      )}

      {/* NAVIGATION (FIXED EMAS!) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-black/60 px-4 py-2 rounded-full">
        <button onClick={prev}>←</button>
        <span className="text-white">
          {index + 1}/{images.length}
        </span>
        <button onClick={next}>→</button>
        <button onClick={() => setAutoRotate((p) => !p)}>🔄</button>
        <button onClick={() => window.dispatchEvent(new Event("resetCamera"))}>
          🧭
        </button>
      </div>
    </section>
  );
}
