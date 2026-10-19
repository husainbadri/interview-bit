"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Play, ArrowUpRight, Filter, Search, X, Check, BookOpen } from "lucide-react";

import { VAST_QUESTIONS } from "@/lib/questions/curated";

const CATEGORIES = [
  "All Roles",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "Data Scientist",
  "DevOps & Cloud Engineer",
  "UX/UI Designer",
  "Behavioral & Leadership",
];

const LEVELS = ["All Levels", "Fresher", "Junior", "Mid-level", "Senior", "Lead"];

const ITEMS_PER_PAGE = 8;

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Roles");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredQuestions = useMemo(() => {
    return VAST_QUESTIONS.filter((q) => {
      const qText = q.question.toLowerCase();
      const qCat = q.category.toLowerCase();
      const qRole = q.role.toLowerCase();
      const s = searchQuery.toLowerCase().trim();

      const matchesSearch =
        s === "" ||
        qText.includes(s) ||
        qCat.includes(s) ||
        qRole.includes(s) ||
        q.keyTopics.some((t) => t.toLowerCase().includes(s));

      const matchesCategory =
        selectedCategory === "All Roles" ? true : q.role === selectedCategory;

      const matchesLevel =
        selectedLevel === "All Levels" ? true : q.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCopyQuestion = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="font-sans pb-16">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#e6e6e6] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-[#f0f0f0] border border-[#e6e6e6] text-[#545454] text-xs font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
              VAST REPOSITORY INDEX · {VAST_QUESTIONS.length} CURATED QUESTIONS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight font-poppins-display">
            Curated Question Library
          </h1>
          <p className="text-[#545454] text-[15px] mt-1">
            Explore industry-calibrated interview questions across software engineering, architecture, product, data, and executive leadership.
          </p>
        </div>

        <Link
          href="/dashboard/interview/new"
          className="btn-grain-primary text-sm py-2.5 px-4 whitespace-nowrap shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform"
        >
          <Play size={14} />
          <span>Launch Practice Drill</span>
        </Link>
      </div>

      {/* Interactive Controls Bar: Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707070]" />
            <input
              type="text"
              placeholder="Search by topic, rubric keyword (e.g. 'Kafka', 'Fiber', 'MVCC', 'PRD')..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#fafafa] border border-[#e6e6e6] rounded-[10px] text-sm text-[#141414] placeholder-[#707070] focus:border-[#009959] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#141414]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Level Filter Dropdown & Match Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="bg-[#fafafa] border border-[#e6e6e6] rounded-[10px] px-3 py-2 text-xs font-medium text-[#141414] focus:border-[#009959] focus:outline-none cursor-pointer"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-[#707070] font-mono shrink-0">
              <Filter size={13} />
              <span>{filteredQuestions.length} MATCHING</span>
            </div>
          </div>
        </div>

        {/* Category Role Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#009959] text-[#fafafa] shadow-xs"
                  : "bg-[#f0f0f0] text-[#545454] hover:bg-[#e6e6e6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3.5 mb-8">
        {filteredQuestions.length === 0 ? (
          <div className="card-grain p-12 text-center bg-[#fafafa]">
            <BookOpen size={32} className="mx-auto text-[#707070] mb-3" />
            <p className="text-base font-semibold text-[#141414] mb-1">No matching questions found</p>
            <p className="text-xs text-[#545454] mb-4">
              Try adjusting your search terms, changing the role filter, or clearing seniority filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Roles");
                setSelectedLevel("All Levels");
                setCurrentPage(1);
              }}
              className="btn-grain-secondary text-xs py-2 px-3 inline-flex cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q) => (
            <div
              key={q.id}
              className="card-grain hover:border-[#d6d6d6] transition-colors group bg-[#fafafa] p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[#545454] bg-[#f0f0f0] px-2.5 py-0.5 rounded-[8px]">
                      {q.role}
                    </span>
                    <span className="text-xs font-medium text-[#009959] bg-[#009959]/10 px-2 py-0.5 rounded-[8px] whitespace-nowrap">
                      {q.level}
                    </span>
                    <span className="text-xs text-[#707070] font-mono uppercase ml-1">
                      {q.category}
                    </span>
                  </div>

                  <p className="text-[15px] sm:text-[16px] text-[#141414] font-normal leading-relaxed mb-3">
                    &ldquo;{q.question}&rdquo;
                  </p>

                  {/* Key Evaluation Rubric Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-[#707070] mr-1">Rubric Criteria:</span>
                    {q.keyTopics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[11px] font-mono text-[#545454] bg-[#ffffff] border border-[#e6e6e6] px-2 py-0.5 rounded-[6px]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                  <Link
                    href={`/dashboard/interview/new?role=${encodeURIComponent(q.role)}&level=${encodeURIComponent(q.level.toLowerCase())}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#009959] bg-[#009959]/10 hover:bg-[#009959]/15 px-3 py-1.5 rounded-[8px] transition-colors"
                  >
                    <span>Practice Question</span>
                    <ArrowUpRight size={13} />
                  </Link>

                  <button
                    onClick={() => handleCopyQuestion(q.id, q.question)}
                    className="text-xs text-[#707070] hover:text-[#141414] px-2 py-1 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy question text"
                  >
                    {copiedId === q.id ? (
                      <>
                        <Check size={12} className="text-[#009959]" />
                        <span className="text-[#009959] text-[11px]">Copied</span>
                      </>
                    ) : (
                      <span className="text-[11px]">Copy Text</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {filteredQuestions.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between border-t border-[#e6e6e6] pt-5 text-xs text-[#545454]">
          <span className="font-mono">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} –{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuestions.length)} of{" "}
            {filteredQuestions.length} calibrated questions
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-grain-secondary py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="font-mono px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-grain-secondary py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
