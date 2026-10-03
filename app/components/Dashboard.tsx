"use client";

import React, { useState, useMemo } from 'react';

interface Domain {
  id: string;
  name: string;
  color: string;
  icon: string;
  desc: string;
}

interface DashboardProps {
  lifeDomains: Domain[];
  scores: Record<string, number>;
  setScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export default function Dashboard({ lifeDomains, scores, setScores }: DashboardProps) {
  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  // حساب المعدل العام للتوازن
  const averageScore = useMemo(() => {
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return (sum / values.length).toFixed(1);
  }, [scores]);

  // حساب أضعف مجال للتحسين
  const weakestDomain = useMemo(() => {
    let minKey = lifeDomains[0]?.id || 'health';
    let minVal = 10;
    Object.entries(scores).forEach(([key, val]) => {
      if (val < minVal) {
        minVal = val;
        minKey = key;
      }
    });
    return lifeDomains.find(d => d.id === minKey) || lifeDomains[0];
  }, [scores, lifeDomains]);

  // رسم قطاعات العجلة بنظام SVG
  const totalSlices = lifeDomains.length;
  const radius = 140;
  const center = 160;

  const slices = useMemo(() => {
    const sliceAngle = (2 * Math.PI) / totalSlices;
    return lifeDomains.map((domain, index) => {
      const score = scores[domain.id] || 5;
      const currentRadius = (score / 10) * radius;
      const startAngle = index * sliceAngle - Math.PI / 2;
      const endAngle = (index + 1) * sliceAngle - Math.PI / 2;

      const x1 = center + currentRadius * Math.cos(startAngle);
      const y1 = center + currentRadius * Math.sin(startAngle);
      const x2 = center + currentRadius * Math.cos(endAngle);
      const y2 = center + currentRadius * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${currentRadius} ${currentRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      return {
        ...domain,
        pathData,
        score
      };
    });
  }, [lifeDomains, scores]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-bold">
            <span>🎯</span>
            <span>لوحة التقييم التفاعلية</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            عجلة الحياة <span className="text-purple-400">التفاعلية</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            حرّك السلايدرات لتقييم كل ركن واكتشف التوازن الحقيقي لحياتك في الرسم البياني المباشر.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-6 shrink-0">
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-400">مؤشر التوازن العام</div>
            <div className="text-2xl font-black text-purple-400 font-mono">{averageScore} / 10</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-400">أضعف مجالاتك حالياً</div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>{weakestDomain?.icon}</span>
              <span>{weakestDomain?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* العجلة التفاعلية (SVG Wheel) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center space-y-6 shadow-2xl">
          <h3 className="text-base font-bold text-white self-start">الرسم البياني المباشر لعجلتك</h3>
          
          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-xl">
              {/* الدوائر الخلفية للشبكة */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius * scale}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={scale === 1 ? 'none' : '3 3'}
                />
              ))}

              {/* قطاعات المجالات */}
              {slices.map(slice => (
                <path
                  key={slice.id}
                  d={slice.pathData}
                  fill={slice.color}
                  fillOpacity="0.45"
                  stroke={slice.color}
                  strokeWidth="2"
                  className="transition-all duration-300 hover:fill-opacity-80 cursor-pointer"
                >
                  <title>{`${slice.name}: ${slice.score}/10`}</title>
                </path>
              ))}

              {/* خطوط تقسيم الأركان */}
              {lifeDomains.map((_, i) => {
                const angle = (i * 2 * Math.PI) / totalSlices - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#475569"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full pt-2">
            {lifeDomains.map(d => (
              <div key={d.id} className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="truncate">{d.name}:</span>
                <span className="font-mono font-bold text-white mr-auto">{scores[d.id] || 5}/10</span>
              </div>
            ))}
          </div>
        </div>

        {/* سلايدرات التحكم في التقييم */}
        <div className="lg:col-span-6 border border-slate-800 bg-slate-900 p-6 rounded-3xl space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            عدّل التقييم المباشر لمجالاتك
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {lifeDomains.map(domain => {
              const currentVal = scores[domain.id] ?? 5;
              return (
                <div key={domain.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span>{domain.icon}</span>
                      <span>{domain.name}</span>
                    </div>
                    <span className="font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-purple-300">
                      {currentVal} / 10
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={currentVal}
                    onChange={e => handleScoreChange(domain.id, Number(e.target.value))}
                    className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />

                  <div className="text-[10px] text-slate-400">{domain.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}