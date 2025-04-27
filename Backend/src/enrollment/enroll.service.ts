import db from "../drizzle/db";
import { eq, and, or } from "drizzle-orm";
import { Enrollment, User, HealthProgram } from "../drizzle/schema";

// Create new enrollment
export const createEnrollmentService = async (enrollmentData: {
  userId: string;
  programId: string;
  notes?: string;
}) => {
  console.log("Creating Enrollment with Data:", enrollmentData);

  // Check if enrollment already exists
  const existingEnrollment = await db.query.Enrollment.findFirst({
    where: and(
      eq(Enrollment.userId, enrollmentData.userId),
      eq(Enrollment.programId, enrollmentData.programId)
    ),
  });

  if (existingEnrollment) {
    console.log("Enrollment already exists:", existingEnrollment);
    return null;
  }

  const result = await db
    .insert(Enrollment)
    .values({
      userId: enrollmentData.userId,
      programId: enrollmentData.programId,
      notes: enrollmentData.notes,
      status: 'active',
      progress: 0
    })
    .returning({
      id: Enrollment.id,
      userId: Enrollment.userId,
      programId: Enrollment.programId,
      status: Enrollment.status
    })
    .execute();

  console.log("Created Enrollment Response:", result);
  return result[0];
};

// Get all enrollments
export const getAllEnrollmentsService = async () => {
  try {
    const enrollments = await db.query.Enrollment.findMany({
      with: {
        user: {
          columns: {
            userId: true,
            email: true,
            role: true
          }
        },
        program: {
          columns: {
            programId: true,
            name: true
          }
        }
      }
    });
    console.log("Enrollments Retrieved:", enrollments);
    return enrollments;
  } catch (err) {
    console.error("Error in getAllEnrollmentsService:", err);
    throw err;
  }
};

// Get enrollments by user ID
export const getEnrollmentsByUserIdService = async (userId: string) => {
  return await db.query.Enrollment.findMany({
    where: eq(Enrollment.userId, userId),
    with: {
      program: {
        columns: {
          programId: true,
          name: true,
          description: true,
          imageUrl: true,
          duration: true
        }
      }
    }
  });
};

// Get enrollments by program ID
export const getEnrollmentsByProgramIdService = async (programId: string) => {
  return await db.query.Enrollment.findMany({
    where: eq(Enrollment.programId, programId),
    with: {
      user: {
        columns: {
          userId: true,
          email: true
        },
        with: {
          client: {
            columns: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });
};

// Update enrollment
export const updateEnrollmentService = async (
  enrollmentId: number,
  updateData: {
    status?: 'active' | 'completed' | 'inactive'; // Define possible statuses directly or replace with the correct type
    progress?: number;
    notes?: string;
  }
) => {
  const result = await db
    .update(Enrollment)
    .set({
      status: updateData.status,
      progress: updateData.progress,
      notes: updateData.notes,
      lastAccessedAt: new Date()
    })
    .where(eq(Enrollment.id, enrollmentId))
    .returning()
    .execute();

  return result[0];
};

// Complete enrollment
export const completeEnrollmentService = async (enrollmentId: number) => {
  const result = await db
    .update(Enrollment)
    .set({
      status: 'completed',
      completedAt: new Date(),
      progress: 100,
      lastAccessedAt: new Date()
    })
    .where(eq(Enrollment.id, enrollmentId))
    .returning()
    .execute();

  return result[0];
};

// Delete enrollment
export const deleteEnrollmentService = async (enrollmentId: number) => {
  await db
    .delete(Enrollment)
    .where(eq(Enrollment.id, enrollmentId))
    .execute();
  return "Enrollment deleted successfully";
};

// Check if user is enrolled in program
export const checkEnrollmentExistsService = async (userId: string, programId: string) => {
  return await db.query.Enrollment.findFirst({
    where: and(
      eq(Enrollment.userId, userId),
      eq(Enrollment.programId, programId)
    )
  });
};