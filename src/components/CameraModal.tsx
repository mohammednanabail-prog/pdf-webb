import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Check, X, SwitchCamera, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  currentLang: Language;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  currentLang
}) => {
  const t = translations[currentLang];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedUrl(null);
      setErrorMsg(null);
      return;
    }

    startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg(t.camera.cameraError);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSnap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedUrl(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedUrl(null);
    startCamera(facingMode);
  };

  const handleKeep = () => {
    if (capturedUrl) {
      onCapture(capturedUrl);
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Camera className="w-5 h-5 text-cyan-400" />
            <span>{t.camera.title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-rose-400 flex flex-col items-center gap-3">
              <AlertCircle className="w-12 h-12" />
              <p className="text-sm font-semibold">{errorMsg}</p>
            </div>
          ) : capturedUrl ? (
            <img
              src={capturedUrl}
              alt="Snapshot"
              className="max-h-[60vh] max-w-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-contain max-h-[60vh]"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Guidelines Overlay */}
          {!capturedUrl && !errorMsg && (
            <div className="absolute inset-8 pointer-events-none border-2 border-cyan-400/40 border-dashed rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400 absolute top-0 left-0" />
              <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400 absolute top-0 right-0" />
              <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400 absolute bottom-0 left-0" />
              <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 absolute bottom-0 right-0" />
            </div>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4">
          {!errorMsg && (
            <>
              {capturedUrl ? (
                <>
                  <button
                    onClick={handleRetake}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t.camera.retake}</span>
                  </button>

                  <button
                    onClick={handleKeep}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t.camera.keep}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleCamera}
                    className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                    title={t.camera.switchCam}
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSnap}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-cyan-500/40 border-4 border-slate-900 cursor-pointer transition-all"
                    title={t.camera.capture}
                  >
                    <Camera className="w-7 h-7" />
                  </button>

                  <div className="w-12 h-12" />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
