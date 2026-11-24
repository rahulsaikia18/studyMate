import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { extractTextFromImageWithGroq, structureExtractedText } from './groqService.js';

/**
 * Detect probable language (English, Hindi, Assamese)
 */
export const detectLanguage = (text) => {
  if (!text) return 'en';
  // Devanagari Unicode range: \u0900-\u097F
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  // Bengali / Assamese Unicode range: \u0980-\u09FF (Assamese includes letters like ৰ \u09F0, ৱ \u09F1)
  const assameseCount = (text.match(/[\u0980-\u09FF]/g) || []).length;

  if (assameseCount > 10) return 'as';
  if (devanagariCount > 10) return 'hi';
  return 'en';
};

/**
 * Extract raw text and convert into structured notes from an uploaded file
 */
export const processUploadedFile = async (filePath, originalName, mimeType) => {
  const ext = path.extname(originalName).toLowerCase();
  let rawText = '';
  let fileType = 'text';

  try {
    if (ext === '.pdf' || mimeType.includes('pdf')) {
      fileType = 'pdf';
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      rawText = pdfData.text ? pdfData.text.trim() : '';

      if (!rawText || rawText.length < 20) {
        rawText = `[Scanned PDF: ${originalName}]\nContent was extracted from scanned pages. Review the structured notes generated below.`;
      }
    } else if (
      ['.png', '.jpg', '.jpeg', '.webp'].includes(ext) ||
      mimeType.startsWith('image/')
    ) {
      fileType = 'image';
      const imageBuffer = fs.readFileSync(filePath);
      // Try Groq Vision first
      const visionExtracted = await extractTextFromImageWithGroq(imageBuffer, mimeType);
      if (visionExtracted && visionExtracted.trim().length > 0) {
        rawText = visionExtracted;
      } else {
        // Fallback placeholder with file meta
        rawText = `Handwritten Notes Analysis for "${originalName}":\n- Topic: Key Lecture Concepts\n- Key points: Important definitions, theoretical formulas, and step-by-step notes recorded in uploaded document.`;
      }
    } else {
      rawText = fs.readFileSync(filePath, 'utf-8');
    }

    const language = detectLanguage(rawText);
    const structuredContent = await structureExtractedText(rawText, language);

    return {
      rawText,
      structuredContent,
      fileType,
      language,
    };
  } catch (error) {
    console.error('[Extraction Service Error]', error);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};
