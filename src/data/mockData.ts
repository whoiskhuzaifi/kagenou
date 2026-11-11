import type {
  Announcement,
  Schedule,
  Task,
  Transaction,
  ForumPost,
  StudyPlan,
} from '../types';

export const initialAnnouncements: Announcement[] = [
  { id: '1', title: 'Perubahan Jadwal Pemrograman Web', content: 'Kuliah Pemrograman Web hari Selasa dipindah ke Lab Computer 3 jam 13:00 WIB.', date: '2026-11-10', author: 'Admin Kelas', category: 'Penting' },
  { id: '2', title: 'Pengumpulan Uang Kas Bulan November', content: 'Harap segera membayarkan uang kas sebesar Rp 20.000 ke Bendahara paling lambat tanggal 15 November.', date: '2026-11-08', author: 'Bendahara', category: 'Keuangan' },
  { id: '3', title: 'Pengumuman Seminar Nasional AI', content: 'Bagi mahasiswa yang berminat mengikuti seminar AI nasional gratis, pendaftaran dibuka sampai besok.', date: '2026-11-05', author: 'Ketua Kelas', category: 'Info' },
];

export const initialSchedules: Schedule[] = [
  { id: '1', day: 'Senin', time: '08:00 - 10:30', subject: 'Basdat & Sistem Informasi', room: 'R.302', lecturer: 'Dr. Ahmad Subagja' },
  { id: '2', day: 'Senin', time: '11:00 - 13:30', subject: 'Matematika Diskrit', room: 'R.204', lecturer: 'Prof. Tri Hartati' },
  { id: '3', day: 'Selasa', time: '13:00 - 15:30', subject: 'Pemrograman Web Lanjut', room: 'Lab Komp 3', lecturer: 'Bpk. Rizky Pratama, M.Kom' },
  { id: '4', day: 'Rabu', time: '09:30 - 12:00', subject: 'Jaringan Komputer', room: 'Lab Jaringan', lecturer: 'Ibu Anita Wijaya, M.T' },
  { id: '5', day: 'Kamis', time: '10:00 - 12:30', subject: 'Etika Profesi & Hukum IT', room: 'R.105', lecturer: 'Dr. Hendra Gunawan' },
  { id: '6', day: 'Jumat', time: '08:30 - 11:00', subject: 'Kecerdasan Buatan', room: 'R.401', lecturer: 'Dr. Eng. Syafiq' },
];

export const initialTasks: Task[] = [
  { id: '1', title: 'Tugas 2: ERD & Normalisasi Database', subject: 'Basdat & Sistem Informasi', deadline: '2026-11-14T23:59', status: 'Pending', priority: 'High', description: 'Buatlah diagram ERD untuk sistem rumah sakit beserta dokumen normalisasi 3NF.' },
  { id: '2', title: 'Proyek Akhir Frontend React + Supabase', subject: 'Pemrograman Web Lanjut', deadline: '2026-11-25T23:59', status: 'Pending', priority: 'Medium', description: 'Membuat web SPA komprehensif terintegrasi API.' },
  { id: '3', title: 'Resume Jurnal Deep Learning', subject: 'Kecerdasan Buatan', deadline: '2026-11-12T17:00', status: 'Completed', priority: 'Low', description: 'Resume 2 halaman paper IEEE tentang CNN.' },
];

export const initialTransactions: Transaction[] = [
  { id: '1', type: 'in', amount: 450000, description: 'Iuran Kas Bulan Oktober (22 Mahasiswa)', date: '2026-10-05', recordedBy: 'Bendahara' },
  { id: '2', type: 'out', amount: 120000, description: 'Pembelian Spidol & Banner Stand Kelas', date: '2026-10-12', recordedBy: 'Bendahara' },
  { id: '3', type: 'in', amount: 400000, description: 'Iuran Kas Bulan November (20 Mahasiswa)', date: '2026-11-02', recordedBy: 'Bendahara' },
  { id: '4', type: 'out', amount: 75000, description: 'Foto Copy Berkas Soal UTS & Print', date: '2026-11-06', recordedBy: 'Bendahara' },
];

export const initialForum: ForumPost[] = [
  { id: '1', author: 'Budi Santoso', role: 'mahasiswa', time: '10:15 - 09 Nov', message: 'Apakah ada materi slide tambahan untuk persiapan UTS Matkul Jaringan?', replies: [
    { author: 'Admin Kelas', role: 'admin', time: '10:30 - 09 Nov', message: 'Sudah di-upload di drive kelas ya Budi, cek folder Matkul Jaringan.' },
  ] },
  { id: '2', author: 'Siti Rahma', role: 'mahasiswa', time: '14:20 - 08 Nov', message: 'Saran untuk kas bulan depan kalau bisa ditransfer via e-wallet saja biar praktis.', replies: [] },
];

export const initialStudyPlans: StudyPlan[] = [
  { id: '1', title: 'Belajar Query JOIN PostgreSQL', date: '2026-11-11', duration: '2 jam', isDone: false },
  { id: '2', title: 'Review Materi Matdis Graf', date: '2026-11-12', duration: '1.5 jam', isDone: true },
];
