import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { HealthProgram } from "../drizzle/schema";

// Type definitions
interface CreateProgramInput {
  name: string;
  description?: string;
}

interface UpdateProgramInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Health Program Service
export const programService = {
  async createProgram(programData: CreateProgramInput) {
    const programId = `PROG-${Date.now()}`;
    
    const [newProgram] = await db
      .insert(HealthProgram)
      .values({
        programId,
        name: programData.name,
        description: programData.description,
        isActive: true,
      })
      .returning()
      .execute();

    return newProgram;
  },

  async getProgram(programId: string) {
    const [program] = await db
      .select()
      .from(HealthProgram)
      .where(eq(HealthProgram.programId, programId))
      .execute();

    if (!program) {
      throw new Error('Program not found');
    }

    return program;
  },

  async getAllPrograms() {
    const programs = await db
      .select()
      .from(HealthProgram)
      .execute();

    return programs;
  },

  async updateProgram(programId: string, updateData: UpdateProgramInput) {
    const [updatedProgram] = await db
      .update(HealthProgram)
      .set({
        name: updateData.name,
        description: updateData.description,
        isActive: updateData.isActive,
      })
      .where(eq(HealthProgram.programId, programId))
      .returning()
      .execute();

    if (!updatedProgram) {
      throw new Error('Program not found');
    }

    return updatedProgram;
  },

  async deleteProgram(programId: string) {
    const [deletedProgram] = await db
      .delete(HealthProgram)
      .where(eq(HealthProgram.programId, programId))
      .returning()
      .execute();

    if (!deletedProgram) {
      throw new Error('Program not found');
    }

    return deletedProgram;
  },

  async toggleProgramStatus(programId: string) {
    const [program] = await db
      .select()
      .from(HealthProgram)
      .where(eq(HealthProgram.programId, programId))
      .execute();

    if (!program) {
      throw new Error('Program not found');
    }

    const [updatedProgram] = await db
      .update(HealthProgram)
      .set({
        isActive: !program.isActive,
      })
      .where(eq(HealthProgram.programId, programId))
      .returning()
      .execute();

    return updatedProgram;
  }
};
