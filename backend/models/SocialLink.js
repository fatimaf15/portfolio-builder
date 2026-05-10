import mongoose from 'mongoose';

const SocialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Please specify the social platform'],
      enum: {
        values: ['GitHub', 'LinkedIn', 'Twitter', 'Portfolio', 'Other'],
        message: '{VALUE} is not a supported social platform',
      },
    },
    url: {
      type: String,
      required: [true, 'Please provide the social profile URL'],
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid profile URL',
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A social link must belong to a registered developer'],
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique platform mapping per user (e.g., a developer cannot have multiple GitHub links)
SocialLinkSchema.index({ platform: 1, user: 1 }, { unique: true });

export default mongoose.model('SocialLink', SocialLinkSchema);
