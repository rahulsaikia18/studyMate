import Note from '../models/Note.js';

export const getSharedNotes = async (req, res, next) => {
  try {
    const { search, subject, semester, sort } = req.query;

    const query = {
      isShared: true,
      shareScope: 'public',
    };

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

    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') sortOptions = { downloadsCount: -1, viewsCount: -1 };
    if (sort === 'views') sortOptions = { viewsCount: -1 };

    const notes = await Note.find(query)
      .populate('user', 'name course semester')
      .sort(sortOptions);

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      isShared: true,
      shareScope: 'public',
    }).populate('user', 'name course semester');

    if (!note) {
      return res.status(404).json({ success: false, message: 'Shared note not found or no longer public' });
    }

    note.viewsCount = (note.viewsCount || 0) + 1;
    await note.save();

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const cloneSharedNote = async (req, res, next) => {
  try {
    const originalNote = await Note.findOne({
      _id: req.params.id,
      isShared: true,
    });

    if (!originalNote) {
      return res.status(404).json({ success: false, message: 'Original note not found' });
    }

    // Clone to current user's library
    const clonedNote = await Note.create({
      title: `${originalNote.title} (Shared Copy)`,
      subject: originalNote.subject,
      semester: req.user.semester || originalNote.semester,
      tags: originalNote.tags,
      structuredContent: originalNote.structuredContent,
      rawExtractedText: originalNote.rawExtractedText,
      summary: originalNote.summary,
      language: originalNote.language,
      fileType: originalNote.fileType,
      user: req.user._id,
      isShared: false,
      shareScope: 'private',
    });

    originalNote.downloadsCount = (originalNote.downloadsCount || 0) + 1;
    await originalNote.save();

    res.status(201).json({
      success: true,
      message: 'Note successfully saved to your personal library!',
      note: clonedNote,
    });
  } catch (error) {
    next(error);
  }
};
