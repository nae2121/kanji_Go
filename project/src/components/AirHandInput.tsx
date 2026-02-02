import { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface Props {
  onCommit: (char: string) => void;
}

export function AirHandInput({ onCommit }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const ocrRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState('手をカメラに映してください');
  const [mode, setMode] = useState<'WAIT_FIST' | 'READY' | 'DRAWING' | 'OCR'>('WAIT_FIST');

  const prev = useRef<{ x: number; y: number } | null>(null);

  /* ===== Canvas初期化 ===== */
  const clearCanvas = () => {
    const ctx = drawRef.current!.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 320, 240);
  };

  /* ===== OCR ===== */
  const runOCR = async () => {
    setStatus('OCR中...');
    const ctx = ocrRef.current!.getContext('2d')!;
    ctx.save();
    ctx.translate(320, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(drawRef.current!, 0, 0);
    ctx.restore();

    const result = await Tesseract.recognize(
      ocrRef.current!.toDataURL(),
      'jpn'
    );

    const char = (result.data.text.match(/[ぁ-ん]/) || [''])[0];
    if (char) onCommit(char);

    clearCanvas();
    setMode('READY');
    setStatus('人差し指で入力');
  };

  /* ===== MediaPipe ===== */
  useEffect(() => {
    if (!videoRef.current) return;

    clearCanvas();

    const hands = new Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(results => {
      if (!results.multiHandLandmarks?.length) {
        setStatus('手をカメラに映してください');
        return;
      }

      const lm = results.multiHandLandmarks[0];
      const tip = lm[8];
      const x = tip.x * 320;
      const y = tip.y * 240;

      const ctx = drawRef.current!.getContext('2d')!;

      if (mode === 'READY') {
        setStatus('人差し指で描画');
        prev.current = { x, y };
        setMode('DRAWING');
      }

      if (mode === 'DRAWING') {
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(prev.current!.x, prev.current!.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        prev.current = { x, y };

        // 縦振りで確定
        if (Math.abs(y - prev.current!.y) > 80) {
          setMode('OCR');
          runOCR();
        }
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current! });
      },
      width: 320,
      height: 240,
    });

    camera.start();
  }, [mode]);

  return (
    <div className="bg-white rounded-xl p-3 shadow-md">
      <div className="text-sm mb-1">{status}</div>
      <video ref={videoRef} width={320} height={240} autoPlay muted />
      <canvas ref={drawRef} width={320} height={240} className="hidden" />
      <canvas ref={ocrRef} width={320} height={240} className="hidden" />
    </div>
  );
}
