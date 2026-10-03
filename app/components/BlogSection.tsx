"use client";

import React, { useState } from 'react';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  readTime: string;
  date: string;
  badge: string;
  color: string;
}

const ARTICLES: Article[] = [
  {
    id: 'strategic-goal-cascade',
    title: 'الإطار الشامل لتدرج الأهداف: من الرؤية الخمسية إلى العادة اليومية',
    subtitle: 'كيف تجسر فجوة التنفيذ وتربط أركان عجلة الحياة بنظام تخطيطي من ثلاثة مستويات: استراتيجي، تكتيكي ربع سنوي، وإجرائي يومي.',
    category: 'التخطيط والإنتاجية',
    icon: '🧭',
    readTime: '6 دقائق قراءة',
    date: 'أكتوبر 2026',
    badge: 'دليل تطبيقي شامل ✨',
    color: '#8b5cf6'
  },
  {
    id: 'peer-benchmarking-habits',
    title: 'سيكولوجيا مقارنة الأقران: لماذا نلتزم بالروتين عندما نرى من يشبهنا؟',
    subtitle: 'دراسة تحليلية لكيفية استغلال حكمة الأقران والبيانات المشتركة للتغلب على التسويف والمقاومة العقلية.',
    category: 'سيكولوجيا العادات',
    icon: '👥',
    readTime: '4 دقائق قراءة',
    date: 'سبتمبر 2026',
    badge: 'مقالة سلوكية',
    color: '#3b82f6'
  },
  {
    id: 'wheel-of-life-mastery',
    title: 'سر العجلة التي تدور: لماذا تفشل الخطط التي تركز على مجال واحد فقط؟',
    subtitle: 'علاقة الاحتراق المهني بإهمال الصحة والعلاقات، وكيف يعيد التقييم الدوري التوازن المفقود لحياتك.',
    category: 'التوازن الروحي والبدني',
    icon: '⚖️',
    readTime: '5 دقائق قراءة',
    date: 'أغسطس 2026',
    badge: 'جودة الحياة',
    color: '#10b981'
  },
  {
    id: 'lead-vs-lag-metrics',
    title: 'معادلة النجاح الخفية: مؤشرات السلوك اليومي (Lead) مقابل نتائج الغد (Lag)',
    subtitle: 'لماذا يجب ألا تراقب الميزان أو رصيد البنك كل يوم، وما هو المقياس الوحيد الذي يضمن وصولك لهدفك؟',
    category: 'التخطيط والإنتاجية',
    icon: '📈',
    readTime: '5 دقائق قراءة',
    date: 'يوليو 2026',
    badge: 'منهجية SMART',
    color: '#f59e0b'
  }
];

export default function BlogSection({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  const selectedArticle = ARTICLES.find(a => a.id === selectedArticleId);
  const categories = ['الكل', 'التخطيط والإنتاجية', 'سيكولوجيا العادات', 'التوازن الروحي والبدني'];

  const filteredArticles = activeCategory === 'الكل'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      const text = `دليل الأهداف الاستراتيجية والتكتيكية على مدونة Mosaed AI:\n${url}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-10" dir="rtl">
      {!selectedArticleId ? (
        <div className="space-y-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-bold shadow-lg shadow-purple-950/40">
              <span>📖</span>
              <span>المدونة المعرفية وأدلة التوازن</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              أفكار ونماذج منهجية لبناء <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                حياة متزنة ومنتجة
              </span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
              اختر أي مقال أو دليل لتستكشف أحدث أبحاث الكوتشينغ وعلم النفس السلوكي وأطر التخطيط الذكية المطبقة في المنصة.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap pb-2 border-b border-slate-800">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map(article => (
              <div
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className="group bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 p-6 sm:p-7 rounded-3xl space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/30 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/5 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${article.color}20` }}
                    >
                      <span>{article.icon}</span>
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                      {article.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-purple-400">
                      {article.category} • {article.readTime}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {article.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>{article.date}</span>
                  <span className="text-purple-400 font-bold group-hover:translate-x-[-4px] transition flex items-center gap-1">
                    <span>قراءة المقال</span>
                    <span>←</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <article className="border border-slate-800 bg-slate-900/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
            <button
              type="button"
              onClick={() => setSelectedArticleId(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md"
            >
              <span>→</span>
              <span>العودة إلى قائمة المدونات</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 border border-purple-900/60 bg-purple-950/40 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <span>🔗</span>
              <span>مشاركة المقال</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-bold">
                {selectedArticle?.category}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{selectedArticle?.readTime}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{selectedArticle?.date}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {selectedArticle?.title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {selectedArticle?.subtitle}
            </p>
          </div>

          {selectedArticleId === 'strategic-goal-cascade' ? (
            <div className="space-y-10 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/80 pt-8">
              <section className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-purple-400 font-mono">01.</span>
                  <span>معضلة فجوة التنفيذ (The Execution Gap)</span>
                </h3>
                <p>
                  معظم من يفشلون في التخطيط الشخصي ينحصرون في طرفين متناقضين: إما أحلام استراتيجية لخمس سنوات دون أي خطوة اليوم، أو قائمة مهام يومية مكدسة دون بوصلة واضحة. الحل يكمن في الربط الهرمي بين ثلاثة مستويات:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-purple-900/50 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 mx-auto flex items-center justify-center text-lg">🔭</div>
                    <div className="text-base font-bold text-purple-300">1. استراتيجي</div>
                    <div className="text-[11px] text-slate-400">3 - 5 سنوات</div>
                    <div className="text-[11px] text-slate-500 pt-1">يجيب: أين أريد أن أكون؟</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-900/50 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 mx-auto flex items-center justify-center text-lg">🎯</div>
                    <div className="text-base font-bold text-indigo-300">2. تكتيكي (OKRs)</div>
                    <div className="text-[11px] text-slate-400">ربع سنوي (90 يوماً)</div>
                    <div className="text-[11px] text-slate-500 pt-1">يجيب: ما هي الأرقام والمعالم؟</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/50 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 mx-auto flex items-center justify-center text-lg">⚡</div>
                    <div className="text-base font-bold text-emerald-300">3. إجرائي</div>
                    <div className="text-[11px] text-slate-400">أسبوعي ويومي</div>
                    <div className="text-[11px] text-slate-500 pt-1">يجيب: ماذا سأفعل اليوم والآن؟</div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-purple-400 font-mono">02.</span>
                  <span>المعادلة الذهبية: مؤشرات النتيجة (Lag) ومؤشرات السلوك (Lead)</span>
                </h3>
                <p>
                  لكي تقرأ التحليلات في المنصة أداءك بدقة، لا نعتمد فقط على النتيجة النهائية بل نراقب السلوك الذي يقود لها:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <span>📊</span>
                      <span>مؤشر النتيجة (Lag Measure)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      مثل: ادخار 20,000 ريال، أو إنقاص الوزن 5 كجم. لا يمكنك التحكم فيه في هذه اللحظة، بل تراه فقط بعد انقضاء الربع السنوي.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/40 bg-emerald-950/10 space-y-2">
                    <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                      <span>🏃‍♂️</span>
                      <span>مؤشر السلوك (Lead Measure)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      مثل: تسجيل المصاريف اليومية في أقل من دقيقتين، أو المشي 30 دقيقة يومياً. إذا بلغت نسبة إنجاز سلوكك 85% فما فوق، تحققت النتيجة حتماً.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-purple-400 font-mono">03.</span>
                  <span>نموذج عملي واقعي: مجال المال والاستثمار</span>
                </h3>
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-purple-300">الرؤية الخمسية (استراتيجي):</div>
                  <p className="text-xs text-slate-300">بناء صندوق طوارئ ومحفظة استثمارية بقيمة 300,000 ريال بحلول 2031.</p>
                  
                  <div className="text-xs font-bold text-indigo-300 pt-2">الهدف التكتيكي (Q1 - 90 يوماً):</div>
                  <p className="text-xs text-slate-300">توفير أول 15,000 ريال في الصندوق وخفض المصاريف الاستهلاكية بنسبة 20%.</p>

                  <div className="text-xs font-bold text-emerald-400 pt-2">الإجراءات اليومية والأسبوعية (Lead Measures):</div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li>(يومي): تسجيل وتدقيق كافة المصاريف الشخصية قبل النوم.</li>
                    <li>(أسبوعي): مراجعة السقف المالي للمصروفات كل جمعة.</li>
                    <li>(شهري): استقطاع 5,000 ريال تلقائياً في يوم نزول الراتب.</li>
                  </ul>
                </div>
              </section>

              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/90 via-purple-900/40 to-slate-900 border border-purple-800/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center sm:text-right">
                  <div className="font-extrabold text-white text-base sm:text-lg">جاهز لاختبار اتزان عجلة حياتك وتطبيق هذا النموذج؟</div>
                  <div className="text-xs text-slate-300">ابدأ بالاختبار المبدئي السريع لتحديد أضعف مجالاتك وبناء أول خطة ربع سنوية.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl transition shadow-lg shadow-purple-950 shrink-0 cursor-pointer"
                >
                  ابدأ الاختبار التفاعلي الآن ⚡
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <div className="text-4xl">⏳</div>
              <div className="text-lg font-bold text-white">المقالة قيد النشر والمراجعة البحثية</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                يقوم فريق المحتوى والكوتشينغ بوضع اللمسات الأخيرة لنشر هذا الدليل قريباً على المنصة.
              </p>
              <button
                type="button"
                onClick={() => setSelectedArticleId(null)}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
              >
                العودة لتصفح المقالات المتاحة
              </button>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
