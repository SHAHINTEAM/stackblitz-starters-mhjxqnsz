"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface AnalyticsDashboardProps {
  lifeDomains: any[];
  scores: Record<string, number>;
}

export default function AnalyticsDashboard({ lifeDomains, scores }: AnalyticsDashboardProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [availableYears] = useState<number[]>([2025, 2026, 2027, 2028]);
  const [selectedQuarter, setSelectedQuarter] = useState<'all' | 'q1' | 'q2' | 'q3' | 'q4'>('q1');
  const [compareMode, setCompareMode] = useState<'quarters' | 'domains' | 'years'>('quarters');

  // البيانات المسترجعة من الشجرة التخطيطية والذاكرة المحلية
  const [planTreeData, setPlanTreeData] = useState<Record<number, any[]>>({});
  const [completedTasksMap, setCompletedTasksMap] = useState<Record<string, boolean>>({});

  // 1. قراءة البيانات الشجرية والمهام المكتوبة من LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rawPlans = localStorage.getItem('mosaed_annual_plans_v2');
      const rawCompleted = localStorage.getItem('mosaed_completed_tasks');

      if (rawPlans) {
        try {
          setPlanTreeData(JSON.parse(rawPlans));
        } catch (e) {
          console.error("Error parsing tree data:", e);
        }
      }

      if (rawCompleted) {
        try {
          setCompletedTasksMap(JSON.parse(rawCompleted));
        } catch (e) {
          console.error("Error parsing completed tasks:", e);
        }
      }
    }
  }, []);

  // حفظ حالة إنجاز المهام فور التعديل
  const toggleTaskDone = (taskId: string) => {
    setCompletedTasksMap(prev => {
      const updated = { ...prev, [taskId]: !prev[taskId] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('mosaed_completed_tasks', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // 2. تصفية واستخراج المهام الشجرية للسنة والربع المحددين
  const currentYearTree = planTreeData[selectedYear] || [];

  const activeQuarterTasks = useMemo(() => {
    const taskList: { id: string; text: string; domainId: string; domainName: string; quarterTitle: string; done: boolean }[] = [];

    currentYearTree.forEach(domain => {
      domain.quarters.forEach((q: any) => {
        if (selectedQuarter === 'all' || q.id === selectedQuarter) {
          q.actionTasks.forEach((taskText: string, tIdx: number) => {
            if (taskText.trim()) {
              const taskId = `${selectedYear}-${domain.domainId}-${q.id}-${tIdx}`;
              taskList.push({
                id: taskId,
                text: taskText,
                domainId: domain.domainId,
                domainName: domain.domainName,
                quarterTitle: q.title,
                done: !!completedTasksMap[taskId]
              });
            }
          });
        }
      });
    });

    return taskList;
  }, [currentYearTree, selectedQuarter, selectedYear, completedTasksMap]);

  const completedCount = activeQuarterTasks.filter(t => t.done).length;
  const totalTasksCount = activeQuarterTasks.length || 1;
  const completionRate = Math.round((completedCount / totalTasksCount) * 100);

  // 3. حسابات المقارنات التحليلية للمخطط البياني (Quarters / Domains / Years)
  
  // أ. مقارنة الأرباع للسنة المختارة
  const quarterStatsData = useMemo(() => {
    const quarters = [
      { id: 'q1', label: 'الربع الأول (Q1)' },
      { id: 'q2', label: 'الربع الثاني (Q2)' },
      { id: 'q3', label: 'الربع الثالث (Q3)' },
      { id: 'q4', label: 'الربع الرابع (Q4)' }
    ];

    return quarters.map(q => {
      let qTotal = 0;
      let qDone = 0;

      currentYearTree.forEach(domain => {
        const foundQ = domain.quarters.find((item: any) => item.id === q.id);
        if (foundQ) {
          foundQ.actionTasks.forEach((tText: string, tIdx: number) => {
            if (tText.trim()) {
              qTotal++;
              const tId = `${selectedYear}-${domain.domainId}-${q.id}-${tIdx}`;
              if (completedTasksMap[tId]) qDone++;
            }
          });
        }
      });

      const rate = qTotal > 0 ? Math.round((qDone / qTotal) * 100) : 0;
      return { ...q, total: qTotal, done: qDone, rate };
    });
  }, [currentYearTree, selectedYear, completedTasksMap]);

  // ب. مقارنة المجالات الـ 8 للسنة المختارة
  const domainStatsData = useMemo(() => {
    return lifeDomains.map(domain => {
      let dTotal = 0;
      let dDone = 0;

      const matchedInTree = currentYearTree.find(d => d.domainId === domain.id);
      if (matchedInTree) {
        matchedInTree.quarters.forEach((q: any) => {
          q.actionTasks.forEach((tText: string, tIdx: number) => {
            if (tText.trim()) {
              dTotal++;
              const tId = `${selectedYear}-${domain.id}-${q.id}-${tIdx}`;
              if (completedTasksMap[tId]) dDone++;
            }
          });
        });
      }

      const rate = dTotal > 0 ? Math.round((dDone / dTotal) * 100) : (scores[domain.id] ? scores[domain.id] * 10 : 50);
      return {
        id: domain.id,
        name: domain.name,
        color: domain.color,
        icon: domain.icon,
        total: dTotal,
        done: dDone,
        rate
      };
    });
  }, [lifeDomains, currentYearTree, selectedYear, completedTasksMap, scores]);

  // ج. مقارنة السنوات المتاحة
  const yearStatsData = useMemo(() => {
    return availableYears.map(yr => {
      const yrTree = planTreeData[yr] || [];
      let yrTotal = 0;
      let yrDone = 0;

      yrTree.forEach(domain => {
        domain.quarters.forEach((q: any) => {
          q.actionTasks.forEach((tText: string, tIdx: number) => {
            if (tText.trim()) {
              yrTotal++;
              const tId = `${yr}-${domain.domainId}-${q.id}-${tIdx}`;
              if (completedTasksMap[tId]) yrDone++;
            }
          });
        });
      });

      const rate = yrTotal > 0 ? Math.round((yrDone / yrTotal) * 100) : 0;
      return { year: yr, total: yrTotal, done: yrDone, rate };
    });
  }, [availableYears, planTreeData, completedTasksMap]);

  // د. العثور على أفضل وأقل أداء في المخطط البياني
  const bestQuarter = useMemo(() => {
    const sorted = [...quarterStatsData].sort((a, b) => b.rate - a.rate);
    return sorted[0];
  }, [quarterStatsData]);

  const bestDomain = useMemo(() => {
    const sorted = [...domainStatsData].sort((a, b) => b.rate - a.rate);
    return sorted[0];
  }, [domainStatsData]);

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* رأس الصفحة مع محددات السنة والربع السنوي */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-bold">
            <span>📊</span>
            <span>متابعة الشجرة التكتيكية والمقارنات</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            تحليل الأداء وتتبع العادات <span className="text-purple-400">لعام {selectedYear}</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            مُخططات بيانية مقارنة وربط تلقائي مع العادات التي قمت ببرمجتها في الخطة السنوية.
          </p>
        </div>

        {/* أزرار تحديد السنة والأرباع */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* محدد السنة */}
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center justify-center shrink-0">
            {availableYears.map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                  selectedYear === yr ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* محدد الربع السنوي */}
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center justify-center shrink-0">
            <button
              type="button"
              onClick={() => setSelectedQuarter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedQuarter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              السنة كاملة
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuarter('q1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedQuarter === 'q1' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Q1
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuarter('q2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedQuarter === 'q2' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Q2
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuarter('q3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedQuarter === 'q3' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Q3
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuarter('q4')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedQuarter === 'q4' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Q4
            </button>
          </div>
        </div>
      </div>

      {/* بطاقات الإحصاءات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>معدل الإنجاز للجهة المختارة</span>
            <span>📈</span>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{completionRate}%</div>
          <div className="text-[10px] text-slate-500">مكتمل {completedCount} من {activeQuarterTasks.length} إجراء</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>السنة التخطيطية الحالية</span>
            <span>📅</span>
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono">عام {selectedYear}</div>
          <div className="text-[10px] text-slate-500">نطاق: {selectedQuarter === 'all' ? 'جميع الأرباع' : selectedQuarter.toUpperCase()}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>أفضل ربع أداءً ({selectedYear})</span>
            <span>🏆</span>
          </div>
          <div className="text-xl font-black text-amber-400 truncate">{bestQuarter?.label || 'Q1'}</div>
          <div className="text-[10px] text-slate-500">معدل إنجاز: {bestQuarter?.rate || 0}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>أعلى ركن التزاماً</span>
            <span>🎯</span>
          </div>
          <div className="text-lg font-bold text-emerald-300 truncate">{bestDomain?.name || 'الصحة'}</div>
          <div className="text-[10px] text-slate-500">نسبة الالتزام: {bestDomain?.rate || 0}%</div>
        </div>
      </div>

      {/* المخطط البياني التفاعلي للمقارنات (Comparison Chart Component) */}
      <div className="border border-purple-800/60 bg-slate-900 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>📊</span>
              <span>المخطط البياني للمقارنات التحليلية</span>
            </h3>
            <p className="text-xs text-slate-400">تحليل المخرجات ومقارنة مؤشرات الأداء السلوكي</p>
          </div>

          {/* أزرار التنقل بين أنماط المقارنة */}
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-2xl flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setCompareMode('quarters')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                compareMode === 'quarters' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              مقارنة الأرباع (Q1-Q4)
            </button>
            <button
              type="button"
              onClick={() => setCompareMode('domains')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                compareMode === 'domains' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              مقارنة المجالات الـ 8
            </button>
            <button
              type="button"
              onClick={() => setCompareMode('years')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                compareMode === 'years' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              مقارنة السنوات
            </button>
          </div>
        </div>

        {/* 1. عرض مخطط مقارنة الأرباع */}
        {compareMode === 'quarters' && (
          <div className="space-y-6 pt-2">
            <div className="text-xs text-purple-300 font-bold">
              مقارنة نسب الإنجاز السلوكي بين الأرباع الأربعة لعام {selectedYear}:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end h-56 bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
              {quarterStatsData.map(qStat => (
                <div key={qStat.id} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="font-mono text-xs font-black text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/60">
                    {qStat.rate}%
                  </span>
                  
                  {/* عمود المخطط البياني */}
                  <div className="w-full max-w-[48px] bg-slate-900 rounded-t-xl overflow-hidden h-36 flex items-end border border-slate-800 group-hover:border-purple-500/60 transition">
                    <div
                      className="w-full bg-gradient-to-t from-purple-800 via-purple-600 to-pink-500 transition-all duration-700 rounded-t-lg"
                      style={{ height: `${Math.max(qStat.rate, 6)}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-bold text-slate-300 text-center">{qStat.label}</span>
                  <span className="text-[9px] text-slate-500">{qStat.done}/{qStat.total} مهمة</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. عرض مخطط مقارنة المجالات الـ 8 */}
        {compareMode === 'domains' && (
          <div className="space-y-4 pt-2">
            <div className="text-xs text-purple-300 font-bold">
              مقارنة التزام الأداء عبر مجالات حياتك الـ 8 لعام {selectedYear}:
            </div>

            <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
              {domainStatsData.map(dStat => (
                <div key={dStat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <span>{dStat.icon}</span>
                      <span>{dStat.name}</span>
                    </div>
                    <span className="font-mono font-bold" style={{ color: dStat.color }}>
                      {dStat.rate}% ({dStat.done}/{dStat.total} مهمة)
                    </span>
                  </div>

                  {/* شريط المخطط الأفقي */}
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(dStat.rate, 3)}%`, backgroundColor: dStat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. عرض مخطط مقارنة السنوات */}
        {compareMode === 'years' && (
          <div className="space-y-6 pt-2">
            <div className="text-xs text-purple-300 font-bold">
              مقارنة الإنجاز السنوي المتصاعد عبر الأعوام التخطيطية:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end h-56 bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
              {yearStatsData.map(yStat => (
                <div key={yStat.year} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="font-mono text-xs font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    {yStat.rate}%
                  </span>

                  {/* عمود المخطط البياني للسنوات */}
                  <div className="w-full max-w-[56px] bg-slate-900 rounded-t-xl overflow-hidden h-36 flex items-end border border-slate-800 group-hover:border-emerald-500/60 transition">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-800 via-emerald-600 to-teal-400 transition-all duration-700 rounded-t-lg"
                      style={{ height: `${Math.max(yStat.rate, 6)}%` }}
                    />
                  </div>

                  <span className="text-xs font-bold font-mono text-slate-200">عام {yStat.year}</span>
                  <span className="text-[9px] text-slate-500">{yStat.done}/{yStat.total} عادة</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* قائمة العادات والمهام المكتوبة في الشجرة لعام (Year) و (Quarter) */}
      <div className="border border-slate-800 bg-slate-900 p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              قائمة العادات والمهام الشجرية لعام {selectedYear} ({selectedQuarter === 'all' ? 'جميع الأرباع' : selectedQuarter.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400">انقر على أي عادة لتأكّيد توثيقها وحساب نسبة الإنجاز فوراً</p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40 self-start sm:self-auto">
            {completedCount} / {activeQuarterTasks.length} مكتمل
          </span>
        </div>

        {activeQuarterTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeQuarterTasks.map(task => {
              const matchedDomain = lifeDomains.find(d => d.id === task.domainId);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTaskDone(task.id)}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition select-none ${
                    task.done
                      ? 'bg-slate-950/80 border-emerald-900/50 text-slate-200'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border text-xs shrink-0 ${
                        task.done ? 'bg-emerald-600 border-emerald-500 text-white font-bold' : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {task.done && '✓'}
                    </div>
                    <div className="space-y-0.5">
                      <div className={`text-xs ${task.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                        {task.text}
                      </div>
                      <div className="text-[10px] text-slate-500">{task.quarterTitle}</div>
                    </div>
                  </div>

                  {matchedDomain && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 mr-2"
                      style={{ color: matchedDomain.color, borderColor: `${matchedDomain.color}30`, backgroundColor: `${matchedDomain.color}10` }}
                    >
                      {matchedDomain.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <div>📍 لا توجد عادات أو إجراءات مسجلة لهذه الفترة.</div>
            <p className="text-slate-600">
              قم بزيارة تبويب <span className="text-purple-400 font-bold">"اصنع خطتك السنوية"</span> وتدوين الإجراءات والعادات اليومية لعام {selectedYear}.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}