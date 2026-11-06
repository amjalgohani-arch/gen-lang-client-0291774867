import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Cpu,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  PenLine
} from 'lucide-react';
import { Course, Lesson } from '../types/education';

interface InteractiveLessonViewerProps {
  course: Course;
  onBack: () => void;
  onOpenLab: (initialMode?: string) => void;
  onAskAI: (lessonTopic: string) => void;
  completedLessons: string[];
  onToggleLessonCompletion: (lessonId: string) => void;
}

export const InteractiveLessonViewer: React.FC<InteractiveLessonViewerProps> = ({
  course,
  onBack,
  onOpenLab,
  onAskAI,
  completedLessons,
  onToggleLessonCompletion,
}) => {
  // Collect all lessons flatly for easy navigation
  const allLessons: Lesson[] = course.chapters.flatMap((ch) => ch.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || '');
  const [userNote, setUserNote] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const currentLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const isLessonCompleted = completedLessons.includes(currentLesson.id);

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    setSavedNotes((prev) => ({
      ...prev,
      [activeLessonId]: userNote.trim(),
    }));
    setUserNote('');
  };

  // Determine lab mode for this course
  const getLabModeForCourse = () => {
    if (course.category === 'physics') return 'optics';
    if (course.category === 'ai') return 'neural';
    return 'geometry';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لقائمة المسارات</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenLab(getLabModeForCourse())}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800 rounded-lg hover:bg-cyan-100 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>فتح التجربة في مختبر المحاكاة</span>
            </button>

            <button
              onClick={() => onAskAI(`${course.title} - ${currentLesson.title}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>شرح بالمساعد الذكي</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Content Stage + Syllabus Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Stage (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stage Media / Visual Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-slate-950 flex flex-col justify-end p-6">
                <img
                  src={course.image}
                  alt={currentLesson.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <span>درس تفاعلي</span>
                    <span>·</span>
                    <span>{currentLesson.duration}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white [text-wrap:balance]">
                    {currentLesson.title}
                  </h1>
                </div>
              </div>

              {/* Lesson Body Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    ملخص الدرس
                  </h3>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentLesson.summary}
                  </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {currentLesson.content}
                </div>

                {/* Mathematical Equation / Principle Callout if applicable */}
                {currentLesson.formula && (
                  <div className="p-4 rounded-lg bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200/80 dark:border-amber-900/40">
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                      المعادلة الحاكمة / الصيغة الرياضية:
                    </div>
                    <div className="font-mono text-sm sm:text-base text-slate-900 dark:text-amber-100 font-semibold dir-ltr text-left py-1">
                      {currentLesson.formula}
                    </div>
                  </div>
                )}

                {/* Key Takeaways */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    المفاهيم الجوهرية في هذا الدرس:
                  </h4>
                  <ul className="space-y-2">
                    {currentLesson.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lesson Notes Sandbox */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <PenLine className="w-3.5 h-3.5 text-amber-500" />
                      ملاحظاتي وتلخيصي لهذا الدرس:
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="دوّن استنتاجاً أو ملاحظة مهمة..."
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="px-3.5 py-2 text-xs font-medium bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      حفظ الملاحظة
                    </button>
                  </div>

                  {savedNotes[activeLessonId] && (
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">ملاحظتك المسجلة: </span>
                      {savedNotes[activeLessonId]}
                    </div>
                  )}
                </div>

                {/* Bottom Navigation & Completion Controls */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => onToggleLessonCompletion(currentLesson.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isLessonCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isLessonCompleted ? 'الدرس مكتمل (اضغط للإلغاء)' : 'تحديد الدرس كمكتمل'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                      disabled={!prevLesson}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>الدرس السابق</span>
                    </button>

                    <button
                      onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
                      disabled={!nextLesson}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap font-semibold"
                    >
                      <span>الدرس التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Syllabus Outline (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>فهرس المسار التعليمي</span>
                </div>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {completedLessons.filter((id) => allLessons.some((l) => l.id === id)).length} / {allLessons.length} مكتمل
                </span>
              </div>

              {/* Chapter and Lesson Tree */}
              <div className="space-y-4">
                {course.chapters.map((ch, chIdx) => (
                  <div key={ch.id} className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">
                      {ch.title}
                    </div>

                    <div className="space-y-1">
                      {ch.lessons.map((lesson) => {
                        const isSelected = lesson.id === activeLessonId;
                        const isDone = completedLessons.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={`w-full text-right px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold border border-amber-200 dark:border-amber-900/50'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                                isDone
                                  ? 'bg-emerald-500 text-white'
                                  : isSelected
                                  ? 'bg-amber-500 text-slate-950 font-bold'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {isDone ? '✓' : '•'}
                              </span>
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                              {lesson.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Instructor Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                مُعد المسار
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {course.instructor.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {course.instructor.title}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
