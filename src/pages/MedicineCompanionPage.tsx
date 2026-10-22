import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/PageLayout';
import {
  Pill,
  Clock,
  Plus,
  Trash2,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Copy,
  Printer,
  User,
  HeartPulse,
} from 'lucide-react';

interface MedicineRecord {
  id: string;
  name: string;
  dosage: string;
  schedule: string; // e.g. "Morning after food, Night before sleep"
  prescribedBy: string; // Doctor / Hospital
  prescribedDate: string;
  instructions: string;
  reminderTime?: string;
}

const STORAGE_KEY = 'chotelal_medicine_records';

export const MedicineCompanionPage: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'sample-1',
        name: 'Triphala Churna (Ayurvedic)',
        dosage: '1 teaspoon (3-5g)',
        schedule: 'Night before bedtime with warm water',
        prescribedBy: 'Vaidya Chotelal Ji (Ayurvedic Consultation)',
        prescribedDate: '2026-03-20',
        instructions: 'Take 30 minutes after light dinner. Drink warm water throughout the day.',
        reminderTime: '21:30',
      },
    ];
  });

  // Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [schedule, setSchedule] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [prescribedDate, setPrescribedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [instructions, setInstructions] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
      } catch (e) {}
    }
  }, [medicines]);

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: MedicineRecord = {
      id: 'med-' + Date.now(),
      name: name.trim(),
      dosage: dosage.trim() || 'As prescribed by doctor',
      schedule: schedule.trim() || 'Once daily',
      prescribedBy: prescribedBy.trim() || 'Qualified Healthcare Professional',
      prescribedDate: prescribedDate || new Date().toISOString().split('T')[0],
      instructions: instructions.trim() || 'Follow doctor & pharmacist instructions',
      reminderTime,
    };

    setMedicines([...medicines, newMed]);
    setName('');
    setDosage('');
    setSchedule('');
    setPrescribedBy('');
    setInstructions('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const generateDiscussionSummary = () => {
    if (medicines.length === 0) return 'No medicines recorded.';
    return `CHOTELAL JI HEALTH - MEDICINE DISCUSSION SUMMARY
Patient Self-Recorded Prescription Roster for Clinical Review
Date: ${new Date().toLocaleDateString()}

RECORDED MEDICINES:
${medicines
  .map(
    (m, i) =>
      `${i + 1}. ${m.name}
   - Dosage: ${m.dosage}
   - Schedule / Timing: ${m.schedule}
   - Prescribed By: ${m.prescribedBy} (Date: ${m.prescribedDate})
   - Notes / Instructions: ${m.instructions}`
  )
  .join('\n\n')}

IMPORTANT CLINICAL NOTE:
This summary was compiled by the patient for personal tracking. Please verify all medications, dosages, and potential interactions with your qualified physician or licensed pharmacist before modifying treatment.`;
  };

  const handleCopySummary = () => {
    const summary = generateDiscussionSummary();
    navigator.clipboard.writeText(summary);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <PageLayout
      pageTitle="Medicine Safety Companion"
      pageSubtitle="Record Prescriptions, Manage Schedules & Prepare Doctor Discussion Summaries"
      badge="Safe & Confidential"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Strict Medical Safety Banner */}
        <section className="bg-amber-50 border border-amber-200 p-5 rounded-3xl text-amber-900 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-amber-950">Safety &amp; Compliance Guidelines:</h3>
              <p className="text-amber-900/90 leading-relaxed">
                This area allows you to manually record medications and Ayurvedic preparations prescribed by your qualified physician. <strong>This platform does not prescribe medicines, alter dosages, recommend prescription pharmaceuticals, or advise discontinuing treatment.</strong> If you experience unexpected side effects or suspect drug interactions, immediately consult your prescribing doctor or a qualified pharmacist.
              </p>
            </div>
          </div>
        </section>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-serif">
              My Prescriptions &amp; Schedule ({medicines.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep an accurate record of prescribed medicines and take the summary to your next appointment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Cancel' : 'Add Prescribed Medicine'}</span>
            </button>

            {medicines.length > 0 && (
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Copy Summary for Doctor"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Add Medicine Form Modal / Dropdown */}
        {showAddForm && (
          <form
            onSubmit={handleAddMedicine}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-200 shadow-md space-y-5 animate-fadeIn"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 font-serif">
                Record Prescribed Medicine
              </h3>
              <p className="text-xs text-slate-500">
                Enter details exactly as written on your official doctor prescription.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medicine / Herb Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Triphala Churna, Amlodipine, Metformin"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescribed Dosage
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 1 Tablet (5mg), 1 Spoon (5g)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescribed Schedule &amp; Timing
                </label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. Morning after breakfast, Night before sleep"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescribing Doctor / Clinic
                </label>
                <input
                  type="text"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                  placeholder="e.g. Dr. Sharma, District Civil Hospital"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date Prescribed
                </label>
                <input
                  type="date"
                  value={prescribedDate}
                  onChange={(e) => setPrescribedDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Reminder Alert Time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Doctor Notes &amp; Dietary Precautions
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take with warm milk, avoid cold drinks, re-check in 2 weeks"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Save Record
              </button>
            </div>
          </form>
        )}

        {/* Medicines List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {medicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                      <Pill className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {med.reminderTime}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h4 className="font-black text-slate-900 text-lg leading-snug">
                    {med.name}
                  </h4>
                  <p className="text-xs font-semibold text-orange-700 mt-0.5">
                    {med.dosage}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{med.schedule}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{med.prescribedBy}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Prescribed on: {med.prescribedDate}</span>
                  </div>
                </div>

                {med.instructions && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-700 block mb-0.5">Notes:</span>
                    <p>{med.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Doctor Discussion Summary Box */}
        {medicines.length > 0 && (
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <h3 className="font-black text-lg text-white">
                  Doctor &amp; Pharmacist Discussion Summary
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {generateDiscussionSummary()}
            </pre>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
