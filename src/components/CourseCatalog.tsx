import React, { useState } from 'react';
import { Search, Clock, BookOpen, Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Course } from '../types/education';

interface CourseCatalogProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  completedCourseIds: string[];
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  onSelectCourse,
  completedCourseIds,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      c.title.includes(searchQuery) ||
      c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.includes(searchQuery);
    return matchesCategory && matchesLevel && matchesQuery;
  });

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              المسارات الأكاديمية التفاعلية
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white [text-wrap:balance]">
              استكشف دورات معتمدة ومناهج صُممت بإشراف نخبة من الأكاديميين
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مسار، موضوع أو مفهوم..."
              className="w-full pr-10 pl-4 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-900 rounded-lg">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              كافة التخصصات
            </button>
            <button
              onClick={() => setActiveCategory('ai')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'ai'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              الذكاء الاصطناعي والبرمجة
            </button>
            <button
              onClick={() => setActiveCategory('physics')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'physics'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              الفيزياء والبصريات
            </button>
            <button
              onClick={() => setActiveCategory('math')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'math'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              الرياضيات والهندسة
            </button>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>المستوى:</span>
            <div className="flex items-center gap-1">
              {['all', 'مبتدئ', 'متوسط', 'متقدم'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    levelFilter === lvl
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-medium'
                      : 'hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {lvl === 'all' ? 'الكل' : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isCompleted = completedCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Course Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={course.image}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {isCompleted && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 text-xs font-medium text-white/90 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded">
                    {course.categoryLabel}
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata Line with separators */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono tabular-nums">
                      <span>{course.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.durationHours} ساعة</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.lessonsCount} درساً</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {course.description}
                    </p>
                  </div>

                  {/* Card Footer: Instructor & CTA */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {course.instructor.name}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="tabular-nums font-mono">{course.rating}</span>
                          <span className="text-slate-400">({course.reviewsCount})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectCourse(course)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
                    >
                      <span>ابدأ المسار</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">لم يتم العثور على دورات تطابق خيارات البحث الحالية.</p>
          </div>
        )}

      </div>
    </section>
  );
};
