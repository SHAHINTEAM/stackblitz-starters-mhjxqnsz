"use client";

import React, { useState, useEffect } from 'react';

interface Domain {
  id: string;
  name: string;
  color: string;
  icon: string;
  desc: string;
}

interface ReportPreviewProps {
  lifeDomains: Domain[];
  scores: Record<string, number>;
  setActiveTab: (tab: string) => void;
}

export default function ReportPreview({ lifeDomains, scores, setActiveTab }: ReportPreviewProps) {
  const [plansData, setPlansData] = useState<Record<number, any>>({});
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [quizScores, setQuizScores] = useState<Record<string, number>>(scores);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScores = localStorage.getItem('mosaed_quiz_scores');
      if (savedScores) {
        try { setQuizScores(JSON.parse(savedScores)); } catch (e) { console.error(e); }
      }

      const savedPlans = localStorage.getItem('mosaed_annual_plans_v2');
      if (savedPlans) {
        try {
          const parsed = JSON.parse(savedPlans);
          setPlansData(parsed);
          const years = Object.keys(parsed).map(Number).sort();
          if (years.length > 0) setSelectedYear(years[years.length - 1]);
        } catch (e) { console.error(e); }
      }
    }
  }, [scores]);

  const currentYearPlan = plansData[selectedYear] || [];

  // امر طباعة وتحويل إلى PDF بدون أخطاء مكتبات
  const handlePrintPDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const avgScore = (Object.values(quizScores).length > 0
    ? (Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length).toFixed(1)
    : '0.0');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8" dir="rtl">
      
      {/* أزرار التحكم الخارجي (تختفي تلقائياً عند الطباعة أو التصدير لـ PDF) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('planner')}
            className="text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            ← العودة لصانع الخطط
          </button>
          <span className="text-xs text-purple-300 font-bold bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800">
            معاينة تقرير عام {selectedYear} المطبوع (Pro)
          </span>
        </div>

        <button
          onClick={handlePrintPDF}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🖨️</span>
          <span>حفظ وتصدير التقرير بملف PDF</span>
        </button>
      </div>

      {/* 📄 جسم التقرير المطبوع المطابق للمواصفات الرسمية */}
      <div className="bg-slate-900 print:bg-white print:text-slate-900 border print:border-none border-purple-500/20 rounded-[2rem] p-8 sm:p-12 shadow-2xl space-y-10">
        
        {/* ترويسة التقرير */}
        <div className="border-b print:border-slate-300 border-slate-800 pb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-2xl font-black text-white print:text-slate-900">
              Mosaed <span className="text-purple-400 print:text-purple-700">AI</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white print:text-slate-900">
              التقرير التكتيكي والسنوي الشامل لعام {selectedYear}
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600">
              وثيقة استراتيجية مصممة خصيصاً لمتابعة عجلة الحياة والأهداف السنوية والأرباع الأربعة.
            </p>
          </div>

          <div className="text-left font-mono">
            <div className="text-3xl font-black text-purple-400 print:text-purple-700">{avgScore}</div>
            <div className="text-[10px] text-slate-400 print:text-slate-600 font-sans">مؤشر الاتزان العام</div>
          </div>
        </div>

        {/* ملخص تقييم عجلة الحياة */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-purple-300 print:text-purple-800 flex items-center gap-2">
            <span>🎯</span><span>أولاً: تقييم واقع عجلة الحياة (المرجع الاستراتيجي)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {lifeDomains.map(d => {
              const scoreVal = quizScores[d.id] || 5;
              return (
                <div key={d.id} className="bg-slate-950 print:bg-slate-100 p-3 rounded-xl border print:border-slate-300 border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 print:text-slate-800">
                    <span>{d.icon} {d.name}</span>
                    <span className="font-mono" style={{ color: d.color }}>{scoreVal}/10</span>
                  </div>
                  <div className="w-full bg-slate-900 print:bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(scoreVal / 10) * 100}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* خطط المجالات الـ 8 والأرباع السنوية */}
        <div className="space-y-8 pt-4">
          <h2 className="text-sm font-bold text-purple-300 print:text-purple-800 flex items-center gap-2">
            <span>🗓</span><span>ثانياً: الشجرة التخطيطية والأهداف الأسبوعية واليومية لعام {selectedYear}</span>
          </h2>

          {currentYearPlan.length > 0 ? (
            <div className="space-y-6">
              {currentYearPlan.map((dPlan: any) => {
                const matchedDomain = lifeDomains.find(d => d.id === dPlan.domainId);
                return (
                  <div key={dPlan.domainId} className="bg-slate-950 print:bg-slate-50 p-5 rounded-2xl border print:border-slate-300 border-slate-800 space-y-4 break-inside-avoid">
                    <div className="flex items-center justify-between border-b print:border-slate-200 border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2 font-bold text-white print:text-slate-900 text-sm">
                        <span>{matchedDomain?.icon || '🧭'}</span>
                        <span>{dPlan.domainName}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-400 print:text-purple-700">
                        الهدف السنوي: {dPlan.annualGoal || 'غير محدد'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {dPlan.quarters.map((q: any) => (
                        <div key={q.id} className="bg-slate-900 print:bg-white p-3 rounded-xl border print:border-slate-200 border-slate-800/60 space-y-2 text-xs">
                          <div className="font-bold text-amber-300 print:text-amber-800 flex items-center justify-between">
                            <span>{q.title}</span>
                            <span className="text-[10px] text-slate-400 print:text-slate-500 font-normal">{q.quarterGoal ? 'مبرمج' : 'مفتوح'}</span>
                          </div>
                          <p className="text-[11px] text-slate-200 print:text-slate-800 font-bold">{q.quarterGoal || 'لا يوجد هدف ربع سنوي محدد.'}</p>
                          
                          {q.actionTasks.filter((t: string) => t.trim()).length > 0 && (
                            <div className="space-y-1 pt-1 border-t print:border-slate-100 border-slate-800/60">
                              <span className="text-[10px] text-slate-400 print:text-slate-500 block font-bold">الإجراءات والعادات اليومية:</span>
                              <ul className="list-disc list-inside text-[10px] text-slate-300 print:text-slate-700 space-y-0.5">
                                {q.actionTasks.filter((t: string) => t.trim()).map((task: string, ti: number) => (
                                  <li key={ti}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              لا توجد بيانات تخطيطية مبرمجة لعام {selectedYear} بعد.
            </div>
          )}
        </div>

        {/* توقيع وختم التقرير */}
        <div className="border-t print:border-slate-200 border-slate-800 pt-6 flex items-center justify-between text-[10px] text-slate-500">
          <span>تم توليد التقرير بواسطة Mosaed AI • حقوق الطبع محفوظة</span>
          <span>تاريخ التصدير: {new Date().toLocaleDateString('ar-SA')}</span>
        </div>

      </div>
    </div>
  );
}