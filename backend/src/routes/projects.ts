import { Router } from 'express';
import { ProjectController } from '@/controllers/ProjectController';
import { authenticate, validate } from '@/middleware';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Project routes
router.get('/', ProjectController.getProjects);
router.post('/', validate(ProjectController.createValidation), ProjectController.createProject);

router.get('/:id', validate(ProjectController.getProjectValidation), ProjectController.getProject);
router.put('/:id', validate(ProjectController.updateValidation), ProjectController.updateProject);
router.delete('/:id', validate(ProjectController.getProjectValidation), ProjectController.deleteProject);

// Member management
router.post('/:id/members', validate(ProjectController.addMemberValidation), ProjectController.addMember);
router.delete('/:id/members/:userId', ProjectController.removeMember);

export default router;
