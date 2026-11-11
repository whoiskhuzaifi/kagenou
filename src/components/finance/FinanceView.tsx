import type { Dispatch, SetStateAction } from 'react';
import type { KasSummary, Transaction, User } from '../../types';

interface FinanceViewProps {
  user: User;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  kasSummary: KasSummary;
}

export default function FinanceView(_props: FinanceViewProps) {
  return (
    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
      <h3 className="text-lg font-bold text-white mb-2">Keuangan Kas Kelas</h3>
      <p className="text-sm text-slate-400">Pencatatan uang kas masuk dan keluar secara transparan.</p>
    </div>
  );
}
