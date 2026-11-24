import StudyPlan from '../models/StudyPlan.js';

export const getStudyPlan = async (req, res, next) => {
  try {
    let plan = await StudyPlan.findOne({ user: req.user._id });

    if (!plan) {
      // Create initial plan with default target exam date 30 days from now
      const defaultExamDate = new Date();
      defaultExamDate.setDate(defaultExamDate.getDate() + 30);

      const todayStr = new Date().toISOString().split('T')[0];

      plan = await StudyPlan.create({
        user: req.user._id,
        title: 'Semester Final Exam Preparation',
        targetExamDate: defaultExamDate,
        subjects: req.user.subjects || ['Computer Science', 'Mathematics', 'Physics'],
        availableHoursPerDay: 3,
        dailyGoals: [
          {
            text: 'Review uploaded Lecture 1 digital notes',
            subject: req.user.subjects?.[0] || 'General',
            date: todayStr,
            completed: false,
          },
          {
            text: 'Practice 10 MCQs and 2 short questions',
            subject: req.user.subjects?.[0] || 'General',
            date: todayStr,
            completed: false,
          },
        ],
        generatedSchedule: [],
      });
    }

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const { title, targetExamDate, subjects, availableHoursPerDay } = req.body;
    let plan = await StudyPlan.findOne({ user: req.user._id });

    if (!plan) {
      plan = new StudyPlan({ user: req.user._id });
    }

    if (title) plan.title = title;
    if (targetExamDate) plan.targetExamDate = new Date(targetExamDate);
    if (subjects) plan.subjects = subjects;
    if (availableHoursPerDay) plan.availableHoursPerDay = availableHoursPerDay;

    await plan.save();

    res.json({
      success: true,
      message: 'Study plan updated',
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const generateSchedule = async (req, res, next) => {
  try {
    let plan = await StudyPlan.findOne({ user: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const { daysCount = 7 } = req.body;
    const subjects = plan.subjects && plan.subjects.length > 0 ? plan.subjects : ['Core Subject 1', 'Core Subject 2'];
    const hours = plan.availableHoursPerDay || 3;

    const schedule = [];
    const today = new Date();

    for (let i = 0; i < daysCount; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);
      const subject = subjects[i % subjects.length];

      schedule.push({
        dayNumber: i + 1,
        date: dayDate.toISOString().split('T')[0],
        focusSubject: subject,
        topics: [
          `Unit ${((i % 4) + 1)}: Theory & Conceptual Definitions`,
          `Practical Problem Sets & Numerical Applications`,
          `Flashcard Active Recall & Formula Revision`,
        ],
        studyHours: hours,
        revisionChecklist: [
          'Read structured digital notes',
          'Explain 3 key concepts aloud',
          'Solve generated quiz with >80% accuracy',
        ],
      });
    }

    plan.generatedSchedule = schedule;
    await plan.save();

    res.json({
      success: true,
      message: 'Smart study schedule generated successfully!',
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const addDailyGoal = async (req, res, next) => {
  try {
    const { text, subject, date } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide goal description' });
    }

    let plan = await StudyPlan.findOne({ user: req.user._id });
    if (!plan) {
      const defaultExamDate = new Date();
      defaultExamDate.setDate(defaultExamDate.getDate() + 30);
      plan = await StudyPlan.create({
        user: req.user._id,
        targetExamDate: defaultExamDate,
        dailyGoals: [],
      });
    }

    const todayStr = date || new Date().toISOString().split('T')[0];
    plan.dailyGoals.push({
      text,
      subject: subject || 'General',
      date: todayStr,
      completed: false,
    });

    await plan.save();

    res.status(201).json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleDailyGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const plan = await StudyPlan.findOne({ user: req.user._id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const goal = plan.dailyGoals.id(goalId);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.completed = !goal.completed;
    await plan.save();

    res.json({
      success: true,
      goal,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDailyGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const plan = await StudyPlan.findOne({ user: req.user._id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    plan.dailyGoals = plan.dailyGoals.filter((g) => g._id.toString() !== goalId);
    await plan.save();

    res.json({
      success: true,
      message: 'Goal removed',
      plan,
    });
  } catch (error) {
    next(error);
  }
};
