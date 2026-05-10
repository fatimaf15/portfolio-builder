import Skill from '../models/Skill.js';

// @desc    Get all skills for the logged-in user
// @route   GET /api/skills
// @access  Private
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    // Check if the skill already exists for this user to return a friendly message
    const existingSkill = await Skill.findOne({ name: req.body.name, user: req.user.id });
    if (existingSkill) {
      res.status(400);
      throw new Error('This technology is already in your skills inventory');
    }

    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Skill registered successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill details (level or category)
// @route   PUT /api/skills/:id
// @access  Private (Ownership verified)
export const updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error(`Skill record not found with id of ${req.params.id}`);
    }

    // Verify ownership
    if (skill.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to edit this skill');
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove skill
// @route   DELETE /api/skills/:id
// @access  Private (Ownership verified)
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error(`Skill record not found with id of ${req.params.id}`);
    }

    // Verify ownership
    if (skill.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this skill');
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill successfully removed from your inventory',
    });
  } catch (error) {
    next(error);
  }
};
