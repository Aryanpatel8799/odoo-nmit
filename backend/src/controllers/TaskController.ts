import { Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { Task, Project } from '@/models';
import { ResponseUtils, QueryUtils } from '@/utils';
import { AuthenticatedRequest } from '@/middleware';
import { TaskStatus } from '@/types';

export class TaskController {
  // Validation rules
  static createValidation = [
    body('projectId').isMongoId().withMessage('Invalid project ID'),
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Task title is required and cannot exceed 200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('assigneeId').optional().isMongoId().withMessage('Invalid assignee ID'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ];

  static updateValidation = [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Task title cannot exceed 200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('assigneeId').optional().isMongoId().withMessage('Invalid assignee ID'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
    body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Status must be todo, in_progress, or done'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ];

  // Get all tasks for a project
  static async getTasks(req: any, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user._id;
      const queryOptions = QueryUtils.parseQueryOptions(req.query);

      // Check if user has access to the project
      const project = await Project.findOne({
        _id: projectId,
        $or: [
          { ownerId: userId },
          { 'members.userId': userId }
        ],
        isActive: true,
      });

      if (!project) {
        ResponseUtils.notFound(res, 'Project not found or access denied');
        return;
      }

      const query: any = { projectId };

      // Add search functionality
      if (queryOptions.search) {
        const searchQuery = QueryUtils.buildSearchQuery(queryOptions.search, ['title', 'description']);
        Object.assign(query, searchQuery);
      }

      // Add status filter
      if (req.query.status) {
        query.status = req.query.status;
      }

      // Add assignee filter
      if (req.query.assigneeId) {
        query.assigneeId = req.query.assigneeId;
      }

      // Add priority filter
      if (req.query.priority) {
        query.priority = req.query.priority;
      }

      const skip = QueryUtils.calculateSkip(queryOptions.page!, queryOptions.limit!);
      const sort = QueryUtils.buildSortObject(queryOptions.sort!, queryOptions.order!);

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .sort(sort)
          .skip(skip)
          .limit(queryOptions.limit!)
          .populate('assigneeId', 'name email avatarUrl')
          .lean(),
        Task.countDocuments(query),
      ]);

      ResponseUtils.paginated(
        res,
        tasks,
        queryOptions.page!,
        queryOptions.limit!,
        total,
        'Tasks retrieved successfully'
      );

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Get tasks assigned to the current user
  static async getMyTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const queryOptions = QueryUtils.parseQueryOptions(req.query);

      const query: any = { assigneeId: userId };

      // Add search functionality
      if (queryOptions.search) {
        const searchQuery = QueryUtils.buildSearchQuery(queryOptions.search, ['title', 'description']);
        Object.assign(query, searchQuery);
      }

      // Add status filter
      if (req.query.status) {
        query.status = req.query.status;
      }

      // Add priority filter
      if (req.query.priority) {
        query.priority = req.query.priority;
      }

      const skip = QueryUtils.calculateSkip(queryOptions.page!, queryOptions.limit!);
      const sort = QueryUtils.buildSortObject(queryOptions.sort!, queryOptions.order!);

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .sort(sort)
          .skip(skip)
          .limit(queryOptions.limit!)
          .populate('projectId', 'name')
          .populate('assigneeId', 'name email avatarUrl')
          .lean(),
        Task.countDocuments(query),
      ]);

      ResponseUtils.paginated(
        res,
        tasks,
        queryOptions.page!,
        queryOptions.limit!,
        total,
        'My tasks retrieved successfully'
      );

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Get a single task by ID
  static async getTask(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const task = await Task.findById(id)
        .populate('projectId', 'name ownerId members')
        .populate('assigneeId', 'name email avatarUrl');

      if (!task) {
        ResponseUtils.notFound(res, 'Task not found');
        return;
      }

      // Check if user has access to the project
      const project = task.projectId as any;
      const hasAccess = project.ownerId.toString() === userId.toString() ||
        project.members.some((member: any) => member.userId.toString() === userId.toString());

      if (!hasAccess) {
        ResponseUtils.forbidden(res, 'Access denied');
        return;
      }

      ResponseUtils.success(res, task, 'Task retrieved successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Create a new task
  static async createTask(req: any, res: Response): Promise<void> {
    try {
      const { projectId, title, description, assigneeId, dueDate, priority, tags } = req.body;
      const userId = req.user._id;

      // Check if user has access to the project
      const project = await Project.findOne({
        _id: projectId,
        $or: [
          { ownerId: userId },
          { 'members.userId': userId }
        ],
        isActive: true,
      });

      if (!project) {
        ResponseUtils.notFound(res, 'Project not found or access denied');
        return;
      }

      // If assigneeId is provided, check if they are a member of the project
      if (assigneeId) {
        const isAssigneeMember = project.ownerId.toString() === assigneeId ||
          project.members.some((member: any) => member.userId.toString() === assigneeId);

        if (!isAssigneeMember) {
          ResponseUtils.error(res, 'Assignee is not a member of this project', 400);
          return;
        }
      }

      const taskData: any = {
        projectId,
        title,
        description,
        assigneeId: assigneeId || null,
        priority: priority || 'medium',
        tags: tags || [],
      };

      if (dueDate) {
        taskData.dueDate = new Date(dueDate);
      }

      const task = new Task(taskData);
      await task.save();

      // Populate the created task
      const populatedTask = await Task.findById(task._id)
        .populate('assigneeId', 'name email avatarUrl')
        .populate('projectId', 'name');

      ResponseUtils.created(res, populatedTask, 'Task created successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Update a task
  static async updateTask(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, assigneeId, dueDate, status, priority, tags } = req.body;
      const userId = req.user._id;

      const task = await Task.findById(id).populate('projectId', 'ownerId members');

      if (!task) {
        ResponseUtils.notFound(res, 'Task not found');
        return;
      }

      // Check if user has access to the project
      const project = task.projectId as any;
      const hasAccess = project.ownerId.toString() === userId.toString() ||
        project.members.some((member: any) => member.userId.toString() === userId.toString());

      if (!hasAccess) {
        ResponseUtils.forbidden(res, 'Access denied');
        return;
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (tags !== undefined) updateData.tags = tags;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('assigneeId', 'name email avatarUrl')
        .populate('projectId', 'name');

      ResponseUtils.success(res, updatedTask, 'Task updated successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Delete a task
  static async deleteTask(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const task = await Task.findById(id).populate('projectId', 'ownerId members');

      if (!task) {
        ResponseUtils.notFound(res, 'Task not found');
        return;
      }

      // Check if user has access to the project
      const project = task.projectId as any;
      const hasAccess = project.ownerId.toString() === userId.toString() ||
        project.members.some((member: any) => member.userId.toString() === userId.toString());

      if (!hasAccess) {
        ResponseUtils.forbidden(res, 'Access denied');
        return;
      }

      await Task.findByIdAndDelete(id);

      ResponseUtils.success(res, null, 'Task deleted successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }

  // Update task status
  static async updateTaskStatus(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user._id;

      if (!['todo', 'in_progress', 'done'].includes(status)) {
        ResponseUtils.error(res, 'Invalid status', 400);
        return;
      }

      const task = await Task.findById(id).populate('projectId', 'ownerId members');

      if (!task) {
        ResponseUtils.notFound(res, 'Task not found');
        return;
      }

      // Check if user has access to the project
      const project = task.projectId as any;
      const hasAccess = project.ownerId.toString() === userId.toString() ||
        project.members.some((member: any) => member.userId.toString() === userId.toString());

      if (!hasAccess) {
        ResponseUtils.forbidden(res, 'Access denied');
        return;
      }

      task.status = status as TaskStatus;
      await task.save();

      const updatedTask = await Task.findById(id)
        .populate('assigneeId', 'name email avatarUrl')
        .populate('projectId', 'name');

      ResponseUtils.success(res, updatedTask, 'Task status updated successfully');

    } catch (error: any) {
      ResponseUtils.serverError(res, error.message);
    }
  }
}
