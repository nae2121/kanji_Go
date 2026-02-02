import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

/* ======================
   ジェスチャー判定ロジック
====================== */

function isFingerExtended(lm: any[], tip: number, pip: number) {
  return lm[tip].y < lm[pip].y;
}

function detectGesture(lm: any[]) {
  const index  = isFingerExtended(lm, 8, 6);
  const middle = isFingerExtended(lm, 12, 10);
  const ring   = isFingerExtended(lm, 16, 14);
  const pinky  = isFingerExtended(lm, 20, 18);

  if (!index && !middle && !ring && !pinky) return 'FIST';
  if (index && !middle && !ring && !pinky) return 'INDEX';
  return 'OTHER';
}

/* ======================
   コンポーネント本体
====================== */

export function AirInputOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState('初期化中');
  const [mode, setMode] =
    useState<'WAIT_FIST' | 'READY' | 'DRAWING'>('WAIT_FIST');

  const prevPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!window.Hands || !window.Camera) {
      setStatus('MediaPipe 読み込み失敗');
      return;
    }

    const hands = new window.Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results: any) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        setStatus('状態: 手をカメラに映してください');
        setMode('WAIT_FIST');
        prevPos.current = null;
        return;
      }

      const lm = results.multiHandLandmarks[0];
      const gesture = detectGesture(lm);

      const tip = lm[8];
      const x = tip.x * canvas.width;
      const y = tip.y * canvas.height;

      /* ===== 点の描画（常時） ===== */
      ctx.fillStyle = 'red';
      lm.forEach((p: any) => {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ===== 状態遷移 ===== */

      if (mode === 'WAIT_FIST') {
        setStatus('状態: こぶしを作ってください');
        if (gesture === 'FIST') {
          setMode('READY');
        }
      }

      else if (mode === 'READY') {
        setStatus('状態: 人差し指で描画開始');
        if (gesture === 'INDEX') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          prevPos.current = { x, y };
          setMode('DRAWING');
        }
      }

      else if (mode === 'DRAWING') {
        setStatus('状態: 描画中（グーで終了）');

        if (gesture === 'INDEX' && prevPos.current) {
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(prevPos.current.x, prevPos.current.y);
          ctx.lineTo(x, y);
          ctx.stroke();

          prevPos.current = { x, y };
        }

        if (gesture === 'FIST') {
          setMode('READY');
          prevPos.current = null;
        }
      }
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 240,
      height: 180,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [mode]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 rounded-lg p-2 shadow">
      <div className="text-xs font-bold">空中入力</div>
      <div className="text-xs">状態: {status}</div>
      <div className="text-xs">モード: {mode}</div>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={240}
          height={180}
          className="border"
        />
        <canvas
          ref={canvasRef}
          width={240}
          height={180}
          className="absolute top-0 left-0 pointer-events-none"
        />
      </div>
    </div>
  );
}
