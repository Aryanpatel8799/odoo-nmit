import { Router } from 'express';
import { TaskController } from '@/controllers/TaskController';
import { authenticate, validate } from '@/middleware';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Task routes
router.get('/my-tasks', TaskController.getMyTasks);
router.get('/project/:projectId', TaskController.getTasks);
router.post('/', validate(TaskController.createValidation), TaskController.createTask);

router.get('/:id', TaskController.getTask);
router.put('/:id', validate(TaskController.updateValidation), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

// Task status update
router.patch('/:id/status', TaskController.updateTaskStatus);

export default router;
