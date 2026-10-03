"use client";

import React, { useState } from 'react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  startQuizFresh: () => void;
}

export default function Footer({ setActiveTab, startQuizFresh }: FooterProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 pb-8 mt-16 text-xs" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        
        <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-800/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-purple-950/50">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl md:text-2xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
              هل تحتاج توجيه مخصص لحياتك؟ 🤝
            </h3>
            <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
              احجز مكالمة أو جلسة استشارية مبدئية مع مستشاري المنصة لمراجعة أركان عجلة حياتك وبناء خطة العمل الأولى.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shrink-0 shadow-lg shadow-purple-950 transition cursor-pointer"
          >
            <span>📞</span>
            <span>احجز استشارة الآن ←</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-sm">🧭</div>
              <span>Mosaed AI Platform</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              منصة الكوتشينغ الأولى التي تجمع بين أداة عجلة الحياة وقوة الذكاء الاصطناعي مع تحليلات تجارب الأقران.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">عن البرنامج</h4>
            <ul className="space-y-2 text-xs">
              <li><button type="button" onClick={() => setActiveTab('landing')} className="hover:text-purple-400 transition cursor-pointer">فلسفة عجلة الحياة</button></li>
              <li><button type="button" onClick={() => setActiveTab('blog')} className="hover:text-purple-400 transition cursor-pointer">المدونة المعرفية والأبحاث</button></li>
              <li><button type="button" onClick={() => setActiveTab('pricing')} className="hover:text-purple-400 transition cursor-pointer">لماذا منصة Mosaed AI؟</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">الروابط السريعة</h4>
            <ul className="space-y-2 text-xs">
              <li><button type="button" onClick={startQuizFresh} className="hover:text-purple-400 transition cursor-pointer">جرب اختباراً مجانياً</button></li>
              <li><button type="button" onClick={() => setActiveTab('dashboard')} className="hover:text-purple-400 transition cursor-pointer">لوحة التحكم والعجلة</button></li>
              <li><button type="button" onClick={() => setActiveTab('challenges')} className="hover:text-purple-400 transition cursor-pointer">التحديات والمسابقات</button></li>
              <li><button type="button" onClick={() => setActiveTab('ideas')} className="hover:text-purple-400 transition cursor-pointer">بنك الأفكار</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">المساعدة والدعم</h4>
            <ul className="space-y-2 text-xs">
              <li><button type="button" onClick={() => setActiveTab('landing')} className="hover:text-purple-400 transition cursor-pointer">الأسئلة الشائعة (FAQ)</button></li>
              <li><button type="button" onClick={() => setShowModal(true)} className="hover:text-purple-400 transition cursor-pointer">احجز مكالمة / استشارة</button></li>
              <li><a href="#" className="hover:text-purple-400 transition">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">شروط الاستخدام</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div>جميع الحقوق محفوظة © {new Date().getFullYear()} Mosaed AI Coaching School</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition">تويتر (X)</a>
            <a href="#" className="hover:text-slate-300 transition">إنستغرام</a>
            <a href="#" className="hover:text-slate-300 transition">لينكد إن</a>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 text-center shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 text-purple-300 mx-auto flex items-center justify-center text-xl">
              🤝
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">حجز جلسة استشارية أولية</h3>
              <p className="text-xs text-slate-400">سيتم فتح جدول المواعيد المباشرة قريباً لمطابقتك مع أفضل كوتش معتمد في مجالك.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
