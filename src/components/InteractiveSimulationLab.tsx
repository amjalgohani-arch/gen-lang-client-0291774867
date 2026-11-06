import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  Compass,
  Sliders,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

interface InteractiveSimulationLabProps {
  initialMode?: string;
}

type SimulationMode = 'optics' | 'neural' | 'orbits';

export const InteractiveSimulationLab: React.FC<InteractiveSimulationLabProps> = ({
  initialMode = 'optics',
}) => {
  const [mode, setMode] = useState<SimulationMode>(
    (initialMode as SimulationMode) || 'optics'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // --- 1. Optics States (Snell's Law) ---
  const [n1, setN1] = useState<number>(1.0); // Air
  const [n2, setN2] = useState<number>(1.52); // Glass
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(45);
  const opticsCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- 2. Neural Network States ---
  const [w1, setW1] = useState<number>(1.2);
  const [w2, setW2] = useState<number>(-0.8);
  const [bias, setBias] = useState<number>(0.1);
  const [activation, setActivation] = useState<'sigmoid' | 'relu' | 'tanh'>('sigmoid');
  const [testInput1, setTestInput1] = useState<number>(0.6);
  const [testInput2, setTestInput2] = useState<number>(0.4);

  // --- 3. Planetary Orbit States ---
  const [starMass, setStarMass] = useState<number>(1000);
  const [orbitalVelocity, setOrbitalVelocity] = useState<number>(2.8);
  const [initialDistance, setInitialDistance] = useState<number>(120);
  const orbitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbitAnimRef = useRef<number | null>(null);
  const orbitState = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    trail: [] as { x: number; y: number }[],
  });

  // Calculate Snell's law values
  const theta1Rad = (incidentAngleDeg * Math.PI) / 180;
  const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);
  const isTIR = sinTheta2 > 1.0; // Total internal reflection
  const theta2Rad = isTIR ? 0 : Math.asin(sinTheta2);
  const refractedAngleDeg = isTIR ? null : (theta2Rad * 180) / Math.PI;
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // Render Optics Canvas
  useEffect(() => {
    if (mode !== 'optics') return;
    const canvas = opticsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Medium 1 (top)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, cy);

    // Medium 2 (bottom)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, cy, width, cy);

    // Interface boundary line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Normal line (dashed vertical)
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Incident Ray (comes from top-left into center)
    const rayLength = Math.min(width, height) * 0.42;
    const incX = cx - rayLength * Math.sin(theta1Rad);
    const incY = cy - rayLength * Math.cos(theta1Rad);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ef4444';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(incX, incY);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Reflected Ray (always exists in top-right)
    const refX = cx + rayLength * Math.sin(theta1Rad);
    const refY = cy - rayLength * Math.cos(theta1Rad);
    ctx.shadowColor = isTIR ? '#ef4444' : '#f87171';
    ctx.strokeStyle = isTIR ? '#ef4444' : 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = isTIR ? 3.5 : 1.8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(refX, refY);
    ctx.stroke();

    // Refracted Ray (bottom-right if not TIR)
    if (!isTIR && refractedAngleDeg !== null) {
      const refrX = cx + rayLength * Math.sin(theta2Rad);
      const refrY = cy + rayLength * Math.cos(theta2Rad);

      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(refrX, refrY);
      ctx.stroke();

      // Refraction angle arc
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, Math.PI / 2 - theta2Rad, Math.PI / 2, false);
      ctx.stroke();
    }

    // Incident angle arc
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 38, -Math.PI / 2, -Math.PI / 2 + theta1Rad, false);
    ctx.stroke();

    // Labels
    ctx.font = '12px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`الوسط الأول (n₁ = ${n1.toFixed(2)})`, 20, 30);
    ctx.fillText(`الوسط الثاني (n₂ = ${n2.toFixed(2)})`, 20, cy + 30);
    ctx.fillText(`θ₁ = ${incidentAngleDeg}°`, cx - 75, cy - 45);

    if (!isTIR && refractedAngleDeg !== null) {
      ctx.fillText(`θ₂ = ${refractedAngleDeg.toFixed(1)}°`, cx + 25, cy + 50);
    }
  }, [mode, n1, n2, incidentAngleDeg, theta1Rad, theta2Rad, isTIR, refractedAngleDeg]);

  // Orbit Physics Engine Loop
  useEffect(() => {
    if (mode !== 'orbits') return;
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset planet position on parameter change
    orbitState.current = {
      x: initialDistance,
      y: 0,
      vx: 0,
      vy: orbitalVelocity,
      trail: [],
    };

    let running = true;

    const animate = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Star in center
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f59e0b';
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      if (isPlaying) {
        // Physics update (Newton's Gravity law: F = G * M * m / r^2)
        const dt = 0.5;
        const G = 1;
        const dx = -orbitState.current.x;
        const dy = -orbitState.current.y;
        const distSq = dx * dx + dy * dy + 10; // softening
        const dist = Math.sqrt(distSq);
        const force = (G * starMass) / distSq;
        const ax = force * (dx / dist);
        const ay = force * (dy / dist);

        orbitState.current.vx += ax * dt;
        orbitState.current.vy += ay * dt;
        orbitState.current.x += orbitState.current.vx * dt;
        orbitState.current.y += orbitState.current.vy * dt;

        // Trail
        orbitState.current.trail.push({
          x: orbitState.current.x,
          y: orbitState.current.y,
        });
        if (orbitState.current.trail.length > 150) {
          orbitState.current.trail.shift();
        }
      }

      // Draw Orbit Trail
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < orbitState.current.trail.length; i++) {
        const pt = orbitState.current.trail[i];
        if (i === 0) ctx.moveTo(cx + pt.x, cy + pt.y);
        else ctx.lineTo(cx + pt.x, cy + pt.y);
      }
      ctx.stroke();

      // Draw Planet
      const px = cx + orbitState.current.x;
      const py = cy + orbitState.current.y;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      orbitAnimRef.current = requestAnimationFrame(animate);
    };

    orbitAnimRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
    };
  }, [mode, starMass, orbitalVelocity, initialDistance, isPlaying]);

  // Neural computation
  const rawZ = testInput1 * w1 + testInput2 * w2 + bias;
  let activationOutput = 0;
  if (activation === 'sigmoid') {
    activationOutput = 1 / (1 + Math.exp(-rawZ));
  } else if (activation === 'relu') {
    activationOutput = Math.max(0, rawZ);
  } else if (activation === 'tanh') {
    activationOutput = Math.tanh(rawZ);
  }

  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lab Header & Simulation Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>المختبر العلمي التفاعلي المتكامل</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              محاكاة النظم والظواهر الفيزيائية والذكاء الاصطناعي
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-lg">
            <button
              onClick={() => setMode('optics')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                mode === 'optics'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              بصريات الليزر وقانون سنيل
            </button>
            <button
              onClick={() => setMode('neural')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                mode === 'neural'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              الشبكة العصبية الحية
            </button>
            <button
              onClick={() => setMode('orbits')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                mode === 'orbits'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              المدارات والجاذبية الكونية
            </button>
          </div>
        </div>

        {/* Two-Zone Sandbox Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Top Zone: Interactive Stage (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl overflow-hidden relative">
              
              {/* Stage Canvas */}
              {mode === 'optics' && (
                <div className="relative">
                  <canvas
                    ref={opticsCanvasRef}
                    width={720}
                    height={460}
                    className="w-full h-auto rounded-xl bg-slate-950"
                  />
                  {/* Status Indicator Bar */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-mono">
                    {isTIR ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>▲ انعكاس كلي تام (TIR)</span>
                      </span>
                    ) : (
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>● انكسار نظامي مستقر</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {mode === 'orbits' && (
                <div className="relative">
                  <canvas
                    ref={orbitCanvasRef}
                    width={720}
                    height={460}
                    className="w-full h-auto rounded-xl bg-slate-950"
                  />
                  {/* Playback Controls Overlay */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        orbitState.current = {
                          x: initialDistance,
                          y: 0,
                          vx: 0,
                          vy: orbitalVelocity,
                          trail: [],
                        };
                      }}
                      className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="إعادة التعيين"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {mode === 'neural' && (
                <div className="h-[460px] p-6 flex flex-col justify-between text-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                    <span>مخطط تدفق الإشارة العصبية (Signal Flow)</span>
                    <span className="text-amber-400 font-semibold">{activation.toUpperCase()}</span>
                  </div>

                  {/* Neural Architecture Schematic */}
                  <div className="grid grid-cols-3 gap-6 items-center py-6">
                    {/* Inputs */}
                    <div className="space-y-6">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[11px] text-slate-400">المدخل الأول x₁</div>
                        <div className="text-base font-bold font-mono text-cyan-400 tabular-nums">
                          {testInput1.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[11px] text-slate-400">المدخل الثاني x₂</div>
                        <div className="text-base font-bold font-mono text-cyan-400 tabular-nums">
                          {testInput2.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Neuron Core */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full border-2 border-amber-500 bg-slate-900 flex flex-col items-center justify-center p-2 text-center shadow-lg shadow-amber-500/10">
                        <div className="text-[10px] text-slate-400">المجموع Σ</div>
                        <div className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                          z = {rawZ.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">b = {bias.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-center">
                        <div className="text-xs text-slate-400 mb-1">المخرج المفعّل f(z)</div>
                        <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
                          {activationOutput.toFixed(3)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {activationOutput > 0.5 ? 'فئة موجبة (Class 1)' : 'فئة سالبة (Class 0)'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Formula Display */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 dir-ltr text-center">
                    z = ({testInput1.toFixed(2)} × {w1.toFixed(2)}) + ({testInput2.toFixed(2)} × {w2.toFixed(2)}) + {bias.toFixed(2)} = {rawZ.toFixed(2)}
                  </div>
                </div>
              )}

            </div>

            {/* Scientific Concept Explainer Strip */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                {mode === 'optics' && (
                  <p>
                    <strong>قانون سنيل (Snell's Law):</strong> يحدد الزاوية التي ينحرف بها الضوء عند دخوله وسطاً مختلف الكثافة البصرية. إذا كانت زاوية السقوط أكبر من الزاوية الحرجة ({criticalAngleDeg ? `${criticalAngleDeg.toFixed(1)}°` : 'غير متاحة'})، يرتد الضوء كاملاً داخل الوسط كما يحدث في كابلات الإنترنت بالألياف الضوئية!
                  </p>
                )}
                {mode === 'neural' && (
                  <p>
                    <strong>الخلية العصبية الاصطناعية (Perceptron):</strong> تمثل النواة الحسابية في الذكاء الاصطناعي. بتعديل الأوزان (Weights) والانحياز (Bias)، تتعلم الخلية رسم خط فاصل يفصل بين الأنماط المختلفة بدقة عالية.
                  </p>
                )}
                {mode === 'orbits' && (
                  <p>
                    <strong>قوانين كبلر والجاذبية العامة:</strong> تدور الكواكب في مدارات بيضاوية وتتغير سرعتها حسب قربها من النجم المركزي للحفاظ على كمية الحركة الزاوية والطاقة الكلية.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right / Bottom Zone: Control & Parameter Deck (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  لوحة التحكم في المتغيرات
                </span>
                <span className="text-xs font-mono text-slate-400">تحديث فوري</span>
              </div>

              {/* Controls for Optics */}
              {mode === 'optics' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-700 dark:text-slate-300">زاوية السقوط (θ₁)</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                        {incidentAngleDeg}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="89"
                      value={incidentAngleDeg}
                      onChange={(e) => setIncidentAngleDeg(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-700 dark:text-slate-300">معامل انكسار الوسط الأول (n₁)</span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                        {n1.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="2.5"
                      step="0.05"
                      value={n1}
                      onChange={(e) => setN1(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>هواء (1.0)</span>
                      <span>ماء (1.33)</span>
                      <span>زجاج (1.52)</span>
                      <span>ألماس (2.42)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-700 dark:text-slate-300">معامل انكسار الوسط الثاني (n₂)</span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                        {n2.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="2.5"
                      step="0.05"
                      value={n2}
                      onChange={(e) => setN2(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Calculated Data Box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">زاوية الانكسار (θ₂):</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {isTIR ? 'انعكاس تام (غير منكسر)' : `${refractedAngleDeg?.toFixed(2)}°`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">الزاوية الحرجة (θ_c):</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {criticalAngleDeg ? `${criticalAngleDeg.toFixed(2)}°` : 'غير متحققة (n₁ ≤ n₂)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls for Neural */}
              {mode === 'neural' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>دالة التنشيط (Activation Function)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {(['sigmoid', 'relu', 'tanh'] as const).map((fn) => (
                        <button
                          key={fn}
                          onClick={() => setActivation(fn)}
                          className={`py-1.5 text-xs font-semibold rounded capitalize transition-all ${
                            activation === fn
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {fn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>الوزن الأول (w₁)</span>
                      <span className="font-mono text-amber-500 tabular-nums">{w1.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={w1}
                      onChange={(e) => setW1(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>الوزن الثاني (w₂)</span>
                      <span className="font-mono text-amber-500 tabular-nums">{w2.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={w2}
                      onChange={(e) => setW2(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>الانحياز (Bias b)</span>
                      <span className="font-mono text-amber-500 tabular-nums">{bias.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={bias}
                      onChange={(e) => setBias(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Controls for Orbits */}
              {mode === 'orbits' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>كتلة النجم المركزي (M)</span>
                      <span className="font-mono text-amber-500 tabular-nums">{starMass}</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="2500"
                      step="50"
                      value={starMass}
                      onChange={(e) => setStarMass(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>السرعة المدارية الابتدائية (v₀)</span>
                      <span className="font-mono text-cyan-500 tabular-nums">{orbitalVelocity.toFixed(1)} km/s</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={orbitalVelocity}
                      onChange={(e) => setOrbitalVelocity(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>المسافة المدارية الابتدائية (r₀)</span>
                      <span className="font-mono text-cyan-500 tabular-nums">{initialDistance} AU</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="200"
                      step="5"
                      value={initialDistance}
                      onChange={(e) => setInitialDistance(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
