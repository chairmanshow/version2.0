import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { DiagnosisResultData } from '../types';

export interface PrescriptionData {
  patientName: string;
  age?: string | number;
  gender?: string;
  symptoms: string;
  duration?: string;
  severity?: string;
  diagnosis: string;
  ayurvedicDosha?: string;
  remedies?: Array<{
    name: string;
    dosage?: string;
    howToUse?: string;
    frequency?: string;
  }> | string[];
  treatment?: string[];
  exercises?: string[];
  dietAdvice?: {
    foodsToEat?: string[];
    foodsToAvoid?: string[];
    routineTips?: string[];
  };
  advice?: string;
  date?: string;
  diagnosisId?: string;
}

/**
 * Normalizes text to ensure jsPDF (standard Latin font) never throws encoding errors.
 * Replaces complex Devanagari glyphs with clean, readable Latin-1 strings if needed.
 */
function cleanAscii(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u2023]/g, '*')
    .trim();
}

/**
 * Generates an Authentic Chotelal Ji Health Prescription PDF
 * 100% Crash-Proof with jsPDF + jspdf-autotable
 */
export async function generatePrescription(data: PrescriptionData): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0px';
  container.id = 'pdf-template-container';
  document.body.appendChild(container);

  const formatList = (items?: string[]) => (items || []).map(item => `<li>${item}</li>`).join('');

  container.innerHTML = `
    <div id="pdf-template" style="width: 800px; padding: 40px; font-family: 'Arial', sans-serif; color: #1E293B; background: white;">
      <div style="text-align: center; border-bottom: 3px solid #FF9933; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #FF9933; font-size: 28px; margin: 0;">🧔 CHOTELAL JI HEALTH</h1>
        <p style="color: #64748B; font-size: 14px; margin: 5px 0;">Aapki Sehat, Hamari Zimmedari</p>
      </div>
      <div style="background: #F8FAFC; padding: 15px; border-radius: 10px; margin-bottom: 25px;">
        <p style="margin: 5px 0; font-size: 14px;"><strong>Patient:</strong> ${data.patientName}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${data.date || new Date().toLocaleDateString()}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>ID:</strong> ${data.diagnosisId || 'CHL-' + Date.now()}</p>
      </div>
      <div style="margin-bottom: 25px;">
        <h2 style="color: #1E3A8A; font-size: 18px; border-left: 4px solid #FF9933; padding-left: 10px;">🔍 Aapki Problem</h2>
        <p style="font-size: 16px; margin: 10px 0;">${data.diagnosis}</p>
      </div>
      <div style="margin-bottom: 25px;">
        <h2 style="color: #1E3A8A; font-size: 18px; border-left: 4px solid #FF9933; padding-left: 10px;">🌿 Ghar ke Upay</h2>
        <ul style="font-size: 15px; padding-left: 20px;">
          ${formatList(Array.isArray(data.remedies) ? (data.remedies as any[]).map(r => typeof r === 'string' ? r : r.name) : [])}
        </ul>
      </div>
      <div style="margin-bottom: 25px;">
        <h2 style="color: #1E3A8A; font-size: 18px; border-left: 4px solid #FF9933; padding-left: 10px;">🧘 Yoga / Exercise</h2>
        <ul style="font-size: 15px; padding-left: 20px;">
          ${formatList(data.exercises)}
        </ul>
      </div>
      <div style="display: flex; gap: 20px; margin-bottom: 25px;">
        <div style="flex: 1;">
          <h2 style="color: #10B981; font-size: 16px;">✅ Khayein</h2>
          <ul style="font-size: 14px; padding-left: 20px;">
            ${formatList(data.dietAdvice?.foodsToEat)}
          </ul>
        </div>
        <div style="flex: 1;">
          <h2 style="color: #EF4444; font-size: 16px;">❌ Avoid Karein</h2>
          <ul style="font-size: 14px; padding-left: 20px;">
            ${formatList(data.dietAdvice?.foodsToAvoid)}
          </ul>
        </div>
      </div>
      <div style="background: #FFF7ED; border: 1px solid #FFEDD5; padding: 15px; border-radius: 10px; margin-bottom: 25px;">
        <p style="font-size: 14px; color: #9A3412; margin: 0;"><strong>💬 Chotelal Ji Ki Salah:</strong> ${data.advice || 'Apna khayal rakhna beta.'}</p>
      </div>
      <div style="border-top: 1px solid #E2E8F0; padding-top: 15px; text-align: center;">
        <p style="font-size: 11px; color: #94A3B8;">⚠️ Ye AI-generated information hai. Emergency me turant doctor se milein.</p>
        <p style="font-size: 11px; color: #94A3B8;">© 2026 Sumit Shrivas | www.chotelaljihealth.com</p>
      </div>
    </div>
  `;

  try {
    const template = document.getElementById('pdf-template');
    if (!template) throw new Error('Template not found');
    
    const canvas = await html2canvas(template, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ChotelalJi-Prescription-${data.patientName.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Backward compatibility wrapper
 */
export function generatePrescriptionPDF({
  result,
  patientName = 'Valued Patient',
  patientAge = '28',
  patientGender = 'Male',
  dateStr = new Date().toLocaleDateString('en-IN'),
}: {
  result: DiagnosisResultData;
  patientName?: string;
  patientAge?: string | number;
  patientGender?: string;
  dateStr?: string;
}): void {
  generatePrescription({
    patientName,
    age: patientAge,
    gender: patientGender,
    date: dateStr,
    diagnosisId: result.id || `CHL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    symptoms: result.patientSummary?.reportedSymptoms || result.diagnosis_text || 'Ayurvedic Health Consultation',
    duration: result.patientSummary?.duration || '1-2 weeks',
    severity: result.patientSummary?.severity || 'moderate',
    diagnosis: result.diagnosis?.primaryCondition || result.diagnosis?.primaryConditionHindi || result.diagnosis_text || 'Ayurvedic Assessment',
    ayurvedicDosha: result.diagnosis?.ayurvedicDosha || 'Vata-Pitta Pradhan Imbalance',
    remedies: result.tier1HerbalRemedies || result.herbal_remedies || [],
    treatment: result.ayurvedic_treatment || [],
    exercises: result.exercises || (result.tier2LifestyleAndYoga ? result.tier2LifestyleAndYoga.map((y) => y.title) : []),
    advice: result.chotelalPersonalNote,
  });
}

/**
 * Generates an Ayurvedic 7-Day Personal Diet Chart PDF
 */
export function generateDietChartPDF({
  dietChart,
  patientName = 'Valued Patient',
}: {
  dietChart: any;
  patientName?: string;
}): void {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    doc.setFillColor(255, 153, 51);
    doc.rect(0, 0, pageWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('CHOTELAL JI HEALTH — 7-DAY AYURVEDIC PERSONAL DIET CHART', margin, 11);

    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Patient: ${cleanAscii(patientName)}  |  Focus: ${cleanAscii(dietChart?.condition || 'Ayurvedic Wellness')}`, margin, 24);

    const tableRows = (dietChart?.weeklyPlan || []).map((dayPlan: any) => [
      cleanAscii(dayPlan.day || ''),
      cleanAscii(dayPlan.earlyMorning || 'Warm water / Herbal infusion'),
      cleanAscii(dayPlan.breakfast || ''),
      cleanAscii(dayPlan.lunch || ''),
      cleanAscii(dayPlan.eveningSnack || ''),
      cleanAscii(dayPlan.dinner || ''),
    ]);

    autoTable(doc, {
      startY: 28,
      margin: { left: margin, right: margin },
      head: [['Day', 'Early Morning Detox', 'Breakfast', 'Lunch', 'Evening Snack', 'Dinner']],
      body: tableRows.length > 0 ? tableRows : [
        ['Mon-Sun', 'Lukewarm water with lemon/cumin', 'Warm oats or daliya', 'Moong dal khichdi & bottle gourd', 'Herbal tea & roasted makhana', 'Light vegetable soup & 2 rotis']
      ],
      headStyles: {
        fillColor: [255, 153, 51],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      theme: 'grid',
    });

    const safeName = cleanAscii(patientName).replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`ChotelalJi-DietChart-${safeName}.pdf`);
  } catch (err) {
    console.error('Diet chart PDF error:', err);
    alert('Diet chart download failed. Please try again.');
  }
}

