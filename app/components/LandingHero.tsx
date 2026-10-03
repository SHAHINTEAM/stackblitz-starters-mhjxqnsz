"use client";

import React from 'react';

interface Domain {
  id: string;
  name: string;
  color: string;
  icon: string;
  desc: string;
}

interface LandingHeroProps {
  lifeDomains: Domain[];
  setActiveTab: (tab: string) => void;
  startQuizFresh: () => void;
}

export default function LandingHero({ lifeDomains, setActiveTab, startQuizFresh }: LandingHeroProps) {
  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 max-w-6xl mx-auto" dir="rtl">
      {/* قسم الهيرو الرئيسي */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-bold shadow-lg shadow-purple-950/50">
          <span>✨</span>
          <span>الذكاء الاصطناعي لتطوير جودة الحياة</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
          اكتشف اتزان حياتك مع <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
            منصة Mosaed AI
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          أول منصة كوتشينغ تفاعلية تجمع بين نموذج عجلة الحياة الـ 8 وتحليلات الذكاء الاصطناعي لمساعدتك في قياس اتزانك السلوكي والوصول لأهدافك.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={startQuizFresh}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl transition shadow-xl shadow-purple-950/80 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ابدأ التقييم المباشر مجاناً</span>
            <span>⚡</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blog')}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm px-7 py-4 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>📖</span>
            <span>استكشف المدونة والمعرفة</span>
          </button>
        </div>
      </div>

      {/* أركان عجلة الحياة الثمانية */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">أركان عجلة الحياة الثمانية 🧭</h2>
          <p className="text-slate-400 text-xs sm:text-sm">تقييم شامل يغطي كافة جوانب حياتك الشخصية والمهنية والروحية</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lifeDomains.map(domain => (
            <div
              key={domain.id}
              className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-purple-500/50 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner"
                  style={{ backgroundColor: `${domain.color}20` }}
                >
                  {domain.icon}
                </div>
                <div className="font-bold text-white text-sm">{domain.name}</div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{domain.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* قسم الأسئلة الشائعة */}
      <div className="border border-slate-800 bg-slate-900/60 p-6 sm:p-10 rounded-3xl space-y-6">
        <h3 className="text-xl font-bold text-white text-center">الأسئلة الشائعة حول المنصة ❓</h3>
        <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="font-bold text-purple-300">كيف تساعدني منصة Mosaed AI؟</div>
            <p className="text-slate-400 leading-relaxed">تقدم لك المنصة تحليلاً لحظياً لمدى التوازن بين أركان حياتك وتساعدك على تحويل أهدافك الكبيرة إلى عادات يومية تكتيكية.</p>
          </div>
          <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="font-bold text-purple-300">هل التقييم والاختبار المبدئي مجاني؟</div>
            <p className="text-slate-400 leading-relaxed">نعم، يمكنك القيام باختبار عجلة الحياة مجاناً والحصول على رسمك البياني فوراً دون الحاجة لبطاقة إئتمان.</p>
          </div>
        </div>
      </div>
    </div>
  );
}