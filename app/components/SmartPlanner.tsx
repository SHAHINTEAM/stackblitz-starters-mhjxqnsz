"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface Domain {
  id: string;
  name: string;
  color: string;
  icon: string;
  desc: string;
}

interface SmartPlannerProps {
  lifeDomains: Domain[];
  scores: Record<string, number>;
  setActiveTab: (tab: string) => void;
}

interface QuarterPlan {
  id: 'q1' | 'q2' | 'q3' | 'q4';
  title: string;
  quarterGoal: string;
  subGoals: string[];
  actionTasks: string[];
  reviewNotes: string;
}

interface GoalStructure {
  domainId: string;
  domainName: string;
  annualGoal: string;
  quarters: QuarterPlan[];
}

const getInitialPlanForYear = (year: number): GoalStructure[] => [
  {
    domainId: 'health',
    domainName: 'الصحة والرياضة',
    annualGoal: `خسارة 10 كجم والوصول لوزن مثالي 75 كجم بنهاية ديسمبر ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'المشي 8000 خطوة يومياً وشرب 2.5 لتر ماء.', subGoals: ['قياس الوزن أسبوعياً والتزام وجبات المنزل.'], actionTasks: ['مشي 30 دقيقة مساءً.', 'شرب 2 كوب ماء عند الاستيقاظ.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'قطع المشروبات الغازية والسكريات المباشرة.', subGoals: ['بدائل صحية للحلويات الفواكه والعصائر الطازجة.'], actionTasks: ['تناول الفاكهة كبديل للسكر.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'بدء تمارين المقاومة 3 مرات أسبوعياً.', subGoals: ['الانضمام لنادي رياضي أو أداء تمارين منزلية.'], actionTasks: ['التدريب أيام الأحد، الثلاثاء، والخميس.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'تثبيت الوزن المستهدف والحفاظ على اللياقة.', subGoals: ['إجراء فحوصات طبية شاملة.'], actionTasks: ['متابعة السعرات اليومية.'], reviewNotes: '' }
    ]
  },
  {
    domainId: 'career',
    domainName: 'المهنة والعمل',
    annualGoal: `الحصول على ترقية مهنية وزيادة الراتب بنسبة 20% بنهاية ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'إكمال دورة إدارة المشاريع الاحترافية.', subGoals: ['تخصيص 5 ساعات أسبوعياً للتعلم.'], actionTasks: ['مذاكرة ساعتين يومي السبت والأربعاء.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'توثيق وتسليم مشروعين رئيسيين بنجاح.', subGoals: ['إنهاء المهام قبل موعدها بـ 24 ساعة.'], actionTasks: ['ساعتين عمل مركز (Deep Work) يومياً.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'تقديم ورشة عمل داخلية ونقل المعرفة للفريق.', subGoals: ['إعداد المادة التدريبية.'], actionTasks: ['كتابة تلخيص أسبوعي للإنجازات.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'تقديم التقييم السنوي ومناقشة الترقية المستحقة.', subGoals: ['تجهيز ملف الإنجازات السنوي.'], actionTasks: ['مراجعة مؤشرات الأداء الوظيفي أسبوعياً.'], reviewNotes: '' }
    ]
  },
  {
    domainId: 'finance',
    domainName: 'المال والاستثمار',
    annualGoal: `ادخار 12,000 ريال واستثمار 10% من الدخل الشهري بنهاية ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'بناء صندوق طوارئ يغطي مصاريف شهرين.', subGoals: ['تخفيض مصاريف المطاعم 30%.'], actionTasks: ['تسجيل كل مصروف يومي في التطبيق.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'فتح محفظة استثمارية وإيداع أول مبلغ.', subGoals: ['استقطاع تلقائي فور نزول الراتب.'], actionTasks: ['تحضير القهوة في المنزل طوال أيام العمل.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'زيادة نسبة الادخار إلى 15% شهرياً.', subGoals: ['إلغاء الاشتراكات الشهرية غير المستخدمة.'], actionTasks: ['مراجعة الميزانية الأسبوعية كل جمعة.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'تقييم أرباح المحفظة وصندوق الطوارئ.', subGoals: ['إعادة توزيع الأصول الاستثمارية.'], actionTasks: ['مراجعة التقرير المالي السنوي.'], reviewNotes: '' }
    ]
  },
  {
    domainId: 'growth',
    domainName: 'النمو الشخصي',
    annualGoal: `قراءة 12 كتاباً وتعلّم لغة جديدة بمستوى متوسط بنهاية ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'قراءة 3 كتب في التخطيط والإنتاجية.', subGoals: ['قراءة 15 صفحة يومياً.'], actionTasks: ['القراءة لمدة 20 دقيقة قبل النوم.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'إكمال المستوى الأول من اللغة الجديدة.', subGoals: ['الاستماع لبودكاست تعليمي daily.'], actionTasks: ['15 دقيقة تمارين لغوية صباحاً.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'قراءة 3 كتب في المهارات القيادية.', subGoals: ['تطبيق استراتيجية تلخيص الكتب.'], actionTasks: ['كتابة ملخص لكل كتاب يتم إنهاؤه.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'إكمال المستوى الثاني وتطبيق اللغة تحدثاً.', subGoals: ['التحدث مع ممارسين للغة.'], actionTasks: ['مراجعة الكلمات الجديدة 10 دقائق يومياً.'], reviewNotes: '' }
    ]
  },
  {
    domainId: 'family',
    domainName: 'العلاقات والأهل',
    annualGoal: `قضاء وقت نوعي مع العائلة وتنظيم رحلة عائلية كبرى في عام ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'تخصيص يوم الجمعة أسبوعياً بالكامل للعائلة.', subGoals: ['تجنب اتصالات العمل نهاية الأسبوع.'], actionTasks: ['جلسة عائلية مسائية بدون شاشات.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'تنظيم رحلة عائلية لمدة 3 أيام.', subGoals: ['تخطيط الفعاليات والميزانية مسبقاً.'], actionTasks: ['الاتصال بالوالدين يومياً للطمأنينة.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'تجديد التواصل مع الأقارب في المناسبات.', subGoals: ['زيارة دورية صلة للرحم.'], actionTasks: ['تنسيق زيارة أسبوعية منتظمة.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'تقييم جودة الوقت العائلي والاحتفال بالإنجازات.', subGoals: ['توثيق ألبوم الصور العائلي السنوي.'], actionTasks: ['جلسة امتنان وتواصل عائلي شهرية.'], reviewNotes: '' }
    ]
  },
  {
    domainId: 'spiritual',
    domainName: 'الجانب الروحي',
    annualGoal: `المحافظة على الصلوات وختم القرآن الكريم 3 مرات في ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'الختمة الأولى والمحافظة على صلاة الفجر.', subGoals: ['قراءة الورد القرآني بعد الفجر.'], actionTasks: ['قراءة صفحتين فور الاستيقاظ.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'الختمة الثانية والالتزام بأذكار الصباح والمساء.', subGoals: ['تخصيص وقت للاستغفار والتأمل.'], actionTasks: ['جلسة هدوء ودعاء 5 دقائق قبل النوم.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'الالتزام بالنوافل وقيام الليل ولو بركعة.', subGoals: ['التصدق الأسبوعي التلقائي.'], actionTasks: ['صلاة ركعتي الشفع والوتر قبل النوم.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'الختمة الثالثة وتقييم السكينة النفسية.', subGoals: ['المحافظة على السنن الرواطب.'], actionTasks: ['تدوين النعم والامتنان اليومي.'], reviewNotes: '' }
    ]
  },
  {
    domainId: 'fun',
    domainName: 'الترفيه وجودة الحياة',
    annualGoal: `الترويح عن النفس بسفرتين واستكشاف هواية جديدة بانتظام في ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'ممارسة هواية الرسم أو السباحة مرتين أسبوعياً.', subGoals: ['حجز حصص ترفيهية خفيفة.'], actionTasks: ['تخصيص ساعتين يوم السبت للهواية.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'سفرية استرخاء وتجديد نشاط.', subGoals: ['فصل التنبيهات وإشعارات العمل أثناء الإجازة.'], actionTasks: ['المشي في الطبيعة مرة أسبوعياً.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'حضور 3 فعاليات أو معارض ثقفية وتأملية.', subGoals: ['تخفيف التوتر والضغوط.'], actionTasks: ['ساعة استرخاء وتأمل أسبوعية.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'الرحلة الترفيهية الثانية لإنهاء العام بانتعاش.', subGoals: ['التخطيط المبكر للوجهة.'], actionTasks: ['قضاء وقت ممتع في الهواء الطلق.'], reviewNotes: '' }
    ]
  },
  {
    domainId: 'environment',
    domainName: 'البيئة المحيطة',
    annualGoal: `إعادة ترتيب وتنظيم المنزل ومساحة العمل بنظام التبسيط في ${year}.`,
    quarters: [
      { id: 'q1', title: 'الربع الأول (Q1)', quarterGoal: 'ترتيب مكتب العمل وتقليل المشتتات البصرية.', subGoals: ['تنظيم الملفات والأوراق.'], actionTasks: ['ترتيب المكتب 5 دقائق قبل المغادرة.'], reviewNotes: '' },
      { id: 'q2', title: 'الربع الثاني (Q2)', quarterGoal: 'التبرع بالأغراض غير المستخدمة منذ 6 أشهر.', subGoals: ['تطبيق فلسفة التبسيط (Minimalism).'], actionTasks: ['فرز خزانة الملابس شهرياً.'], reviewNotes: '' },
      { id: 'q3', title: 'الربع الثالث (Q3)', quarterGoal: 'تحسين إضاءة المنزل وإضافة نباتات طبيعية.', subGoals: ['توفير بيئة هادئة ومريحة للنفس.'], actionTasks: ['تهوية الغرفة الشخصية فور الاستيقاظ.'], reviewNotes: '' },
      { id: 'q4', title: 'الربع الرابع (Q4)', quarterGoal: 'صيانة كاملة وأجهزة المنزل ومساحة العمل.', subGoals: ['فحص الجودة والتنظيم العام.'], actionTasks: ['جولة ترتيب وتنظيف أسبوعية.'], reviewNotes: '' }
    ]
  }
];

export default function SmartPlanner({ lifeDomains, scores, setActiveTab }: SmartPlannerProps) {
  const [mainView, setMainView] = useState<'library' | 'editor'>('library');
  const [plannerMode, setPlannerMode] = useState<'selection' | 'ai' | 'manual'>('manual');
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [newYearInput, setNewYearInput] = useState<string>('');
  const [showAddYearModal, setShowAddYearModal] = useState<boolean>(false);
  const [activeQuarterTab, setActiveQuarterTab] = useState<Record<string, number>>({});
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [plansByYear, setPlansByYear] = useState<Record<number, GoalStructure[]>>({});
  const [liveQuizScores, setLiveQuizScores] = useState<Record<string, number>>(scores);
  const [completedTasksMap, setCompletedTasksMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScores = localStorage.getItem('mosaed_quiz_scores');
      if (savedScores) {
        try { setLiveQuizScores(JSON.parse(savedScores)); } catch (e) { console.error(e); }
      }

      const savedPlans = localStorage.getItem('mosaed_annual_plans_v2');
      if (savedPlans) {
        try {
          const parsed = JSON.parse(savedPlans);
          setPlansByYear(parsed);
          const years = Object.keys(parsed).map(Number).sort();
          if (years.length > 0 && !years.includes(selectedYear)) {
            setSelectedYear(years[years.length - 1]);
          }
        } catch (e) { console.error(e); }
      } else {
        const currentY = new Date().getFullYear();
        setPlansByYear({ [currentY]: getInitialPlanForYear(currentY) });
        setSelectedYear(currentY);
      }

      const savedCompleted = localStorage.getItem('mosaed_completed_tasks');
      if (savedCompleted) {
        try { setCompletedTasksMap(JSON.parse(savedCompleted)); } catch (e) { console.error(e); }
      }

      setIsDataLoaded(true);
    }
  }, [scores]);

  useEffect(() => {
    if (isDataLoaded && Object.keys(plansByYear).length > 0) {
      localStorage.setItem('mosaed_annual_plans_v2', JSON.stringify(plansByYear));
    }
  }, [plansByYear, isDataLoaded]);

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const lowestDomainIds = useMemo(() => {
    const sorted = [...lifeDomains].sort((a, b) => {
      const scoreA = liveQuizScores[a.id] ?? 5;
      const scoreB = liveQuizScores[b.id] ?? 5;
      return scoreA - scoreB;
    });
    return sorted.slice(0, 2).map(d => d.id);
  }, [lifeDomains, liveQuizScores]);

  const currentPlan = plansByYear[selectedYear] || getInitialPlanForYear(selectedYear);

  const sortedCurrentPlan = useMemo(() => {
    return [...currentPlan].sort((a, b) => {
      const scoreA = liveQuizScores[a.domainId] ?? 5;
      const scoreB = liveQuizScores[b.domainId] ?? 5;
      return scoreA - scoreB;
    });
  }, [currentPlan, liveQuizScores]);

  const updateCurrentPlan = (newPlan: GoalStructure[]) => {
    setPlansByYear(prev => ({
      ...prev,
      [selectedYear]: newPlan
    }));
  };

  const handleAddCustomYear = () => {
    const yearNum = parseInt(newYearInput, 10);
    if (yearNum) {
      if (!plansByYear[yearNum]) {
        setPlansByYear(prev => ({ ...prev, [yearNum]: getInitialPlanForYear(yearNum) }));
      }
      setSelectedYear(yearNum);
      setPlannerMode('selection'); // إظهار شاشة الاختيار فقط عند إنشاء سنة جديدة تماماً
      setNewYearInput('');
      setShowAddYearModal(false);
      setMainView('editor');
    }
  };

  const handleGenerateAISuggestion = (domainId: string, quarterIdx: number) => {
    const targetDomainPlan = currentPlan.find(p => p.domainId === domainId);
    if (!targetDomainPlan) return;
    const scoreVal = liveQuizScores[domainId] ?? 5;
    const isPriority = lowestDomainIds.includes(domainId);
    const qTitle = targetDomainPlan.quarters[quarterIdx].title;
    
    const suggestedGoal = isPriority
      ? `هدف مكثف لسد الفجوة في مجال ${targetDomainPlan.domainName} (تقييمك الحالي ${scoreVal}/10) بنهاية ${qTitle}.`
      : `استدامة التطور والنمو في مجال ${targetDomainPlan.domainName} بنهاية ${qTitle}.`;

    const suggestedSub = `تحديد 3 عادات أساسية تخدم ${targetDomainPlan.domainName} يومياً.`;
    const suggestedAction = `تخصيص 20 دقيقة يومياً دون مشتتات للممارسة والتطبيق.`;

    const updatedPlan = currentPlan.map((dItem) => {
      if (dItem.domainId === domainId) {
        const updatedQuarters = [...dItem.quarters];
        const curQ = updatedQuarters[quarterIdx];
        updatedQuarters[quarterIdx] = {
          ...curQ,
          quarterGoal: suggestedGoal,
          subGoals: [suggestedSub, ...curQ.subGoals],
          actionTasks: [suggestedAction, ...curQ.actionTasks]
        };
        return { ...dItem, quarters: updatedQuarters };
      }
      return dItem;
    });
    updateCurrentPlan(updatedPlan);
  };

  const handleSyncToHabitTracker = () => {
    if (typeof window !== 'undefined') {
      const activeTasksToSync: string[] = [];
      currentPlan.forEach(domain => {
        domain.quarters.forEach(q => {
          q.actionTasks.forEach(task => {
            if (task.trim()) activeTasksToSync.push(`[${domain.domainName}] ${task}`);
          });
        });
      });
      localStorage.setItem('mosaed_synced_habits', JSON.stringify(activeTasksToSync));
      setSyncMsg(`تم ترحيل ${activeTasksToSync.length} عادة وإجراء لجدول المتابعة اليومي بنجاح! ⚡`);
      setTimeout(() => setSyncMsg(null), 4000);
    }
  };

  const handleSendWithVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      alert("الرجاء النقر على اختبار الأمان (Cloudflare) أولاً لتأكيد أنك إنسان!");
      return;
    }
    if (emailInput.trim() && phoneInput.trim()) {
      setEmailSent(true);
    }
  };

  const handleUpdateQuarterGoal = (domainId: string, quarterIdx: number, val: string) => {
    updateCurrentPlan(currentPlan.map(item => item.domainId === domainId ? { ...item, quarters: item.quarters.map((q, i) => i === quarterIdx ? { ...q, quarterGoal: val } : q) } : item));
  };
  const handleUpdateReviewNotes = (domainId: string, quarterIdx: number, val: string) => {
    updateCurrentPlan(currentPlan.map(item => item.domainId === domainId ? { ...item, quarters: item.quarters.map((q, i) => i === quarterIdx ? { ...q, reviewNotes: val } : q) } : item));
  };
  const handleAddSubGoal = (domainId: string, quarterIdx: number) => {
    updateCurrentPlan(currentPlan.map(item => item.domainId === domainId ? { ...item, quarters: item.quarters.map((q, i) => i === quarterIdx ? { ...q, subGoals: [...q.subGoals, ''] } : q) } : item));
  };
  const handleRemoveSubGoal = (domainId: string, quarterIdx: number, subIdx: number) => {
    updateCurrentPlan(currentPlan.map(item => item.domainId === domainId ? { ...item, quarters: item.quarters.map((q, i) => i === quarterIdx ? { ...q, subGoals: q.subGoals.filter((_, sI) => sI !== subIdx) } : q) } : item));
  };
  const handleAddActionTask = (domainId: string, quarterIdx: number) => {
    updateCurrentPlan(currentPlan.map(item => item.domainId === domainId ? { ...item, quarters: item.quarters.map((q, i) => i === quarterIdx ? { ...q, actionTasks: [...q.actionTasks, ''] } : q) } : item));
  };
  const handleRemoveActionTask = (domainId: string, quarterIdx: number, taskIdx: number) => {
    updateCurrentPlan(currentPlan.map(item => item.domainId === domainId ? { ...item, quarters: item.quarters.map((q, i) => i === quarterIdx ? { ...q, actionTasks: q.actionTasks.filter((_, tI) => tI !== taskIdx) } : q) } : item));
  };

  if (!isDataLoaded) return <div className="text-center py-20 text-slate-400">جاري تحميل بياناتك المحفوظة... ⏳</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10" dir="rtl">
      
      {/* -------------------- الشاشة الأولى: مكتبة الخطط (Library) -------------------- */}
      {mainView === 'library' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-2 text-center sm:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-bold">
                <span>📚</span><span>مكتبة خططي السنوية</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">إدارة الخطط والتكتيكات</h1>
              <p className="text-xs text-slate-400">جميع خططك محفوظة بأمان. يمكنك مراجعة خطط السنوات السابقة أو استكمال خطتك الحالية.</p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowAddYearModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-purple-900/50 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>+ إضافة خطة سنة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(plansByYear).sort((a,b) => Number(b) - Number(a)).map((yearStr) => {
              const yr = Number(yearStr);
              const plan = plansByYear[yr];
              
              let totalTasks = 0;
              let doneTasks = 0;
              plan.forEach(d => {
                d.quarters.forEach(q => {
                  q.actionTasks.forEach((t, tIdx) => {
                    if (t.trim()) {
                      totalTasks++;
                      if (completedTasksMap[`${yr}-${d.domainId}-${q.id}-${tIdx}`]) doneTasks++;
                    }
                  });
                });
              });
              const rate = totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) : 0;
              const isCurrentYear = yr === new Date().getFullYear();

              return (
                <div key={yr} className={`bg-slate-900 rounded-[2rem] p-6 shadow-xl relative overflow-hidden transition hover:-translate-y-1 ${isCurrentYear ? 'border-2 border-purple-600/50 shadow-purple-900/20' : 'border border-slate-800'}`}>
                  {isCurrentYear && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl z-10">
                      السنة الحالية ✨
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-3xl font-black text-white font-mono">{yr}</span>
                      <span className="text-2xl opacity-20">📅</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>الإنجاز العام للمهام</span>
                        <span className="font-bold text-emerald-400">{rate}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        إجمالي المهام المبرمجة: <span className="text-slate-300">{totalTasks} مهمة</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(yr);
                        setPlannerMode('manual'); // الانتقال المباشر للشجرة التخطيطية
                        setMainView('editor');
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>الدخول لتعديل الخطة</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* -------------------- الشاشة الثانية: محرر الخطة (Editor) -------------------- */}
      {mainView === 'editor' && (
        <div className="space-y-10 animate-fade-in">
          
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <button
              type="button"
              onClick={() => setMainView('library')}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <span>← العودة لمكتبة الخطط</span>
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm font-bold text-white bg-purple-900/30 px-4 py-1.5 rounded-full border border-purple-800/40">
                جاري تعديل خطة عام {selectedYear} ✍️
              </span>
            </div>
          </div>

          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              اصنع خطتك السنوية <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                لمجالات حياتك الـ 8 والأرباع الأربعة
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              ربط استراتيجي متكامل: تم فرز المجالات آلياً بناءً على نتيجة اختبارك، مع التركيز على الأركان الأقل تقييماً لتكون هي أولويتك القصوى.
            </p>
          </div>

          {syncMsg && (
            <div className="bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold p-4 rounded-2xl text-center shadow-xl">
              {syncMsg}
            </div>
          )}

          {plannerMode === 'selection' && (
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="border border-purple-500/60 bg-gradient-to-b from-purple-950/30 via-slate-900 to-slate-900 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-purple-400 transition shadow-2xl relative overflow-hidden">
                <div className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full absolute top-4 left-4">
                  خطة شجرية لعام {selectedYear} ✨
                </div>
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-purple-950">
                    🤖
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    توليد خطة مقترحة بالذكاء الاصطناعي لعام {selectedYear}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    سيقوم النظام بفرز وبناء الأهداف لك بحيث يعالج القصور والفجوة في المجالات التي حصلت فيها على تقييم منخفض أولاً.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPlannerMode('ai')}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-4 rounded-2xl text-xs transition shadow-lg shadow-purple-950 cursor-pointer"
                >
                  ولّد لي الخطة لعام {selectedYear} بالذكاء الاصطناعي 🚀
                </button>
              </div>

              <div className="border border-slate-800 bg-slate-900 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center text-2xl border border-slate-700">
                    ✍️
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    شكراً، أرغب بإعداد خطتي بنفسي
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    قم بكتابة شجرتك التخطيطية لعام {selectedYear} يدوياً من الصفر لجميع أرباع السنة الـ 4 لكل مجال.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const emptyPlan = getInitialPlanForYear(selectedYear).map(item => ({
                      ...item,
                      annualGoal: '',
                      quarters: item.quarters.map(q => ({
                        ...q,
                        quarterGoal: '',
                        subGoals: [''],
                        actionTasks: [''],
                        reviewNotes: ''
                      }))
                    }));
                    updateCurrentPlan(emptyPlan);
                    setPlannerMode('manual');
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-4 rounded-2xl text-xs transition cursor-pointer"
                >
                  إعداد الشجرة يدوياً من الصفر 📝
                </button>
              </div>
            </div>
          )}

          {(plannerMode === 'ai' || plannerMode === 'manual') && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-purple-400 bg-purple-950/80 px-3.5 py-1.5 rounded-full border border-purple-800">
                    {plannerMode === 'ai' ? `🤖 خطة عام ${selectedYear} الشاملة` : `✍️ خطة عام ${selectedYear} اليدوية`}
                  </span>
                  <span className="text-[10px] text-slate-500">حفظ تلقائي ✓</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncToHabitTracker}
                    className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-800 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>⚡</span>
                    <span>رحّل العادات لجدول المتابعة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlannerMode('selection')}
                    className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    ← تغيير الطريقة
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-center">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80"><span className="font-bold text-purple-400 block">S - محدد</span><span className="text-slate-500 text-[10px]">واضح لا يختلف عليه 2</span></div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80"><span className="font-bold text-blue-400 block">M - قابل للقياس</span><span className="text-slate-500 text-[10px]">مصحوب بأرقام دقيقة</span></div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80"><span className="font-bold text-emerald-400 block">A - قابل للتحقيق</span><span className="text-slate-500 text-[10px]">واقعي وغير تعجيزي</span></div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80"><span className="font-bold text-amber-400 block">R - ذو صلة</span><span className="text-slate-500 text-[10px]">يخدم عجلة حياتك</span></div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 col-span-2 sm:col-span-1"><span className="font-bold text-pink-400 block">T - محدد بزمن</span><span className="text-slate-500 text-[10px]">له تاريخ انتهاء</span></div>
              </div>

              <div className="space-y-10">
                {sortedCurrentPlan.map((domainPlan) => {
                  const matchedDomain = lifeDomains.find(d => d.id === domainPlan.domainId);
                  const activeQIdx = activeQuarterTab[domainPlan.domainId] ?? 0;
                  const currentQuarter = domainPlan.quarters[activeQIdx];
                  const domainScore = liveQuizScores[domainPlan.domainId] ?? 5;
                  const isPriority = lowestDomainIds.includes(domainPlan.domainId);

                  return (
                    <div
                      key={domainPlan.domainId}
                      className={`border bg-slate-900 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative transition-all ${
                        isPriority ? 'border-amber-500/90 shadow-[0_0_35px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl">
                            {matchedDomain?.icon || '🧭'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-white text-lg sm:text-xl">
                                المجال: <span className="text-purple-300">{domainPlan.domainName}</span>
                              </h3>
                              {isPriority && (
                                <span className="text-[10px] font-bold bg-amber-500/20 border border-amber-500/60 text-amber-300 px-3 py-0.5 rounded-full flex items-center gap-1">
                                  <span>أولوية قصوى</span><span>🎯</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">
                              {matchedDomain?.desc} • <span className="text-purple-400 font-bold">تقييمك: {domainScore}/10</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                          عام {selectedYear}
                        </span>
                      </div>

                      <div className="space-y-2 bg-slate-950 p-5 rounded-2xl border border-purple-900/50 shadow-inner">
                        <label className="text-xs font-bold text-purple-300 flex items-center gap-2">
                          <span>🎯</span><span>الهدف السنوي الرئيسي الكبير لعام {selectedYear}:</span>
                        </label>
                        <input
                          type="text"
                          value={domainPlan.annualGoal}
                          onChange={e => {
                            const val = e.target.value;
                            updateCurrentPlan(currentPlan.map(item => item.domainId === domainPlan.domainId ? { ...item, annualGoal: val } : item));
                          }}
                          placeholder={`أدخل هدفك السنوي المباشر لـ ${domainPlan.domainName}...`}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <span>🗓</span><span>اختر الربع السنوي لبرمجة الأهداف والإجراءات:</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {domainPlan.quarters.map((q, qI) => (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => setActiveQuarterTab(prev => ({ ...prev, [domainPlan.domainId]: qI }))}
                              className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                                activeQIdx === qI ? 'bg-purple-600 text-white border-purple-400 shadow-lg' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                            >
                              <span className="text-[10px] opacity-80">{q.title}</span>
                              <span className="truncate max-w-full text-[11px] font-normal">{q.quarterGoal ? '✓ مبرمج' : 'غير محدد'}</span>
                            </button>
                          ))}
                        </div>

                        <div className="bg-slate-950/90 border border-purple-900/40 p-5 rounded-2xl space-y-5">
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                                <span>📍</span><span>هدف {currentQuarter.title}:</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleGenerateAISuggestion(domainPlan.domainId, activeQIdx)}
                                className="text-[10px] text-purple-300 hover:text-purple-200 bg-purple-950/80 border border-purple-800/80 px-2.5 py-1 rounded-lg transition cursor-pointer"
                              >
                                اقتراح هدف SMART للتقييم 💡
                              </button>
                            </div>
                            <input
                              type="text"
                              value={currentQuarter.quarterGoal}
                              onChange={e => handleUpdateQuarterGoal(domainPlan.domainId, activeQIdx, e.target.value)}
                              placeholder={`هدف ${currentQuarter.title} المباشر...`}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                <span>📌</span><span>الأهداف الفرعية لـ ({currentQuarter.title}):</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddSubGoal(domainPlan.domainId, activeQIdx)}
                                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-lg transition cursor-pointer"
                              >
                                + إضافة هدف فرعي
                              </button>
                            </div>
                            <div className="space-y-2">
                              {currentQuarter.subGoals.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={sub}
                                    onChange={e => {
                                      const val = e.target.value;
                                      updateCurrentPlan(currentPlan.map(item => item.domainId === domainPlan.domainId ? { ...item, quarters: item.quarters.map((q, i) => i === activeQIdx ? { ...q, subGoals: q.subGoals.map((g, gi) => gi === sIdx ? val : g) } : q) } : item));
                                    }}
                                    placeholder={`هدف فرعي ${sIdx + 1}...`}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                  />
                                  {currentQuarter.subGoals.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSubGoal(domainPlan.domainId, activeQIdx, sIdx)}
                                      className="text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                                    >✕</button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                <span>⚡</span><span>المهام الإجرائية والعادات اليومية لـ ({currentQuarter.title}):</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddActionTask(domainPlan.domainId, activeQIdx)}
                                className="text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-lg transition cursor-pointer"
                              >
                                + إضافة عادة / إجراء
                              </button>
                            </div>
                            <div className="space-y-2">
                              {currentQuarter.actionTasks.map((task, tIdx) => (
                                <div key={tIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={task}
                                    onChange={e => {
                                      const val = e.target.value;
                                      updateCurrentPlan(currentPlan.map(item => item.domainId === domainPlan.domainId ? { ...item, quarters: item.quarters.map((q, i) => i === activeQIdx ? { ...q, actionTasks: q.actionTasks.map((t, ti) => ti === tIdx ? val : t) } : q) } : item));
                                    }}
                                    placeholder={`عادة أو إجراء عملي ${tIdx + 1}...`}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                  />
                                  {currentQuarter.actionTasks.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveActionTask(domainPlan.domainId, activeQIdx, tIdx)}
                                      className="text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                                    >✕</button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                              <span>📝</span><span>مراجعة وتأمل نهاية ({currentQuarter.title}):</span>
                            </label>
                            <textarea
                              rows={2}
                              value={currentQuarter.reviewNotes || ''}
                              onChange={e => handleUpdateReviewNotes(domainPlan.domainId, activeQIdx, e.target.value)}
                              placeholder="ما الذي تحقق في هذا الربع؟ وما هي أبرز الدروس المستفادة لتحسين الربع القادم؟"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border border-purple-500/20 bg-[#16151a] p-8 sm:p-12 rounded-[2rem] text-center shadow-2xl max-w-4xl mx-auto mt-10">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 flex items-center justify-center gap-2">
                  <span>خطتك لعام {selectedYear} أصبحت جاهزة!</span><span>🚀</span>
                </h3>
                <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                  لقد قمت ببرمجة وبناء شجرة تخطيطية احترافية مفروزة بحسب أولويات تقييمك. يمكنك الآن تصدير هذه الخطة كتقرير PDF.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSubscribeModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-sm sm:text-base px-10 py-4 rounded-xl transition shadow-lg hover:shadow-purple-500/25 cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <span>📄</span><span>تصدير التقرير والاشتراك الآن</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* -------------------- النوافذ المنبثقة العامة -------------------- */}
      {showAddYearModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl">
            <h3 className="text-lg font-bold text-white">إضافة سنة جديدة للتخطيط</h3>
            <p className="text-xs text-slate-400">أدخل رقم السنة التي تريد إنشاء خطة جديدة لها (مثلاً: 2029)</p>
            <input
              type="number"
              value={newYearInput}
              onChange={e => setNewYearInput(e.target.value)}
              placeholder="مثال: 2029"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-sm text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={handleAddCustomYear} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer">إضافة السنة</button>
              <button type="button" onClick={() => setShowAddYearModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#1c1a22] border border-purple-500/20 p-8 sm:p-10 rounded-3xl w-full max-w-lg shadow-2xl relative">
            <button type="button" onClick={() => setShowSubscribeModal(false)} className="absolute top-5 left-5 text-slate-400 w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center text-sm cursor-pointer">✕</button>
            {!emailSent ? (
              <div className="space-y-6 text-center">
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <span>إرسال وتأكيد خطتك السنوية</span><span>📩</span>
                </h3>
                <form onSubmit={handleSendWithVerification} className="space-y-4">
                  <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="بريدك الإلكتروني" className="w-full bg-[#24232c] border border-slate-700 rounded-xl p-4 text-xs text-white text-right focus:outline-none focus:border-purple-500" />
                  <div className="flex gap-2" dir="ltr">
                    <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="bg-[#24232c] border border-slate-700 rounded-xl p-4 text-xs text-white cursor-pointer outline-none w-32">
                      <option value="+966">السعودية (+966)</option><option value="+971">الإمارات (+971)</option><option value="+965">الكويت (+965)</option>
                    </select>
                    <input type="tel" required value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="5X XXX XXXX" className="flex-1 bg-[#24232c] border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div onClick={() => setIsCaptchaVerified(prev => !prev)} className="bg-[#24232c] border border-slate-700 p-4 rounded-xl flex justify-between cursor-pointer select-none">
                    <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-white text-orange-500 flex items-center justify-center font-bold">☁️</div><div className="text-[9px] text-slate-400 leading-tight text-right"><b className="text-white text-[11px]">CLOUDFLARE</b><br/>الخصوصية</div></div>
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-300">{isCaptchaVerified ? 'تم بنجاح' : 'انقر للتحقق'}</span><div className={`w-6 h-6 rounded-full border-2 ${isCaptchaVerified ? 'bg-[#22c55e] border-[#22c55e]' : 'border-slate-600'} text-white flex items-center justify-center text-xs`}>{isCaptchaVerified && '✓'}</div></div>
                  </div>
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl text-sm transition cursor-pointer">اشترك والتحقق الآن 🚀</button>
                </form>
                <button type="button" onClick={() => { setShowSubscribeModal(false); setActiveTab('report-preview'); }} className="text-xs text-slate-400 hover:text-white underline cursor-pointer">أو معاينة التقرير المطبوع المتقدم (Pro) 📄</button>
              </div>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto border border-emerald-500/50">✓</div>
                <h3 className="text-2xl font-bold text-white">اكتمل التسجيل والتوثيق بنجاح!</h3>
                <button type="button" onClick={() => { setShowSubscribeModal(false); setActiveTab('report-preview'); }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl cursor-pointer">الذهاب لمعاينة التقرير النهائي 📄</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}