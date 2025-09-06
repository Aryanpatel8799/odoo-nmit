import { Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { Project, User } from '@/models';
import { ResponseUtils, QueryUtils } from '@/utils';
import { AuthenticatedRequest } from '@/middleware';

export class ProjectController {
  // Validation rules
  static createValidation = [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Project name is required and cannot exceed 100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  ];

  static updateValidation = [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Project name cannot exceed 100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  ];

  static getProjectValidation = [
    param('id').isMongoId().withMessage('Invalid project ID'),
  ];

  static addMemberValidation = [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('role').isIn(['member', 'owner']).withMessage('Role must be either member or owner'),
  ];

  // Get all projects for the authenticated user
  static async getProjects(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const queryOptions = QueryUtils.parseQueryOptions(req.query);
      const userId = req.user._id;

      const query: any = {
        $or: [
          { ownerId: userId },
          { 'members.userId': userId }
        ],
        isActive: true,
      };

      // Add search functionality
      if (queryOptions.search) {
        const searchQuery = QueryUtils.buildSearchQuery(queryOptions.search, ['name', 'description']);
        query.$and = [query, searchQuery];
      }

      const skip = QueryUtils.calculateSkip(queryOptions.page!, queryOptions.limit!);
      const sort = QueryUtils.buildSortObject(queryOptions.sort!, queryOptions.order!);

      const [projects, total] = await Promise.all([
        Project.find(query)
          .sort(sort)
          .skip(skip)
          .limit(queryOptions.limit!)
          .populate('ownerId', 'name email avatarUrl')
          .populate('members.userId', 'name email avatarUrl')
          .lean(),
        Project.countDocuments(query),
      ]);

      ResponseUtils.paginated(
        res,
        projects,
        queryOptions.page!,
        queryOptions.limit!,
        total,
        'Projects retrieved successfully'
      );

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Get a single project by ID
  static async getProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const project = await Project.findOne({
        _id: id,
        $or: [
          { ownerId: userId },
          { 'members.userId': userId }
        ],
        isActive: true,
      })
        .populate('ownerId', 'name email avatarUrl')
        .populate('members.userId', 'name email avatarUrl');

      if (!project) {
        ResponseUtils.notFound(res, 'Project not found');
        return;
      }

      ResponseUtils.success(res, project, 'Project retrieved successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Create a new project
  static async createProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, description, tags, deadline } = req.body;
      const userId = req.user._id;

      const projectData: any = {
        name,
        description,
        ownerId: userId,
        tags: tags || [],
      };

      if (deadline) {
        projectData.deadline = new Date(deadline);
      }

      const project = new Project(projectData);
      await project.save();

      // Populate the created project
      const populatedProject = await Project.findById(project._id)
        .populate('ownerId', 'name email avatarUrl')
        .populate('members.userId', 'name email avatarUrl');

      ResponseUtils.created(res, populatedProject, 'Project created successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Update a project
  static async updateProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, tags, deadline } = req.body;
      const userId = req.user._id;

      // Check if user is the owner
      const project = await Project.findOne({
        _id: id,
        ownerId: userId,
        isActive: true,
      });

      if (!project) {
        ResponseUtils.notFound(res, 'Project not found or you are not authorized to update it');
        return;
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (tags !== undefined) updateData.tags = tags;
      if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;

      const updatedProject = await Project.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('ownerId', 'name email avatarUrl')
        .populate('members.userId', 'name email avatarUrl');

      ResponseUtils.success(res, updatedProject, 'Project updated successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Delete a project (soft delete)
  static async deleteProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const project = await Project.findOne({
        _id: id,
        ownerId: userId,
        isActive: true,
      });

      if (!project) {
        ResponseUtils.notFound(res, 'Project not found or you are not authorized to delete it');
        return;
      }

      project.isActive = false;
      await project.save();

      ResponseUtils.success(res, null, 'Project deleted successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Add a member to the project
  static async addMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId: memberUserId, role } = req.body;
      const currentUserId = req.user._id;

      // Check if current user is the owner
      const project = await Project.findOne({
        _id: id,
        ownerId: currentUserId,
        isActive: true,
      });

      if (!project) {
        ResponseUtils.notFound(res, 'Project not found or you are not authorized');
        return;
      }

      // Check if user exists
      const memberUser = await User.findById(memberUserId);
      if (!memberUser || !memberUser.isActive) {
        ResponseUtils.notFound(res, 'User not found or inactive');
        return;
      }

      // Check if user is already a member
      const existingMember = project.members.find(
        member => member.userId.toString() === memberUserId
      );

      if (existingMember) {
        ResponseUtils.error(res, 'User is already a member of this project', 409);
        return;
      }

      // Add member
      project.members.push({
        userId: memberUserId,
        role: role || 'member',
        joinedAt: new Date(),
      });

      await project.save();

      const updatedProject = await Project.findById(id)
        .populate('ownerId', 'name email avatarUrl')
        .populate('members.userId', 'name email avatarUrl');

      ResponseUtils.success(res, updatedProject, 'Member added successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Remove a member from the project
  static async removeMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id, userId: memberUserId } = req.params;
      const currentUserId = req.user._id;

      // Check if current user is the owner
      const project = await Project.findOne({
        _id: id,
        ownerId: currentUserId,
        isActive: true,
      });

      if (!project) {
        ResponseUtils.notFound(res, 'Project not found or you are not authorized');
        return;
      }

      // Cannot remove the owner
      if (memberUserId === currentUserId.toString()) {
        ResponseUtils.error(res, 'Cannot remove the project owner', 400);
        return;
      }

      // Remove member
      project.members = project.members.filter(
        member => member.userId.toString() !== memberUserId
      );

      await project.save();

      const updatedProject = await Project.findById(id)
        .populate('ownerId', 'name email avatarUrl')
        .populate('members.userId', 'name email avatarUrl');

      ResponseUtils.success(res, updatedProject, 'Member removed successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }
}
