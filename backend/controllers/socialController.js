import SocialLink from '../models/SocialLink.js';

// @desc    Get all social profile links for the logged-in user
// @route   GET /api/socials
// @access  Private
export const getSocials = async (req, res, next) => {
  try {
    const socials = await SocialLink.find({ user: req.user.id }).sort({ platform: 1 });
    res.status(200).json({
      success: true,
      count: socials.length,
      data: socials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update a social link (Upsert by platform)
// @route   POST /api/socials
// @access  Private
export const createOrUpdateSocial = async (req, res, next) => {
  try {
    const { platform, url } = req.body;

    if (!platform || !url) {
      res.status(400);
      throw new Error('Please provide both the platform type and the profile URL');
    }

    // Attempt to upsert: search if user + platform combination already exists
    let socialLink = await SocialLink.findOne({ platform, user: req.user.id });

    if (socialLink) {
      // Update existing mapping
      socialLink.url = url;
      await socialLink.save();
      res.status(200).json({
        success: true,
        message: `${platform} profile updated successfully`,
        data: socialLink,
      });
    } else {
      // Create a brand new mapping
      socialLink = await SocialLink.create({
        platform,
        url,
        user: req.user.id,
      });
      res.status(201).json({
        success: true,
        message: `${platform} profile linked successfully`,
        data: socialLink,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update single social link by ID
// @route   PUT /api/socials/:id
// @access  Private (Ownership verified)
export const updateSocialById = async (req, res, next) => {
  try {
    let socialLink = await SocialLink.findById(req.params.id);

    if (!socialLink) {
      res.status(404);
      throw new Error(`Social link record not found with id of ${req.params.id}`);
    }

    // Verify ownership
    if (socialLink.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to edit this social profile link');
    }

    socialLink = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Social link updated successfully',
      data: socialLink,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete social link
// @route   DELETE /api/socials/:id
// @access  Private (Ownership verified)
export const deleteSocial = async (req, res, next) => {
  try {
    const socialLink = await SocialLink.findById(req.params.id);

    if (!socialLink) {
      res.status(404);
      throw new Error(`Social link record not found with id of ${req.params.id}`);
    }

    // Verify ownership
    if (socialLink.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this social link');
    }

    await socialLink.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Social link deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
