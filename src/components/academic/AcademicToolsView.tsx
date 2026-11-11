import type { Dispatch, SetStateAction } from 'react';
import { FileText, Book, Calculator, Quote, Flame, Download } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AcademicSubTab, StudyPlan } from '../../types';
import JournalFinderTool from './JournalFinderTool';
import BookFinderTool from './BookFinderTool';
import GradeCalculatorTool from './GradeCalculatorTool';
import CitationGeneratorTool from './CitationGeneratorTool';
import StudyPlannerTool from './StudyPlannerTool';
import MediaDownloaderTool from './MediaDownloaderTool';

interface AcademicToolsViewProps {
  academicSubTab: AcademicSubTab;
  setAcademicSubTab: (tab: AcademicSubTab) => void;
  studyPlans: StudyPlan[];
  setStudyPlans: Dispatch<SetStateAction<StudyPlan[]>>;
}

const SUB_TABS: { id: AcademicSubTab; label: string; icon: LucideIcon }[] = [
  { id: 'journals', label: 'Cari Jurnal', icon: FileText },
  { id: 'books', label: 'Cari Buku', icon: Book },
  { id: 'grades', label: 'Kalkulator IPK', icon: Calculator },
  { id: 'citations', label: 'Sitasi', icon: Quote },
  { id: 'planner', label: 'Study Planner', icon: Flame },
  { id: 'media', label: 'Unduh Berkas', icon: Download },
];

export default function AcademicToolsView({
  academicSubTab,
  setAcademicSubTab,
  studyPlans,
  setStudyPlans,
}: AcademicToolsViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUB_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setAcademicSubTab(id)}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition ${
              academicSubTab === id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {academicSubTab === 'journals' && <JournalFinderTool />}
      {academicSubTab === 'books' && <BookFinderTool />}
      {academicSubTab === 'grades' && <GradeCalculatorTool />}
      {academicSubTab === 'citations' && <CitationGeneratorTool />}
      {academicSubTab === 'planner' && (
        <StudyPlannerTool studyPlans={studyPlans} setStudyPlans={setStudyPlans} />
      )}
      {academicSubTab === 'media' && <MediaDownloaderTool />}
    </div>
  );
}
