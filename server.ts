import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const parts = dataUrl.split('base64,');
  const mimeMatch = dataUrl.match(/^data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const data = parts.length > 1 ? parts[1] : '';
  return { mimeType, data };
}

async function generateWithFallback(ai: GoogleGenAI, params: any) {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;
  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        ...params,
        model
      });
      return res;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying fallback:`, err?.message || err);
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support large base64 image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasServerApiKey: !!process.env.GEMINI_API_KEY
    });
  });

  // Smart Document Identification & Auto-Renaming (Inspects content, finds person name, auto-renames)
  app.post('/api/gemini/analyze-and-rename-document', async (req, res) => {
    try {
      const { dataUrl, mimeType: userMimeType, originalName, lang = 'ar', apiKey } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ success: false, error: 'dataUrl is required' });
      }

      const ai = getGeminiClient(apiKey);
      if (!ai) {
        return res.status(403).json({ success: false, error: 'No Gemini API key available' });
      }

      const parsed = parseDataUrl(dataUrl);
      const finalMime = userMimeType || parsed.mimeType;

      const langHint =
        lang === 'fr'
          ? 'French / Arabic'
          : lang === 'en'
          ? 'English / Arabic'
          : 'Arabic';

      const prompt = `You are a forensic document analyst and intelligent categorization system.
Analyze this document (which may be a PDF or image of a passport, national ID card, birth certificate, university degree, lease agreement, utility bill, medical report, visa, bank statement, employment certificate, etc.).
Original file name: "${originalName || 'unknown'}"
Target language preference: ${langHint}

Perform the following tasks:
1. Identify the EXACT type of document (e.g. جواز سفر / Passport, شهادة ميلاد / Birth Certificate, بطاقة هوية وطنية / National ID, رخصة قيادة / Driving License, فاتورة كهرباء أو ماء / Utility Bill, عقد إيجار / Rental Agreement, شهادة تخرج جامعية / University Degree, تقرير طبي / Medical Report, كشف حساب بنكي / Bank Statement, تأشيرة / Visa, إشعار توظيف, etc.).
2. Extract the person's full name (or primary entity/company name) to whom the document belongs or who is named in the document (e.g. "محمد نبيل", "أحمد علي", "سارة إبراهيم", or company name if an invoice).
3. Detect the country, nationality, or distinctive language attribute if evident (e.g. "فرنسية", "يمنية", "سعودية", "مصرية", "بريطانية", etc.).
4. Generate a clean, descriptive, standardized file name in Arabic (or English if the document is strictly foreign).
   The file name MUST follow this format:
   [نوع_المستند]_[السمة_المميزة_أو_الدولة_إن_وجدت]_[اسم_الشخص_أو_الجهة].pdf
   IMPORTANT:
   - Use underscores (_) instead of spaces so it's a valid, clean file name.
   - It MUST end with .pdf.
   - Example 1: If it's a passport belonging to Mohammed -> "جواز_سفر_محمد_نبيل.pdf"
   - Example 2: If it's a French birth certificate of Sara -> "شهادة_ميلاد_فرنسية_سارة_أحمد.pdf"
   - Example 3: If it's a Saudi national ID for Abdullah -> "بطاقة_هوية_وطنية_عبدالله_صالح.pdf"
   - Example 4: If it's an electricity bill for Al-Amal Co -> "فاتورة_كهرباء_شركة_الأمل.pdf"
   - Example 5: If it's a university degree for Khaled -> "شهادة_جامعية_خالد_محمود.pdf"
   - Example 6: If it's a medical report for Fatima -> "تقرير_طبي_فاطمة_حسن.pdf"

Return ONLY a valid JSON object matching this schema:
{
  "documentType": "نوع المستند بالعربية (مثال: جواز سفر)",
  "documentTypeEn": "Document type in English (e.g. Passport)",
  "personOrEntityName": "اسم الشخص أو الجهة المذكورة (مثال: محمد نبيل)",
  "countryOrLanguage": "الدولة أو الصفة المميزة إن وجدت (مثال: فرنسية)",
  "documentSummary": "ملخص وجيز في جملة واحدة عن محتوى الوثيقة",
  "suggestedFileName": "جواز_سفر_محمد_نبيل.pdf"
}`;

      const response = await generateWithFallback(ai, {
        contents: [
          {
            inlineData: {
              mimeType: finalMime,
              data: parsed.data
            }
          },
          { text: prompt }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response && response.text) {
        try {
          const analysis = JSON.parse(response.text);
          let fileName = (analysis.suggestedFileName || '').trim();
          fileName = fileName.replace(/[`"'*<>:"/\\|?*]/g, '').trim();
          if (!fileName.toLowerCase().endsWith('.pdf')) {
            fileName += '.pdf';
          }
          analysis.suggestedFileName = fileName;

          return res.json({
            success: true,
            analysis
          });
        } catch (parseErr) {
          console.warn('JSON parse error from Gemini response:', parseErr);
        }
      }

      return res.status(500).json({ success: false, error: 'Could not extract analysis JSON' });
    } catch (err: any) {
      console.warn('AI document analysis error:', err?.message || err);
      return res.status(err?.status || 500).json({
        success: false,
        error: err?.message || 'Failed to analyze document'
      });
    }
  });

  // OCR and Document Summary endpoint
  app.post('/api/gemini/ocr-summary', async (req, res) => {
    try {
      const { dataUrl, lang = 'ar', apiKey } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'dataUrl is required' });
      }

      const ai = getGeminiClient(apiKey);
      if (!ai) {
        return res.status(403).json({ error: 'No Gemini API key available' });
      }

      const { mimeType, data } = parseDataUrl(dataUrl);
      const langInstruction =
        lang === 'ar'
          ? 'باللغة العربية'
          : lang === 'fr'
          ? 'en français'
          : 'in English';

      const prompt = `You are an expert document reader and OCR analyst. Please analyze this scanned document image and provide the output ${langInstruction} formatted neatly in JSON format with these exact keys:
{
  "detectedTitle": "Short title of document",
  "documentType": "Type such as Invoice, Receipt, ID, Certificate, Notes, Contract, etc.",
  "summary": "Concise 2-4 sentence summary of the key content, dates, names, or totals",
  "extractedText": "All readable extracted text transcribed faithfully"
}
Return only valid JSON.`;

      const response = await generateWithFallback(ai, {
        contents: [
          {
            inlineData: {
              mimeType,
              data
            }
          },
          { text: prompt }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response && response.text) {
        const result = JSON.parse(response.text);
        return res.json({ success: true, result });
      }

      return res.json({ success: false, error: 'No text generated' });
    } catch (err: any) {
      console.warn('AI OCR error:', err?.message || err);
      return res.status(err?.status || 500).json({
        success: false,
        error: err?.message || 'Failed AI OCR'
      });
    }
  });

  // Smart document renaming endpoint
  app.post('/api/gemini/rename', async (req, res) => {
    try {
      const { dataUrl, lang = 'ar', apiKey } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'dataUrl is required' });
      }

      const ai = getGeminiClient(apiKey);
      if (!ai) {
        return res.status(403).json({ error: 'No Gemini API key available' });
      }

      const { mimeType, data } = parseDataUrl(dataUrl);

      let prompt = '';
      if (lang === 'ar') {
        prompt =
          'حلل هذه الصورة وأعطني اسماً مقترحاً ومختصراً جداً لملف PDF يصف محتواها بدقة (مثل: فاتورة_الكهرباء_مارس_2025 أو تقرير_طبي أو عقد_إيجار أو هوية_وطنية). اجعل الرد عبارة عن اسم الملف فقط بدون فراغات وباستخدام الشرطة السفلية _ وينتهي بامتداد .pdf بدون أي نص إضافي.';
      } else if (lang === 'fr') {
        prompt =
          'Analysez ce document et donnez un nom de fichier très court et précis (ex: Facture_Electricite_2025.pdf, Contrat_Bail.pdf). Répondez uniquement avec le nom du fichier terminant par .pdf sans aucun autre texte.';
      } else {
        prompt =
          'Analyze this document and provide a very short, accurate PDF file name describing it (e.g. Electric_Bill_March_2025.pdf, Medical_Report.pdf). Return ONLY the file name ending in .pdf without any explanation.';
      }

      const response = await generateWithFallback(ai, {
        contents: [
          {
            inlineData: {
              mimeType,
              data
            }
          },
          { text: prompt }
        ]
      });

      let suggestedName = response?.text ? response.text.trim() : null;
      if (suggestedName) {
        suggestedName = suggestedName.replace(/[`"'*]/g, '').trim();
        if (!suggestedName.toLowerCase().endsWith('.pdf')) {
          suggestedName += '.pdf';
        }
        return res.json({ success: true, suggestedName });
      }

      return res.json({ success: false, error: 'Could not generate name' });
    } catch (err: any) {
      console.warn('AI naming error:', err?.message || err);
      return res.status(err?.status || 500).json({
        success: false,
        error: err?.message || 'Failed AI renaming'
      });
    }
  });

  // Test API key endpoint
  app.post('/api/gemini/test-key', async (req, res) => {
    try {
      const { apiKey } = req.body;
      const keyToTest = apiKey || process.env.GEMINI_API_KEY;
      if (!keyToTest) {
        return res.status(400).json({ success: false, error: 'No API key provided' });
      }

      const ai = new GoogleGenAI({
        apiKey: keyToTest,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const response = await generateWithFallback(ai, {
        contents: 'Reply with "OK"'
      });

      return res.json({ success: !!response.text });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err?.message || 'API key test failed'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
