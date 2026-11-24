import mongoose from 'mongoose';

const dailyGoalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: 'General',
  },
  date: {
    type: String,
    required: true, // YYYY-MM-DD
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const scheduleMilestoneSchema = new mongoose.Schema({
  dayNumber: Number,
  date: String,
  focusSubject: String,
  topics: [String],
  studyHours: {
    type: Number,
    default: 2,
  },
  revisionChecklist: [String],
});

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Semester Exam Preparation',
    },
    targetExamDate: {
      type: Date,
      required: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    availableHoursPerDay: {
      type: Number,
      default: 3,
    },
    dailyGoals: [dailyGoalSchema],
    generatedSchedule: [scheduleMilestoneSchema],
  },
  {
    timestamps: true,
  }
);

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;
