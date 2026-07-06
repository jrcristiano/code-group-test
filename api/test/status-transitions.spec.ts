import { isTransitionAllowed, canDeleteProject } from '../src/common/status-transitions';
import { ProjectStatus } from '../src/common/project-status.enum';

describe('Status Transitions', () => {
  describe('isTransitionAllowed', () => {
    it('should allow IN_REVIEW -> APPROVED', () => {
      expect(isTransitionAllowed(ProjectStatus.IN_REVIEW, ProjectStatus.APPROVED)).toBe(true);
    });

    it('should NOT allow IN_REVIEW -> IN_PROGRESS (skip step)', () => {
      expect(isTransitionAllowed(ProjectStatus.IN_REVIEW, ProjectStatus.IN_PROGRESS)).toBe(false);
    });

    it('should NOT allow IN_REVIEW -> FINISHED (skip step)', () => {
      expect(isTransitionAllowed(ProjectStatus.IN_REVIEW, ProjectStatus.FINISHED)).toBe(false);
    });

    it('should allow APPROVED -> IN_PROGRESS', () => {
      expect(isTransitionAllowed(ProjectStatus.APPROVED, ProjectStatus.IN_PROGRESS)).toBe(true);
    });

    it('should allow IN_PROGRESS -> FINISHED', () => {
      expect(isTransitionAllowed(ProjectStatus.IN_PROGRESS, ProjectStatus.FINISHED)).toBe(true);
    });

    it('should allow IN_REVIEW -> CANCELED', () => {
      expect(isTransitionAllowed(ProjectStatus.IN_REVIEW, ProjectStatus.CANCELED)).toBe(true);
    });

    it('should allow APPROVED -> CANCELED', () => {
      expect(isTransitionAllowed(ProjectStatus.APPROVED, ProjectStatus.CANCELED)).toBe(true);
    });

    it('should allow IN_PROGRESS -> CANCELED', () => {
      expect(isTransitionAllowed(ProjectStatus.IN_PROGRESS, ProjectStatus.CANCELED)).toBe(true);
    });

    it('should allow FINISHED -> CANCELED', () => {
      expect(isTransitionAllowed(ProjectStatus.FINISHED, ProjectStatus.CANCELED)).toBe(true);
    });

    it('should NOT allow CANCELED -> any other status', () => {
      expect(isTransitionAllowed(ProjectStatus.CANCELED, ProjectStatus.IN_REVIEW)).toBe(false);
      expect(isTransitionAllowed(ProjectStatus.CANCELED, ProjectStatus.APPROVED)).toBe(false);
      expect(isTransitionAllowed(ProjectStatus.CANCELED, ProjectStatus.IN_PROGRESS)).toBe(false);
      expect(isTransitionAllowed(ProjectStatus.CANCELED, ProjectStatus.FINISHED)).toBe(false);
    });

    it('should NOT allow FINISHED -> any status other than CANCELED', () => {
      expect(isTransitionAllowed(ProjectStatus.FINISHED, ProjectStatus.IN_REVIEW)).toBe(false);
      expect(isTransitionAllowed(ProjectStatus.FINISHED, ProjectStatus.APPROVED)).toBe(false);
      expect(isTransitionAllowed(ProjectStatus.FINISHED, ProjectStatus.IN_PROGRESS)).toBe(false);
    });

    it('should NOT allow transition to same status', () => {
      expect(isTransitionAllowed(ProjectStatus.IN_REVIEW, ProjectStatus.IN_REVIEW)).toBe(false);
      expect(isTransitionAllowed(ProjectStatus.APPROVED, ProjectStatus.APPROVED)).toBe(false);
    });
  });

  describe('canDeleteProject', () => {
    it('should allow deletion of IN_REVIEW project', () => {
      expect(canDeleteProject(ProjectStatus.IN_REVIEW)).toBe(true);
    });

    it('should allow deletion of APPROVED project', () => {
      expect(canDeleteProject(ProjectStatus.APPROVED)).toBe(true);
    });

    it('should allow deletion of CANCELED project', () => {
      expect(canDeleteProject(ProjectStatus.CANCELED)).toBe(true);
    });

    it('should NOT allow deletion of IN_PROGRESS project', () => {
      expect(canDeleteProject(ProjectStatus.IN_PROGRESS)).toBe(false);
    });

    it('should NOT allow deletion of FINISHED project', () => {
      expect(canDeleteProject(ProjectStatus.FINISHED)).toBe(false);
    });
  });
});
