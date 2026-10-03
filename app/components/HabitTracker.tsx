"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface Domain {
  id: string;
  name: string;
  color: string;
  icon: string;
  desc: string;
}

interface HabitTrackerProps {
  lifeDomains: Domain[];
}

interface Habit {
  id: string;
  text: string;
  domainId: string;
  targetPerDay: number;
}

interface Trophy {
  id: string;
  title: string;
  icon: string;
  desc: string;
  condition: (points: number, streak: number, totalDone: number) => boolean;
}

const TROPHIES: Trophy[] = [
  { id: 'first_step', title: 'البداية القوية', icon: '🌱', desc: 'أنجزت أول عادة لك', condition: (p, s, total) => total > 0 },
  { id: 'streak_3', title: 'شعلة الاستمرار', icon: '🔥', desc: 'التزام متتالي لـ 3 أيام', condition: (p, s, total) => s >= 3 },
  { id: 'streak_7', title: 'بطل الأسبوع', icon: '⚡', desc: 'التزام متتالي لـ 7 أيام', condition: (p, s, total) => s >= 7 },
  { id: 'points_500', title: 'المحفظة الفضية', icon: '🥈', desc: 'جمعت 500 نقطة', condition: (p, s, total) => p >= 500 },
  { id: 'points_1000', title: 'المحفظة الذهبية', icon: '🏆', desc: 'جمعت 1000 نقطة', condition: (p, s, total) => p >= 1000 },
];

const MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const DAY_NAMES_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function HabitTracker({ lifeDomains }: HabitTrackerProps) {
  const todayDate = new Date();
  const todayYear = todayDate.getFullYear();
  const todayMonth = todayDate.getMonth();
  const todayDay = todayDate.getDate();
  
  const [viewMode, setViewMode] = useState<'daily' | 'matrix'>('daily');

  const [selectedYear, setSelectedYear] = useState<number>(todayYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(todayMonth);
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const [selectedWeek, setSelectedWeek] = useState<string>('all'); // 'all', 'w1', 'w2', 'w3', 'w4'
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  const daysInMonth = useMemo(() => new Date(selectedYear, selectedMonth + 1, 0).getDate(), [selectedYear, selectedMonth]);
  const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [daysInMonth, selectedDay]);

  // تقسيم الشاشات إلى 4 أسابيع ثابتة ونظيفة
  const filteredDaysArray = useMemo(() => {
    if (selectedWeek === 'w1') return daysArray.filter(d => d >= 1 && d <= 7);
    if (selectedWeek === 'w2') return daysArray.filter(d => d >= 8 && d <= 14);
    if (selectedWeek === 'w3') return daysArray.filter(d => d >= 15 && d <= 21);
    if (selectedWeek === 'w4') return daysArray.filter(d => d >= 22); // الأسبوع الرابع يمتد حتى نهاية الشهر
    return daysArray;
  }, [daysArray, selectedWeek]);

  const getDayName = (year: number, month: number, day: number) => {
    return DAY_NAMES_AR[new Date(year, month, day).getDay()];
  };

  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<Record<string, number>>({});
  const [pointsWallet, setPointsWallet] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  
  const [newHabitText, setNewHabitText] = useState('');
  const [newHabitDomain, setNewHabitDomain] = useState(lifeDomains[0]?.id || 'health');
  const [newHabitTarget, setNewHabitTarget] = useState<number>(1);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let loadedHabits: Habit[] = [];
      const rawHabitsList = localStorage.getItem('mosaed_habits_v3');
      
      if (rawHabitsList) {
        try { loadedHabits = JSON.parse(rawHabitsList); } catch (e) { console.error(e); }
      } else {
        loadedHabits = [
          { id: 'h_1', text: 'شرب كأسين من الماء', domainId: 'health', targetPerDay: 4 },
          { id: 'h_2', text: 'قراءة صفحتين من كتاب التخطيط', domainId: 'growth', targetPerDay: 1 },
          { id: 'h_3', text: 'أداء الصلاة في وقتها', domainId: 'spiritual', targetPerDay: 5 },
          { id: 'h_4', text: 'تسجيل المصاريف في التطبيق', domainId: 'finance', targetPerDay: 1 }
        ];
      }
      setHabits(loadedHabits);

      const rawLogs = localStorage.getItem('mosaed_habit_logs_v3');
      if (rawLogs) {
        try {
          const parsedLogs = JSON.parse(rawLogs);
          setHabitLogs(parsedLogs);
          
          let totalPoints = 0;
          Object.entries(parsedLogs).forEach(([key, count]) => {
            const habitId = key.split('_')[0];
            const foundHabit = loadedHabits.find(h => h.id === habitId);
            const target = foundHabit?.targetPerDay || 1;
            if ((count as number) >= target) totalPoints += 10;
          });
          setPointsWallet(totalPoints);
        } catch (e) { console.error(e); }
      }

      const rawStreak = localStorage.getItem('mosaed_habit_streak');
      if (rawStreak) setStreak(Number(rawStreak));
    }
  }, [lifeDomains]);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mosaed_habits_v3', JSON.stringify(newHabits));
    }
  };

  const saveLogs = (newLogs: Record<string, number>) => {
    setHabitLogs(newLogs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mosaed_habit_logs_v3', JSON.stringify(newLogs));
    }

    let totalPoints = 0;
    Object.entries(newLogs).forEach(([key, count]) => {
      const habitId = key.split('_')[0];
      const foundHabit = habits.find(h => h.id === habitId);
      const target = foundHabit?.targetPerDay || 1;
      if (count >= target) totalPoints += 10;
    });
    setPointsWallet(totalPoints);
  };

  const handleCellClick = (habit: Habit, day: number, forceValue?: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const logKey = `${habit.id}_${dateStr}`;
    const currentCount = habitLogs[logKey] || 0;
    const target = habit.targetPerDay || 1;

    let nextCount;
    if (forceValue !== undefined) {
      nextCount = forceValue;
    } else {
      nextCount = currentCount >= target ? 0 : currentCount + 1;
    }
    
    const newLogs = { ...habitLogs, [logKey]: nextCount };
    saveLogs(newLogs);

    if (day === todayDay && selectedMonth === todayMonth && selectedYear === todayYear && nextCount >= target && currentCount < target) {
      setStreak(prev => {
        const newStreak = prev + 1;
        localStorage.setItem('mosaed_habit_streak', newStreak.toString());
        return newStreak;
      });
    }
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitText.trim()) {
      const newHabit: Habit = {
        id: `h_${Date.now()}`,
        text: newHabitText.trim(),
        domainId: newHabitDomain,
        targetPerDay: Math.max(1, newHabitTarget)
      };
      saveHabits([newHabit, ...habits]);
      setNewHabitText('');
      setNewHabitTarget(1);
    }
  };

  const handleUpdateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHabit) {
      const updated = habits.map(h => h.id === editingHabit.id ? editingHabit : h);
      saveHabits(updated);
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("هل أنت تأكد من رغبتك في حذف هذه العادة نهائياً مع سجلها؟")) {
      const updated = habits.filter(h => h.id !== habitId);
      saveHabits(updated);
      if (editingHabit?.id === habitId) setEditingHabit(null);
    }
  };

  const filteredHabits = useMemo(() => {
    if (selectedDomainFilter === 'all') return habits;
    return habits.filter(h => h.domainId === selectedDomainFilter);
  }, [habits, selectedDomainFilter]);

  const totalDoneOverall = useMemo(() => {
    let count = 0;
    Object.entries(habitLogs).forEach(([key, val]) => {
      const habitId = key.split('_')[0];
      const h = habits.find(item => item.id === habitId);
      if (h && val >= (h.targetPerDay || 1)) count++;
    });
    return count;
  }, [habitLogs, habits]);

  const unlockedTrophies = TROPHIES.filter(t => t.condition(pointsWallet, streak, totalDoneOverall));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in" dir="rtl">
      
      {/* 1. الترويسة والجوائز */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-2 lg:col-span-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-bold">
            <span>⚡</span><span>التتبع السلوكي المتقدم</span>
          </div>
          <h1 className="text-3xl font-black text-white">إدارة المهام والعادات</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            قسم أداءك لمهام يومية أو شبكة شهرية متكاملة، تفاعل مع أهدافك واجمع النقاط والجوائز.
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-purple-500/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <span className="text-3xl mb-1">💰</span>
            <span className="text-xl font-black text-purple-400 font-mono">{pointsWallet}</span>
            <span className="text-[10px] text-slate-400 font-bold">محفظة النقاط</span>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <span className="text-3xl mb-1">🔥</span>
            <span className="text-xl font-black text-amber-400 font-mono">{streak}</span>
            <span className="text-[10px] text-slate-400 font-bold">أيام الالتزام</span>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl mb-1">✅</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{totalDoneOverall}</span>
            <span className="text-[10px] text-slate-400 font-bold">إجمالي المنجزات</span>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl mb-1">🎯</span>
            <span className="text-xl font-black text-blue-400 font-mono">{habits.length}</span>
            <span className="text-[10px] text-slate-400 font-bold">عادات مبرمجة</span>
          </div>
        </div>
      </div>

      {/* صندوق التحديات والجوائز المفتوحة */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center gap-3 overflow-x-auto custom-scrollbar shadow-lg">
        <span className="text-xs font-bold text-slate-400 px-2 shrink-0">🏆 صندوق الجوائز:</span>
        {TROPHIES.map(trophy => {
          const isUnlocked = unlockedTrophies.some(t => t.id === trophy.id);
          return (
            <div 
              key={trophy.id} 
              className={`flex-shrink-0 w-32 p-3 rounded-2xl border transition-all text-center space-y-1 ${
                isUnlocked 
                ? 'bg-gradient-to-b from-amber-900/40 to-slate-950 border-amber-500/50 shadow-md shadow-amber-900/20' 
                : 'bg-slate-950 border-slate-800/80 opacity-40 grayscale'
              }`}
            >
              <div className="text-2xl">{trophy.icon}</div>
              <div className={`text-[10px] font-bold ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>{trophy.title}</div>
            </div>
          );
        })}
      </div>

      {/* 2. وحدة التحكم الرئيسية (نمط العرض، التاريخ، التصفية) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl relative z-20">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 lg:flex-none text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                viewMode === 'daily' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📋</span><span>عرض المهام اليومية</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex-1 lg:flex-none text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                viewMode === 'matrix' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🧮</span><span>مصفوفة التتبع الشاملة</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-400 px-1">📅 التاريخ:</span>
            
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-xs text-white px-3 py-1.5 rounded-xl cursor-pointer outline-none font-mono font-bold"
            >
              {[2025, 2026, 2027, 2028].map(yr => <option key={yr} value={yr}>عام {yr}</option>)}
            </select>

            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-xs text-white px-3 py-1.5 rounded-xl cursor-pointer outline-none font-bold"
            >
              {MONTH_NAMES.map((name, idx) => <option key={idx} value={idx}>{name}</option>)}
            </select>

            <div className="w-px h-5 bg-slate-800 mx-1 hidden sm:block"></div>

            {viewMode === 'daily' && (
              <select
                value={selectedDay}
                onChange={e => setSelectedDay(Number(e.target.value))}
                className="bg-purple-900/30 border border-purple-500/30 text-xs text-purple-300 px-3 py-1.5 rounded-xl cursor-pointer outline-none font-bold shadow-inner"
              >
                {daysArray.map(d => (
                  <option key={d} value={d}>{d} - {getDayName(selectedYear, selectedMonth, d)}</option>
                ))}
              </select>
            )}

            {/* الأزرار الأربعة الصريحة للأسبوع بدون أسبوع خامس */}
            {viewMode === 'matrix' && (
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSelectedWeek('all')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                    selectedWeek === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedWeek('w1')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                    selectedWeek === 'w1' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  أسبوع 1
                </button>
                <button
                  onClick={() => setSelectedWeek('w2')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                    selectedWeek === 'w2' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  أسبوع 2
                </button>
                <button
                  onClick={() => setSelectedWeek('w3')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                    selectedWeek === 'w3' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  أسبوع 3
                </button>
                <button
                  onClick={() => setSelectedWeek('w4')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                    selectedWeek === 'w4' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  أسبوع 4
                </button>
              </div>
            )}
          </div>
        </div>

        {/* أزرار فلترة المجالات الـ 8 الكاملة */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 md:pb-0 custom-scrollbar">
          <button
            onClick={() => setSelectedDomainFilter('all')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              selectedDomainFilter === 'all' ? 'bg-slate-700 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            كل المجالات ({habits.length})
          </button>

          {lifeDomains.map(d => {
            const count = habits.filter(h => h.domainId === d.id).length;
            const isSelected = selectedDomainFilter === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomainFilter(d.id)}
                className={`text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected ? 'bg-slate-700 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
                style={isSelected ? { backgroundColor: d.color } : {}}
              >
                <span>{d.icon}</span>
                <span className="truncate">{d.name}</span>
                <span className="opacity-80 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3A. العرض اليومي (Daily View) */}
      {viewMode === 'daily' && (
        <div className="bg-gradient-to-br from-purple-900/10 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2rem] space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎯</span>
                <span>
                  مهام يوم {getDayName(selectedYear, selectedMonth, selectedDay)}، 
                  <span className="text-purple-400 font-mono mx-1">{selectedDay} {MONTH_NAMES[selectedMonth]} {selectedYear}</span>
                </span>
              </h3>
              <p className="text-xs text-purple-300">تفاعل مع المهام مباشرة، انقر على الدوائر لتوثيق تكرارك اليومي وحصد النقاط.</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">معدل إنجاز اليوم:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {filteredHabits.length > 0 ? Math.round((filteredHabits.filter(h => {
                  const currentCount = habitLogs[`${h.id}_${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`] || 0;
                  return currentCount >= (h.targetPerDay || 1);
                }).length / filteredHabits.length) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map((habit) => {
              const domain = lifeDomains.find(d => d.id === habit.domainId) || lifeDomains[0];
              const target = habit.targetPerDay || 1;
              const logKey = `${habit.id}_${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
              const currentCount = habitLogs[logKey] || 0;
              const isDone = currentCount >= target;

              return (
                <div key={`daily_${habit.id}`} className={`p-4 rounded-2xl border transition-all ${isDone ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{domain.icon}</span>
                      <div>
                        <div className={`text-sm font-bold ${isDone ? 'text-emerald-400 line-through opacity-70' : 'text-slate-200'}`}>
                          {habit.text}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">المجال: {domain.name} • المطلوب: {target} إنجازات</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 dir-ltr shrink-0 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                      {Array.from({ length: target }).map((_, i) => {
                        const circleVal = i + 1;
                        const isFilled = currentCount >= circleVal;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleCellClick(habit, selectedDay, isFilled && currentCount === circleVal ? circleVal - 1 : circleVal)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                              isFilled 
                                ? 'bg-emerald-500 text-slate-950 scale-105 shadow-md' 
                                : 'bg-slate-950 border border-slate-700 text-slate-500 hover:bg-slate-800 hover:border-slate-500'
                            }`}
                          >
                            {isFilled ? '✓' : circleVal}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredHabits.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                لا توجد مهام مسجلة لهذا المجال المختار. استخدم النموذج في الأسفل لإضافة مهامك.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3B. العرض الشبكي (Matrix View) */}
      {viewMode === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative z-10 animate-fade-in">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/50">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🧮</span>
              <span>
                مصفوفة {selectedWeek === 'all' ? `شهر ${MONTH_NAMES[selectedMonth]}` : `الأسبوع ${selectedWeek.replace('w', '')}`} 
                ({filteredDaysArray.length} أيام معروضة)
              </span>
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></span> مكتمل 100%</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></span> إنجاز جزئي</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span> غير منجز</span>
            </div>
          </div>

          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-right border-collapse table-fixed min-w-[800px]">
              <thead>
                <tr className="bg-slate-950 text-[10px] text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-4 w-[280px] sticky right-0 bg-slate-950 z-20 border-l border-slate-800">العادة السلوكية / خيارات</th>
                  {filteredDaysArray.map(day => {
                    const isToday = day === todayDay && selectedMonth === todayMonth && selectedYear === todayYear;
                    return (
                      <th key={day} className={`p-1.5 text-center min-w-[40px] border-l border-slate-800/50 ${isToday ? 'bg-purple-900/40 text-purple-300' : ''}`}>
                        <div className="flex flex-col items-center justify-center">
                          <span className={`text-[8px] ${isToday ? 'text-purple-300' : 'text-slate-500'}`}>{getDayName(selectedYear, selectedMonth, day)}</span>
                          <span className={`text-sm ${isToday ? 'font-black' : ''}`}>{day}</span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="p-4 text-center w-[80px] sticky left-0 bg-slate-950 z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.3)] border-r border-slate-800">التقدم</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {filteredHabits.map((habit) => {
                  const domain = lifeDomains.find(d => d.id === habit.domainId) || lifeDomains[0];
                  const target = habit.targetPerDay || 1;

                  let completedDaysCount = 0;
                  filteredDaysArray.forEach(day => {
                    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    if ((habitLogs[`${habit.id}_${dateStr}`] || 0) >= target) {
                      completedDaysCount++;
                    }
                  });

                  const successRate = filteredDaysArray.length > 0 ? completedDaysCount / filteredDaysArray.length : 0;
                  let bgAchievementColor = 'bg-slate-800 text-slate-300';
                  if (successRate >= 0.7) bgAchievementColor = 'bg-emerald-500 text-slate-950';
                  else if (successRate >= 0.3) bgAchievementColor = 'bg-amber-400 text-slate-950';

                  return (
                    <tr key={habit.id} className="hover:bg-slate-800/30 transition-colors group">
                      
                      <td className="p-3 sticky right-0 bg-slate-900 group-hover:bg-slate-800 z-10 border-l border-slate-800">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: domain.color }} />
                            <div className="truncate">
                              <span className="text-slate-200 font-bold block truncate text-xs" title={habit.text}>{habit.text}</span>
                              <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-1">
                                <span>{domain.icon} {domain.name}</span>
                                {target > 1 && <span className="text-amber-400 font-mono bg-amber-500/10 px-1 rounded">({target}x/يومياً)</span>}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => setEditingHabit(habit)} className="text-[10px] bg-slate-950 hover:bg-purple-950 text-purple-300 px-2 py-1 rounded border border-slate-800">تعديل</button>
                            <button onClick={() => handleDeleteHabit(habit.id)} className="text-[10px] bg-slate-950 hover:bg-rose-950 text-rose-400 px-2 py-1 rounded border border-slate-800">حذف</button>
                          </div>
                        </div>
                      </td>

                      {filteredDaysArray.map(day => {
                        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const logKey = `${habit.id}_${dateStr}`;
                        const count = habitLogs[logKey] || 0;
                        const isFullyDone = count >= target;
                        const isPartial = count > 0 && count < target;
                        const isToday = day === todayDay && selectedMonth === todayMonth && selectedYear === todayYear;
                        
                        const fillPercent = target > 1 ? (count / target) * 100 : (isFullyDone ? 100 : 0);

                        return (
                          <td 
                            key={day} 
                            onClick={() => handleCellClick(habit, day)}
                            className={`p-1 text-center border-l border-slate-800/30 cursor-pointer select-none transition-all relative ${isToday ? 'bg-purple-900/10' : ''}`}
                          >
                            <div 
                              className={`w-full max-w-[28px] h-7 mx-auto rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all relative overflow-hidden ${
                                isFullyDone ? 'shadow-inner' : 'bg-slate-950 hover:bg-slate-800'
                              }`}
                              style={isFullyDone ? { backgroundColor: `${domain.color}35`, border: `1px solid ${domain.color}`, color: '#ffffff' } : { border: '1px solid #1e293b' }}
                            >
                              {!isFullyDone && isPartial && (
                                <div 
                                  className="absolute bottom-0 left-0 w-full opacity-30 transition-all duration-300"
                                  style={{ height: `${fillPercent}%`, backgroundColor: domain.color }}
                                />
                              )}
                              <span className="relative z-10">
                                {isFullyDone ? (target > 1 ? `${count}` : '✓') : isPartial ? `${count}` : ''}
                              </span>
                            </div>
                          </td>
                        );
                      })}

                      <td className={`p-3 text-center font-mono font-black sticky left-0 z-10 shadow-[-5px_0_15px_rgba(0,0,0,0.3)] ${bgAchievementColor}`}>
                        {completedDaysCount}/{filteredDaysArray.length}
                      </td>

                    </tr>
                  );
                })}
                
                {filteredHabits.length === 0 && (
                  <tr>
                    <td colSpan={filteredDaysArray.length + 2} className="p-10 text-center text-slate-500 text-xs border-none">
                      لا توجد عادات مسجلة لهذا المجال المختار.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. إضافة عادة جديدة */}
      <form onSubmit={handleAddCustomHabit} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <span>➕</span><span>إضافة وتسجيل عادة جديدة إلى النظام:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            required
            value={newHabitText}
            onChange={e => setNewHabitText(e.target.value)}
            placeholder="مثال: شرب المشروبات الصحية..."
            className="sm:col-span-5 md:col-span-6 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <select
            value={newHabitDomain}
            onChange={e => setNewHabitDomain(e.target.value)}
            className="sm:col-span-4 md:col-span-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {lifeDomains.map(d => (
              <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
            ))}
          </select>
          <select
            value={newHabitTarget}
            onChange={e => setNewHabitTarget(Number(e.target.value))}
            className="sm:col-span-3 md:col-span-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value={1}>1 مرة / يومياً</option>
            <option value={2}>2 مرتين / يومياً</option>
            <option value={3}>3 مرات / يومياً</option>
            <option value={4}>4 مرات / يومياً</option>
            <option value={5}>5 مرات / يومياً</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-slate-800 hover:bg-purple-600 text-white font-bold text-xs py-3.5 rounded-xl transition cursor-pointer">
          + حفظ العادة
        </button>
      </form>

      {/* نافذة تعديل العادة (Edit Modal) */}
      {editingHabit && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">تعديل بيانات العادة</h3>
              <button onClick={() => setEditingHabit(null)} className="text-xs text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateHabit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold">اسم العادة:</label>
                <input
                  type="text"
                  required
                  value={editingHabit.text}
                  onChange={e => setEditingHabit({ ...editingHabit, text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold">المجال المرتبط:</label>
                <select
                  value={editingHabit.domainId}
                  onChange={e => setEditingHabit({ ...editingHabit, domainId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {lifeDomains.map(d => (
                    <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold">الهدف والتكرار اليومي:</label>
                <select
                  value={editingHabit.targetPerDay}
                  onChange={e => setEditingHabit({ ...editingHabit, targetPerDay: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value={1}>1 مرة في اليوم</option>
                  <option value={2}>2 مرتين في اليوم</option>
                  <option value={3}>3 مرات في اليوم</option>
                  <option value={4}>4 مرات في اليوم</option>
                  <option value={5}>5 مرات في اليوم</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer">حفظ التعديلات</button>
                <button type="button" onClick={() => setEditingHabit(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition cursor-pointer">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />

    </div>
  );
}