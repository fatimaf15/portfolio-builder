import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
      trim: true,
    },
    level: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        message: '{VALUE} is not a supported skill level',
      },
      default: 'Intermediate',
    },
    category: {
      type: String,
      enum: {
        values: ['Frontend', 'Backend', 'DevOps', 'Database', 'Language', 'Design', 'Other'],
        message: '{VALUE} is not a valid skill category',
      },
      default: 'Frontend',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A skill must belong to a registered developer'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate skills for the same user
SkillSchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model('Skill', SkillSchema);
