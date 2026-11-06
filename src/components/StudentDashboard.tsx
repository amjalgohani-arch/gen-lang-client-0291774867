import React from 'react';
import {
  Trophy,
  Flame,
  Clock,
  BookOpen,
  CheckCircle,
  Award,
  Zap,
  ArrowLeft,
  Star
} from 'lucide-react';
import { Course } from '../types/education';

interface StudentDashboardProps {
  completedLessonsCount: number;
  completedCourseIds: string[];
  masteredCardsCount: number;
  courses: Course[];
  onContinueCourse: (course: Course) => void;
  onOpenCertificate: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  completedLessonsCount,
  completedCourseIds,
  masteredCardsCount,
  courses,
  onContinueCourse,
  onOpenCertificate,
}) => {
  const streakDays = 7;
  const totalStudyMinutes = completedLessonsCount * 25 + 40;
  const hours = Math.floor(totalStudyMinutes / 60);
  const minutes = totalStudyMinutes % 60;

  const badges = [
    {
      id: 'b1',
      title: 'رائد البصريات والفيزياء',
      desc: 'أجرى أول تجربة انكسار في مختبر سنيل',
      unlocked: true,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'b2',
      title: 'مهندس الشبكات العصبية',
      desc: 'استكشف دوال التنشيط وضبط أوزان الخلية',
      unlocked: completedLessonsCount >= 1,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      id: 'b3',
      title: 'مستكشف النسبة الذهبية',
      desc: 'أتقن مفاهيم متتالية فيبوناتشي والتوازن الطبيعي',
      unlocked: true,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'b4',
      title: 'حافظ الاستذكار السريع',
      desc: 'أتقن أكثر من 3 بطاقات تعليمية متباعدة',
      unlocked: masteredCardsCount >= 3,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    },
  ];

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile & Welcome Strip */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-md">
              أ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  أهلاً بك، أمجد
                </h1>
                <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-semibold">
                  مستوى: باحث متقدم
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                تعلّم مستمر، كل خطوة اليوم تقربك من التميز العلمي والمهني.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Award className="w-4 h-4" />
            <span>عرض وإصدار شهادتي</span>
          </button>
        </div>

        {/* 4 Quantitative Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">أيام الالتزام المستمر</span>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {streakDays} <span className="text-xs font-normal text-slate-400">أيام</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              مواظبة ممتازة هذا الأسبوع!
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">إجمالي ساعات التعلم</span>
              <Clock className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {hours}س {minutes}د
            </div>
            <div className="text-[11px] text-slate-400">
              استثمار معرفي تراكمي
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">الدروس المنجزة</span>
              <BookOpen className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {completedLessonsCount}
            </div>
            <div className="text-[11px] text-slate-400">
              درس تفاعلي ومحاكاة
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">بطاقات أتقنتها</span>
              <Trophy className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {masteredCardsCount}
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              تثبيت عبر التكرار المتباعد
            </div>
          </div>

        </div>

        {/* 2-Column: My Active Courses & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Courses (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                المسارات الجارية لديك
              </h3>
              <span className="text-xs text-slate-400">المتابعة الفورية</span>
            </div>

            <div className="space-y-4">
              {courses.map((course) => {
                const totalLessons = course.chapters.flatMap((ch) => ch.lessons).length;
                const isCompleted = completedCourseIds.includes(course.id);

                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        {course.categoryLabel}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {course.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{course.level}</span>
                        <span>·</span>
                        <span>{totalLessons} دروس</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onContinueCourse(course)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors whitespace-nowrap shrink-0 shadow-sm"
                    >
                      <span>متابعة التعلّم</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges & Achievements (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                <span>الأوسمة والإنجازات الأكاديمية</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                    b.unlocked
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                      : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 opacity-60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-lg border flex items-center justify-center shrink-0 ${b.color}`}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {b.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
