import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide student email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
    },
    course: {
      type: String,
      default: 'General Studies',
      trim: true,
    },
    semester: {
      type: String,
      default: 'Semester 1',
      trim: true,
    },
    subjects: {
      type: [String],
      default: ['Computer Science', 'Mathematics', 'Physics'],
    },
    avatar: {
      type: String,
      default: '',
    },
    studyStreak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Method to return user representation without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
