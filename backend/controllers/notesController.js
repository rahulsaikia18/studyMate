import Note from '../models/Note.js';
import { processUploadedFile } from '../services/textExtractionService.js';
import { generateRevisionSummary } from '../services/groqService.js';
import path from 'path';
import fs from 'fs';

export const uploadAndExtractNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image or PDF file' });
    }

    const { title, subject, semester, tags } = req.body;
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Process file and extract/structure content
    const { rawText, structuredContent, fileType, language } = await processUploadedFile(
      filePath,
      originalName,
      mimeType
    );

    const relativeUrl = `/uploads/${path.basename(filePath)}`;
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [];

    // Automatically generate summary
    const summary = await generateRevisionSummary(structuredContent);

    const note = await Note.create({
      title: title || originalName.replace(/\.[^/.]+$/, ''),
      subject: subject || 'General',
      semester: semester || req.user.semester || 'Semester 1',
      tags: parsedTags,
      rawExtractedText: rawText,
      structuredContent,
      summary,
      language,
      fileType,
      originalFileName: originalName,
      fileUrl: relativeUrl,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded, extracted, and structured successfully!',
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, subject, semester, tags, structuredContent, rawExtractedText, language } = req.body;

    if (!title || !structuredContent) {
      return res.status(400).json({ success: false, message: 'Please provide note title and content' });
    }

    const summary = await generateRevisionSummary(structuredContent);

    const note = await Note.create({
      title,
      subject: subject || 'General',
      semester: semester || 'Semester 1',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      structuredContent,
      rawExtractedText: rawExtractedText || structuredContent,
      summary,
      language: language || 'en',
      fileType: 'text',
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const { search, subject, semester, sort } = req.query;
    const query = { user: req.user._id };

    if (subject && subject !== 'All') {
      query.subject = subject;
    }
    if (semester && semester !== 'All') {
      query.semester = semester;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { structuredContent: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOptions = { updatedAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'title') sortOptions = { title: 1 };

    const notes = await Note.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check ownership or community shared access
    const isOwner = note.user.toString() === req.user._id.toString();
    if (!isOwner && (!note.isShared || note.shareScope !== 'public')) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this private note' });
    }

    // Increment views if viewing someone else's shared note
    if (!isOwner) {
      note.viewsCount = (note.viewsCount || 0) + 1;
      await note.save();
    }

    res.json({
      success: true,
      note,
      isOwner,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    const { title, subject, semester, tags, structuredContent, summary } = req.body;

    if (title) note.title = title;
    if (subject) note.subject = subject;
    if (semester) note.semester = semester;
    if (tags) note.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    if (structuredContent) note.structuredContent = structuredContent;
    if (summary !== undefined) note.summary = summary;

    await note.save();

    res.json({
      success: true,
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    // Delete associated physical upload file if exists
    if (note.fileUrl) {
      const fullPath = path.resolve(note.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.warn('Could not delete physical file', e.message);
        }
      }
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleShareNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.isShared = !note.isShared;
    note.shareScope = note.isShared ? 'public' : 'private';
    await note.save();

    res.json({
      success: true,
      isShared: note.isShared,
      message: note.isShared ? 'Note shared with the StudyMate community!' : 'Note set to private',
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.downloadsCount = (note.downloadsCount || 0) + 1;
    await note.save();

    const formattedExport = `========================================================
STUDYMATE DIGITAL STUDY NOTES
Title: ${note.title}
Subject: ${note.subject} | Semester: ${note.semester}
Language: ${note.language.toUpperCase()}
Exported on: ${new Date().toLocaleDateString()}
========================================================

${note.structuredContent}

========================================================
Summary & Revision Points:
${note.summary || 'N/A'}
========================================================
`;

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${note.title.replace(/[^a-zA-Z0-9]/g, '_')}_StudyMate.md"`);
    res.send(formattedExport);
  } catch (error) {
    next(error);
  }
};
