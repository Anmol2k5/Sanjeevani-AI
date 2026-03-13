"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, RefreshCw, Zap, ZapOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PhotoScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function PhotoScanner({ isOpen, onClose, onCapture }: PhotoScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [torch, setTorch] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    
    if (capabilities.torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !torch }] as any
        });
        setTorch(!torch);
      } catch (err) {
        console.error("Error toggling torch:", err);
      }
    } else {
      alert("Torch not supported on this device/browser.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 100);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `scan_${Date.now()}.jpg`, { type: "image/jpeg" });
          onCapture(file);
          onClose();
        }
      }, "image/jpeg", 0.9);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Flash Effect */}
          <AnimatePresence>
            {isFlashing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-white"
              />
            )}
          </AnimatePresence>

          {/* Scanning Frame Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 md:w-80 md:h-80 border-2 border-white/50 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-hospital-blue-primary rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-hospital-blue-primary rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-hospital-blue-primary rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-hospital-blue-primary rounded-br-xl" />
              
              {/* Scanning Line Animation */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-hospital-blue-primary/50 shadow-[0_0_15px_rgba(0,102,204,0.5)]"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md">
              <X className="h-6 w-6" />
            </button>
            <div className="flex gap-4">
              <button onClick={toggleTorch} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md">
                {torch ? <Zap className="h-6 w-6 text-yellow-400" /> : <ZapOff className="h-6 w-6" />}
              </button>
              <button onClick={startCamera} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md">
                <RefreshCw className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-center bg-gradient-to-t from-black/50 to-transparent">
            <p className="text-white/80 text-sm mb-6 font-medium">Align symptoms within the frame</p>
            <button
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full border-4 border-hospital-blue-primary flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-white rounded-full border-2 border-black/10" />
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
