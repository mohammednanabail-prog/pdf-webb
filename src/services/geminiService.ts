import { AIAnalysisResult, SmartDocumentAnalysis } from '../types';

const STORAGE_KEY = 'gemini_user_api_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to save API key to local storage:', err);
  }
}

export function removeApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to remove API key:', err);
  }
}

export async function checkServerHasApiKey(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return !!data.hasServerApiKey;
    }
    return false;
  } catch {
    return false;
  }
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch('/api/gemini/test-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: apiKey.trim() })
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('API key test failed:', err);
    return false;
  }
}

export async function analyzeDocumentForRenaming(
  dataUrl: string,
  lang: 'ar' | 'en' | 'fr' = 'ar'
): Promise<string | null> {
  const apiKey = getStoredApiKey();

  try {
    const res = await fetch('/api/gemini/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, lang, apiKey })
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.suggestedName || null;
  } catch (err) {
    console.warn('AI renaming unavailable, skipping:', err);
    return null;
  }
}

export async function extractTextAndSummarize(
  dataUrl: string,
  lang: 'ar' | 'en' | 'fr' = 'ar'
): Promise<AIAnalysisResult | null> {
  const apiKey = getStoredApiKey();

  try {
    const res = await fetch('/api/gemini/ocr-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, lang, apiKey })
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.result || null;
  } catch (err) {
    console.warn('AI OCR unavailable:', err);
    return null;
  }
}

// Smart Document Content Analysis & Auto-Renaming
export async function analyzeAndRenameDocument(
  dataUrl: string,
  mimeType: string,
  originalName: string,
  lang: 'ar' | 'en' | 'fr' = 'ar'
): Promise<SmartDocumentAnalysis | null> {
  const apiKey = getStoredApiKey();

  try {
    const res = await fetch('/api/gemini/analyze-and-rename-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl,
        mimeType,
        originalName,
        lang,
        apiKey
      })
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.success && data.analysis) {
      return data.analysis as SmartDocumentAnalysis;
    }
    return null;
  } catch (err) {
    console.warn('AI document analysis failed:', err);
    return null;
  }
}
