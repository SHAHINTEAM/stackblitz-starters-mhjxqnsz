"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface Domain {
  id: string;
  name: string;
  color: string;
  icon: string;
  desc: string;
}

interface QuizWizardProps {
  lifeDomains: Domain[];
  scores: Record<string, number>;
  setScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setActiveTab: (tab: string) => void;
  startQuizFresh: () => void;
}

const QUIZ_QUESTIONS: Record<string, { question: string; hint: string }> = {
  health: { question: "كيف تقيّم مستوى صحتك الجسدية، لياقتك، ونظامك الغذائي ونومك اليوم؟", hint: "1 تعني إهمال كامل، 10 تعني طاقة عالية والتزام صحي ممتاز." },
  career: { question: "إلى أي مدى تشعر بالرضا والإنجاز والنمو في مجالك المهني والوظيفي؟", hint: "1 تعني إحباط وضياع مهني، 10 تعني شغف وترقية وإنتاجية عالية." },
  finance: { question: "ما مدى رضاك عن وضعك المالي، قدرتك على الادخار والاستثمار؟", hint: "1 تعني ديون وتوتر، 10 تعني استقرار مالي وحرية ادخارية." },
  growth: { question: "كم تعطي نفسك في الاستثمار بذاتك (قراءة، تعلّم مهارات جديدة)؟", hint: "1 تعني توقف عن التعلم، 10 تعني نمو واطلاع مستمر." },
  family: { question: "كيف تقيّم جودة علاقتك مع عائلتك والتواصل الإيجابي مع الأهل؟", hint: "1 تعني فجوة في العلاقات، 10 تعني محبة ودعم متبادل." },
  spiritual: { question: "ما مدى رضاك عن جانبك الروحي، المحافظة على العبادات والسكينة؟", hint: "1 تعني تقصير وتشتت، 10 تعني طمأنينة وراحة نفسية عميقة." },
  fun: { question: "هل تمنح نفسك وقتاً كافياً للترويح واستكشاف أوقات ممتعة؟", hint: "1 تعني ضغط عمل دائم، 10 تعني توازن وتجديد نشاط بانتظام." },
  environment: { question: "ما مدى رضاك عن بيئتك المحيطة (تنظيم منزلك، مساحة عملك)؟", hint: "1 تعني فوضى ومشتتات، 10 تعني بيئة مريحة ومنظمة للغاية." }
};

// مكوّن الرسم البياني المباشر (Native SVG Radar Chart) بديل Recharts
function NativeRadarChart({
  domains,
  actualScores,
  targetScores
}: {
  domains: Domain[];
  actualScores: Record<string, number>;
  targetScores: Record<string, number>;
}) {
  const size = 320;
  const center = size / 2;
  const radius = 100;
  const numDomains = domains.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / numDomains) * index - Math.PI / 2;
    const r = (value / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getAxisEndpoint = (index: number) => {
    const angle = (Math.PI * 2 / numDomains) * index - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  const levels = [2, 4, 6, 8, 10];

  const targetPoints = domains.map((d, i) => {
    const val = targetScores[d.id] || actualScores[d.id] || 0;
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  const actualPoints = domains.map((d, i) => {
    const val = actualScores[d.id] || 0;
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* شبكة الأرباع السنوية الستائرية */}
        {levels.map((lvl, idx) => {
          const pts = domains.map((_, i) => {
            const { x, y } = getCoordinates(lvl, i);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={idx}
              points={pts}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray={idx === levels.length - 1 ? "none" : "2,2"}
            />
          );
        })}

        {/* محاور المجالات الـ 8 */}
        {domains.map((_, i) => {
          const { x, y } = getAxisEndpoint(i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}

        {/* طبقة الطموح (بنفسجي/شفاف) */}
        <polygon
          points={targetPoints}
          fill="#a855f7"
          fillOpacity="0.35"
          stroke="#c084fc"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />

        {/* طبقة الواقع المباشر (رمادي) */}
        <polygon
          points={actualPoints}
          fill="#64748b"
          fillOpacity="0.4"
          stroke="#94a3b8"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* عناوين وأيقونات المجالات */}
        {domains.map((d, i) => {
          const angle = (Math.PI * 2 / numDomains) * i - Math.PI / 2;
          const labelRadius = radius + 22;
          const lx = center + labelRadius * Math.cos(angle);
          const ly = center + labelRadius * Math.sin(angle);

          return (
            <text
              key={d.id}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[10px] font-bold fill-slate-300 select-none"
            >
              {d.icon} {d.name}
            </text>
          );
        })}
      </svg>

      {/* مفتاح المخطط */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-slate-500/80 border border-slate-400"></span>
          <span className="text-slate-300">الواقع (الفِعلي)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-purple-500/80 border border-purple-400"></span>
          <span className="text-purple-300">الطموح (الهدف)</span>
        </div>
      </div>
    </div>
  );
}

export default function QuizWizard({
  lifeDomains,
  scores,
  setScores,
  setActiveTab,
  startQuizFresh
}: QuizWizardProps) {
  const [step, setStep] = useState<'quiz' | 'result'>('quiz');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [tempScores, setTempScores] = useState<Record<string, number>>({});
  const [targetAmbitionScores, setTargetAmbitionScores] = useState<Record<string, number>>({});

  const currentDomain = lifeDomains[currentIdx] || lifeDomains[0];
  const questionData = QUIZ_QUESTIONS[currentDomain.id];

  const handleSelectScore = (scoreVal: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const updated = { ...tempScores, [currentDomain.id]: scoreVal };
    setTempScores(updated);

    setTimeout(() => {
      if (currentIdx < lifeDomains.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setIsTransitioning(false);
      } else {
        setScores(updated);
        setTargetAmbitionScores(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mosaed_quiz_scores', JSON.stringify(updated));
        }
        setStep('result');
        setIsTransitioning(false);
      }
    }, 250);
  };

  const avgScore = useMemo(() => {
    const vals = Object.values(scores);
    if (vals.length === 0) return '0.0';
    const sum = vals.reduce((a, b) => a + b, 0);
    return (sum / vals.length).toFixed(1);
  }, [scores]);

  const shareText = `قمت للتو بقياس اتزان عجلة حياتي عبر Mosaed AI وحققت مؤشر اتزان ${avgScore}/10 🎯✨ ابدأ التخطيط لعامك الآن!`;
  const shareUrl = "https://mosaed.ai";

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => alert("تم نسخ النتيجة بنجاح! 📋"));
    } else {
      alert("عذراً، متصفحك لا يدعم النسخ التلقائي.");
    }
  };

  const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  const shareToWhatsApp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10" dir="rtl">
      
      {/* ----------------- المرحلة الأولى: الاختبار ----------------- */}
      {step === 'quiz' && (
        <div className="max-w-4xl mx-auto border border-purple-800/60 bg-slate-900 p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-400">سؤال {currentIdx + 1} من {lifeDomains.length}</span>
              <span className="text-slate-400">{Math.round(((currentIdx + 1) / lifeDomains.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${((currentIdx + 1) / lifeDomains.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4 text-center max-w-2xl mx-auto pt-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-3xl shadow-lg">
              {currentDomain.icon}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {currentDomain.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-bold">
              "{questionData?.question}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              💡 {questionData?.hint}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <div className="text-center text-xs text-slate-400 font-bold mb-2">
              اختر درجتك الحالية لواقعك اليوم (من 1 إلى 10):
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectScore(val)}
                  disabled={isTransitioning}
                  className={`py-3.5 rounded-2xl text-sm font-black font-mono transition cursor-pointer flex flex-col items-center justify-center border ${
                    tempScores[currentDomain.id] === val
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-950 scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500 hover:text-white hover:bg-slate-800'
                  } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>{val}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            <button
              type="button"
              disabled={currentIdx === 0 || isTransitioning}
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              className={`text-xs px-4 py-2 rounded-xl border transition ${
                currentIdx === 0
                  ? 'opacity-30 border-transparent text-slate-600'
                  : 'border-slate-800 text-slate-300 hover:bg-slate-800 cursor-pointer'
              }`}
            >
              ← السؤال السابق
            </button>
          </div>
        </div>
      )}

      {/* ----------------- المرحلة الثانية: الشاشة المدمجة (العجلة + المؤشرات) ----------------- */}
      {step === 'result' && (
        <div className="space-y-8">
          
          {/* الترويسة وأزرار المشاركة */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="text-center md:text-right space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold mb-2">
                <span>🎉</span><span>اكتمل التقييم بنجاح</span>
              </div>
              <h2 className="text-3xl font-black text-white">
                عجلة حياتك الشاملة
              </h2>
              <p className="text-sm text-slate-400">
                مؤشر اتزانك العام هو: <span className="font-bold text-purple-400">{avgScore} / 10</span>. قُم بتعديل "الطموح" لرؤية الفجوة التي سنبني عليها خطتك.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
              <button onClick={shareToTwitter} className="bg-black border border-slate-700 hover:border-slate-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer">
                <span>شارك</span> <span className="text-base">𝕏</span>
              </button>
              <button onClick={shareToWhatsApp} className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer">
                <span>واتساب</span> <span className="text-base">💬</span>
              </button>
              <button onClick={copyToClipboard} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer">
                <span>نسخ</span> <span className="text-base">📋</span>
              </button>
            </div>
          </div>

          {/* الحاوية الرئيسية المقسمة لعمودين */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* العمود الأيمن: مؤشرات التعديل المدمجة (الواقع + الطموح) */}
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2rem] space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">تحديد الفجوة والتطلعات</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600"></span> الواقع</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> الطموح</span>
                </div>
              </div>

              <div className="space-y-5">
                {lifeDomains.map(domain => {
                  const actualVal = scores[domain.id] || 0;
                  const targetVal = targetAmbitionScores[domain.id] || actualVal;

                  return (
                    <div key={domain.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-bold">{domain.icon} {domain.name}</span>
                        <div className="flex gap-3 font-mono text-[10px]">
                          <span className="text-slate-500">الواقع: {actualVal}</span>
                          <span className="text-amber-400 font-bold">الطموح: {targetVal}</span>
                        </div>
                      </div>

                      {/* شريط السحب المزدوج البصري */}
                      <div className="relative w-full">
                        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 pointer-events-none">
                          <div
                            className="absolute top-0 right-0 h-full bg-slate-600/80 z-10 transition-all duration-500"
                            style={{ width: `${(actualVal / 10) * 100}%` }}
                          />
                          <div
                            className="absolute top-0 right-0 h-full opacity-60 z-0 transition-all duration-300"
                            style={{ width: `${(targetVal / 10) * 100}%`, backgroundColor: domain.color }}
                          />
                        </div>

                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={targetVal}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10);
                            setTargetAmbitionScores(prev => ({ ...prev, [domain.id]: val }));
                          }}
                          className="relative w-full h-6 opacity-0 cursor-pointer z-20"
                          dir="rtl"
                        />
                        
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-amber-500 rounded-full shadow-lg pointer-events-none z-10 transition-all duration-75"
                          style={{ right: `calc(${(targetVal / 10) * 100}% - 8px)` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* العمود الأيسر: المخطط البياني العنكبوتي المباشر (Native SVG) */}
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center h-full min-h-[400px]">
              <h3 className="text-base font-bold text-white mb-4 self-start">الرسم البياني المباشر لعجلتك</h3>
              <NativeRadarChart
                domains={lifeDomains}
                actualScores={scores}
                targetScores={targetAmbitionScores}
              />
            </div>

          </div>

          {/* أزرار الإجراءات والانتقال للتخطيط */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-purple-900/60 shadow-xl mt-6">
            <button
              type="button"
              onClick={() => {
                setStep('quiz');
                setCurrentIdx(0);
                setTempScores({});
                startQuizFresh();
              }}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              🔄 إعادة التقييم من الصفر
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('planner')}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-extrabold text-sm px-10 py-4 rounded-2xl transition shadow-xl shadow-purple-950 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>بناء خطتي الذكية بناءً على واقعي 🎯</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}