"use client";

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import QuizWizard from './components/QuizWizard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import HabitTracker from './components/HabitTracker';
import BlogSection from './components/BlogSection';
import SmartPlanner from './components/SmartPlanner';
import ReportPreview from './components/ReportPreview';
import Footer from './components/Footer';

const LIFE_DOMAINS = [
  { id: 'health', name: 'الصحة والرياضة', color: '#ef4444', icon: '❤️', desc: 'التغذية، اللياقة البدنية، وعادات النوم' },
  { id: 'career', name: 'المهنة والعمل', color: '#3b82f6', icon: '💼', desc: 'التطور المهني، الإنجازات، والرضا الوظيفي' },
  { id: 'finance', name: 'المال والاستثمار', color: '#10b981', icon: '💰', desc: 'الميزانية، الإدراك المالي، والادخار' },
  { id: 'growth', name: 'النمو الشخصي', color: '#8b5cf6', icon: '🧠', desc: 'القراءة، تعلم المهارات، وتطوير الذات' },
  { id: 'family', name: 'العلاقات والأهل', color: '#ec4899', icon: '👥', desc: 'التواصل، وقضاء الوقت مع العائلة' },
  { id: 'spiritual', name: 'الجانب الروحي', color: '#f59e0b', icon: '☀️', desc: 'العبادة، التأمل، والراحة النفسية' },
  { id: 'fun', name: 'الترفيه وجودة الحياة', color: '#06b6d4', icon: '🎯', desc: 'الهوايات، السفر، وأوقات الاسترخاء' },
  { id: 'environment', name: 'البيئة المحيطة', color: '#64748b', icon: '🏡', desc: 'ترتيب المنزل، مساحة العمل، والتنظيم' }
];

export default function LifeWheelPlatform() {
  const [activeTab, setActiveTab] = useState('landing');
  const [scores, setScores] = useState<Record<string, number>>({
    health: 7,
    career: 8,
    finance: 5,
    growth: 6,
    family: 7,
    spiritual: 8,
    fun: 4,
    environment: 6
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScores = localStorage.getItem('mosaed_quiz_scores');
      if (savedScores) {
        try {
          setScores(JSON.parse(savedScores));
        } catch (e) {
          console.error("Error parsing saved quiz scores:", e);
        }
      }
    }
  }, []);

  const startQuizFresh = () => {
    setScores({
      health: 5,
      career: 5,
      finance: 5,
      growth: 5,
      family: 5,
      spiritual: 5,
      fun: 5,
      environment: 5
    });
    setActiveTab('quiz');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingHero
            lifeDomains={LIFE_DOMAINS}
            setActiveTab={setActiveTab}
            startQuizFresh={startQuizFresh}
          />
        );

      case 'quiz':
        return (
          <QuizWizard
            lifeDomains={LIFE_DOMAINS}
            scores={scores}
            setScores={setScores}
            setActiveTab={setActiveTab}
            startQuizFresh={startQuizFresh}
          />
        );

      case 'planner':
        return (
          <SmartPlanner
            lifeDomains={LIFE_DOMAINS}
            scores={scores}
            setActiveTab={setActiveTab}
          />
        );

      case 'tracker':
        return (
          <HabitTracker
            lifeDomains={LIFE_DOMAINS}
          />
        );

      case 'analytics':
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <AnalyticsDashboard
              lifeDomains={LIFE_DOMAINS}
              scores={scores}
            />
          </div>
        );

      case 'report-preview':
        return (
          <ReportPreview
            lifeDomains={LIFE_DOMAINS}
            scores={scores}
            setActiveTab={setActiveTab}
          />
        );

      case 'blog':
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <BlogSection setActiveTab={setActiveTab} />
          </div>
        );

      default:
        return (
          <LandingHero
            lifeDomains={LIFE_DOMAINS}
            setActiveTab={setActiveTab}
            startQuizFresh={startQuizFresh}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between" dir="rtl">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        startQuizFresh={startQuizFresh}
      />
      <main className="mb-auto">
        {renderContent()}
      </main>
      <Footer
        setActiveTab={setActiveTab}
        startQuizFresh={startQuizFresh}
      />
    </div>
  );
}