import { Context } from "hono";
import { programService } from "./program.service";

// Type definitions
interface CreateProgramRequest {
  name: string;
  description?: string;
}

interface UpdateProgramRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export const programController = {
  async createProgram(c: Context) {
    try {
      const programData: CreateProgramRequest = await c.req.json();
      
      // Validate required fields
      if (!programData.name) {
        throw new Error('Program name is required');
      }

      const newProgram = await programService.createProgram(programData);
      return c.json(newProgram, 201);
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: error.message || 'Failed to create program',
        details: error.details
      };
      return c.json(errorResponse, 400);
    }
  },

  async getProgram(c: Context) {
    try {
      const programId = c.req.param('programId');
      if (!programId) {
        throw new Error('Program ID is required');
      }

      const program = await programService.getProgram(programId);
      return c.json(program, 200);
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: error.message || 'Failed to get program',
        details: error.details
      };
      return c.json(errorResponse, 404);
    }
  },

  async getAllPrograms(c: Context) {
    try {
      const programs = await programService.getAllPrograms();
      return c.json(programs, 200);
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: error.message || 'Failed to get programs',
        details: error.details
      };
      return c.json(errorResponse, 400);
    }
  },

  async updateProgram(c: Context) {
    try {
      const programId = c.req.param('programId');
      if (!programId) {
        throw new Error('Program ID is required');
      }

      const updateData: UpdateProgramRequest = await c.req.json();
      const updatedProgram = await programService.updateProgram(programId, updateData);
      return c.json(updatedProgram, 200);
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: error.message || 'Failed to update program',
        details: error.details
      };
      return c.json(errorResponse, 400);
    }
  },

  async deleteProgram(c: Context) {
    try {
      const programId = c.req.param('programId');
      if (!programId) {
        throw new Error('Program ID is required');
      }

      const deletedProgram = await programService.deleteProgram(programId);
      return c.json(deletedProgram, 200);
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: error.message || 'Failed to delete program',
        details: error.details
      };
      return c.json(errorResponse, 400);
    }
  },

  async toggleProgramStatus(c: Context) {
    try {
      const programId = c.req.param('programId');
      if (!programId) {
        throw new Error('Program ID is required');
      }

      const updatedProgram = await programService.toggleProgramStatus(programId);
      return c.json(updatedProgram, 200);
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: error.message || 'Failed to toggle program status',
        details: error.details
      };
      return c.json(errorResponse, 400);
    }
  }
};

