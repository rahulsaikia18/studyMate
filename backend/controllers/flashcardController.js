import FlashcardDeck from '../models/FlashcardDeck.js';

export const getDecks = async (req, res, next) => {
  try {
    const decks = await FlashcardDeck.find({ user: req.user._id })
      .populate('noteId', 'title subject')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: decks.length,
      decks,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeckById = async (req, res, next) => {
  try {
    const deck = await FlashcardDeck.findById(req.params.id).populate('noteId', 'title subject');
    if (!deck) {
      return res.status(404).json({ success: false, message: 'Flashcard deck not found' });
    }

    res.json({
      success: true,
      deck,
    });
  } catch (error) {
    next(error);
  }
};

export const createDeck = async (req, res, next) => {
  try {
    const { title, subject, cards, noteId } = req.body;

    if (!title || !cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide title and at least one flashcard' });
    }

    const deck = await FlashcardDeck.create({
      title,
      subject: subject || 'General',
      cards,
      noteId: noteId || null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      deck,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCardMastery = async (req, res, next) => {
  try {
    const { deckId, cardId } = req.params;
    const deck = await FlashcardDeck.findOne({ _id: deckId, user: req.user._id });

    if (!deck) {
      return res.status(404).json({ success: false, message: 'Deck not found' });
    }

    const card = deck.cards.id(cardId);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found in deck' });
    }

    card.mastered = !card.mastered;
    card.lastReviewed = new Date();
    await deck.save();

    res.json({
      success: true,
      card,
      deck,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDeck = async (req, res, next) => {
  try {
    const deck = await FlashcardDeck.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deck) {
      return res.status(404).json({ success: false, message: 'Deck not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Deck deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
