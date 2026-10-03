"use client";

import React, { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  startQuizFresh: () => void;
}

export default function Navbar({ activeTab, setActiveTab, startQuizFresh }: NavbarProps) {
  // حالة التحكم في فتح وإغلاق قائمة الجوال
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // قائمة الروابط لسهولة إدارتها
  const navItems = [
    { id: 'landing', label: 'الرئيسية' },
    { id: 'planner', label: 'خطة الحياة' },
    { id: 'tracker', label: 'متابعة العادات ⚡' },
    { id: 'analytics', label: 'لوحة التحليلات' },
    { id: 'blog', label: 'المدونة' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false); // إغلاق القائمة تلقائياً بعد اختيار صفحة
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        {/* 1. الشعار (Logo) */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-purple-900/50">
            🧭
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Mosaed <span className="text-purple-400">AI</span>
          </span>
        </div>

        {/* 2. روابط التصفح لشاشات الكمبيوتر والتابلت (مخفية في الجوال) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === item.id ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* 3. أزرار الإجراءات وزر قائمة الجوال */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden sm:block text-xs font-bold text-slate-300 hover:text-white transition">
            تسجيل الدخول
          </button>
          
          <button
            onClick={startQuizFresh}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-900/50 flex items-center gap-2 shrink-0"
          >
            <span>جرب مجاناً ⚡</span>
          </button>

          {/* زر القائمة المنسدلة للجوال (Hamburger Menu) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              // أيقونة الإغلاق (X)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              // أيقونة القائمة (☰)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* 4. القائمة المنسدلة الخاصة بشاشات الجوال */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950 border-b border-slate-800 p-4 flex flex-col gap-2 shadow-2xl animate-fade-in">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-bold px-4 py-3.5 rounded-xl transition text-right ${
                activeTab === item.id 
                  ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="h-px bg-slate-800 my-2"></div>
          
          <button className="sm:hidden text-sm font-bold text-slate-300 hover:text-white px-4 py-3 text-right bg-slate-900 rounded-xl border border-slate-800">
            تسجيل الدخول
          </button>
        </div>
      )}
    </header>
  );
}