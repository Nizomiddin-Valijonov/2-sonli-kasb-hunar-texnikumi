"use client";

import { useState, useRef, Suspense, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

// Panorama komponenti - xatoliklarni boshqarish bilan
function Panorama({
  imageUrl,
  onLoad,
  onError,
}: {
  imageUrl: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      onError?.("Rasm URL si topilmadi");
      return;
    }

    const loader = new THREE.TextureLoader();

    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
        setHasError(false);
        onLoad?.();
      },
      undefined,
      (error) => {
        console.error("Rasm yuklanmadi:", imageUrl, error);
        setHasError(true);
        onError?.(`Rasm yuklanmadi: ${imageUrl}`);
      },
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl, onLoad, onError]);

  if (hasError) {
    return (
      <Html center>
        <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg">
          ⚠️ Rasm yuklanmadi
        </div>
      </Html>
    );
  }

  if (!texture) {
    return (
      <Html center>
        <div className="text-white">Yuklanmoqda...</div>
      </Html>
    );
  }

  return (
    <Sphere args={[500, 64, 64]}>
      <meshStandardMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </Sphere>
  );
}

// Boshqaruv tugmalari
function NavigationControls({
  currentIndex,
  total,
  onNext,
  onPrev,
  onResetOrientation,
  onAutoRotateToggle,
  isAutoRotating,
}: {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onResetOrientation: () => void;
  onAutoRotateToggle: () => void;
  isAutoRotating: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3 bg-black/70 backdrop-blur-lg px-4 py-2 rounded-full">
      <button
        onClick={onPrev}
        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-xl flex items-center justify-center transition-all"
        aria-label={t("travel360.previous")}
      >
        ←
      </button>

      <div className="flex items-center gap-2 text-white font-medium px-2">
        <span>{currentIndex + 1}</span>
        <span>/</span>
        <span>{total}</span>
      </div>

      <button
        onClick={onNext}
        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-xl flex items-center justify-center transition-all"
        aria-label={t("travel360.next")}
      >
        →
      </button>

      <button
        onClick={onAutoRotateToggle}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isAutoRotating
            ? "bg-green-500/80 hover:bg-green-600"
            : "bg-white/20 hover:bg-white/30"
        } text-white`}
        aria-label={t("travel360.autoRotate")}
      >
        🔄
      </button>

      <button
        onClick={onResetOrientation}
        className="px-3 h-10 rounded-full bg-blue-500/80 hover:bg-blue-600 text-white text-sm flex items-center justify-center transition-all"
        aria-label={t("travel360.reset")}
      >
        🧭
      </button>
    </div>
  );
}

// Yuklash indikatori
function LoadingIndicator() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
          Yuklanmoqda...
        </p>
      </div>
    </Html>
  );
}

// Kamera boshqaruvi - mouse va touch bilan
function CameraController() {
  const { t } = useTranslation();
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateSpeed = useRef(0.002);

  // Auto-rotate state ni parentga yuborish
  useEffect(() => {
    const event = new CustomEvent("autoRotateChange", { detail: autoRotate });
    window.dispatchEvent(event);
  }, [autoRotate]);

  useFrame(({ camera, gl }) => {
    if (!cameraRef.current) {
      cameraRef.current = camera as THREE.PerspectiveCamera;
    }

    if (autoRotate && !isDragging) {
      camera.rotation.y += autoRotateSpeed.current;
      camera.rotation.x += 0.001;
    }

    camera.updateProjectionMatrix();
  });

  // Mouse boshqaruvi
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cameraRef.current) return;

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      cameraRef.current.rotation.y += deltaX * 0.005;
      cameraRef.current.rotation.x += deltaY * 0.005;

      // X o'qi chegarasi
      cameraRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, cameraRef.current.rotation.x),
      );

      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Touch qurilmalar uchun
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !cameraRef.current) return;
      e.preventDefault();

      const deltaX = e.touches[0].clientX - lastMousePos.x;
      const deltaY = e.touches[0].clientY - lastMousePos.y;

      cameraRef.current.rotation.y += deltaX * 0.005;
      cameraRef.current.rotation.x += deltaY * 0.005;

      cameraRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, cameraRef.current.rotation.x),
      );

      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, lastMousePos]);

  return null;
}

// Asosiy komponent
export default function Travel360() {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);

  const pathname = usePathname();
  const currentLang =
    pathname?.split("/")[1] && ["uz", "en", "ru"].includes(pathname.split("/")[1])
      ? pathname.split("/")[1]
      : "uz";

  const normalizeImageUrl = (img: string) => {
    if (!img) return "";
    return img.startsWith("/") ? img : `/${img}`;
  };

  const panoramaImages = travelItems.map((item) => normalizeImageUrl(item.img));
  const currentItem = travelItems[currentImageIndex];

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/travel360?lang=${currentLang}`);
        const data = await response.json();

        if (!response.ok || !Array.isArray(data?.data)) {
          throw new Error(data?.error || "Unable to load travel images.");
        }

        const sorted = data.data.sort((a: TravelItem, b: TravelItem) => a.order - b.order);
        setTravelItems(sorted);
        setCurrentImageIndex(0);
      } catch (err) {
        setError(String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravel();
  }, []);

  const handleNext = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setCurrentImageIndex((prev) => (prev + 1) % panoramaImages.length);
  }, [panoramaImages.length]);

  const handlePrev = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setCurrentImageIndex(
      (prev) => (prev - 1 + panoramaImages.length) % panoramaImages.length,
    );
  }, [panoramaImages.length]);

  const handleResetOrientation = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      // Kamera rotatsiyasini reset qilish
      const event = new CustomEvent("resetCamera");
      window.dispatchEvent(event);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleImageError = useCallback((err: string) => {
    console.error("Rasm yuklash xatosi:", err);
    if (panoramaImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % panoramaImages.length);
      setError(`Rasm yuklanmadi: ${err}. Keyingi rasm yuklanadi.`);
      setIsLoading(true);
      return;
    }

    setError(`${err}. Iltimos, public/360 papkasida rasm borligini tekshiring.`);
    setIsLoading(false);
  }, [panoramaImages.length]);

  const handleAutoRotateToggle = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  // Auto-rotate event listener
  useEffect(() => {
    const handleAutoRotateChange = (e: CustomEvent) => {
      setAutoRotate(e.detail);
    };

    window.addEventListener(
      "autoRotateChange",
      handleAutoRotateChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "autoRotateChange",
        handleAutoRotateChange as EventListener,
      );
    };
  }, []);

  // Reset camera event listener
  useEffect(() => {
    const handleResetCamera = () => {
      const camera = (document.querySelector("canvas") as any)?.__camera as THREE.PerspectiveCamera;
      if (camera) {
        camera.rotation.set(0, 0, 0);
      }
    };

    window.addEventListener("resetCamera", handleResetCamera);

    return () => {
      window.removeEventListener("resetCamera", handleResetCamera);
    };
  }, []);

  if (panoramaImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-xl">Hech qanday rasm topilmadi</p>
          <p className="text-gray-400 mt-2">
            Iltimos, rasmlarni /360/ papkasiga qo'ying
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      id="travel360"
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* VR canvasi */}
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.1] }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<LoadingIndicator />}>
          <Panorama
            imageUrl={panoramaImages[currentImageIndex]}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <CameraController />
        </Suspense>
      </Canvas>

      {/* Xatolik xabari */}
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="text-center bg-red-500/20 backdrop-blur-md px-6 py-4 rounded-xl border border-red-500/50 max-w-md mx-4">
            <p className="text-red-400 text-xl mb-2">⚠️ Xatolik yuz berdi</p>
            <p className="text-white/80 text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                handleImageLoad();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              Qayta urinish
            </button>
            <p className="mt-3 text-xs text-white/60">
              Agar xatolik davom etsa, iltimos rasm yo‘lini tekshiring yoki admin panelda yangi 360 rasm qo‘shing.
            </p>
          </div>
        </div>
      )}

      {/* Yuklash indikatori */}
      {isLoading && !error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-xl font-medium">
              {t("travel360.loading") || "VR tajriba yuklanmoqda..."}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Rasm {currentImageIndex + 1}/{panoramaImages.length}
            </p>
          </div>
        </div>
      )}

      {/* Navigatsiya tugmalari */}
      <NavigationControls
        currentIndex={currentImageIndex}
        total={panoramaImages.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onResetOrientation={handleResetOrientation}
        onAutoRotateToggle={handleAutoRotateToggle}
        isAutoRotating={autoRotate}
      />

      {/* Ma'lumot paneli */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full pointer-events-none">
        <p className="text-white text-xs md:text-sm font-medium">
          🖱️{" "}
          {t("travel360.vrInstruction") ||
            "Sichqoncha yoki barmoq bilan harakatlantiring - 360° ko'rinish"}
        </p>
      </div>

      {/* Sarlavha va indeks */}
      <div className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg pointer-events-none">
        <h1 className="text-white text-lg md:text-xl font-bold">
          {currentItem?.title || t("travel360.title") || "360° VR Sayohat"}
        </h1>
        <p className="text-white/60 text-xs">
          {currentItem?.description || t("travel360.subtitle") || "Sichqoncha yoki barmoq bilan harakatlantiring - 360° ko‘rinish"}
        </p>
        <p className="text-white/60 text-xs mt-1">
          {currentImageIndex + 1} / {panoramaImages.length}
          {currentItem?.img ? ` · ${normalizeImageUrl(currentItem.img)}` : ""}
        </p>
      </div>

      {/* Fullscreen tugmasi */}
      <button
        onClick={() => {
          const elem = document.documentElement;
          if (!document.fullscreenElement) {
            elem.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}
        className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
        aria-label="Fullscreen"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </button>
    </section>
  );
}
