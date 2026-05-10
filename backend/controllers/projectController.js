import Project from '../models/Project.js';

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private (Ownership verified)
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error(`Project not found with id of ${req.params.id}`);
    }

    // Verify user owns the project
    if (project.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    // Inject logged-in user reference ID
    req.body.user = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Ownership verified)
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error(`Project not found with id of ${req.params.id}`);
    }

    // Verify ownership
    if (project.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Ownership verified)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error(`Project not found with id of ${req.params.id}`);
    }

    // Verify ownership
    if (project.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};
