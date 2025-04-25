import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from 'crypto';
import { and, eq, or, like } from "drizzle-orm";
import db from "../drizzle/db";
import { User, Client, Doctor, HealthProgram, Enrollment, userRoleEnum } from "../drizzle/schema";
// import { sendVerificationEmail, sendPasswordResetEmail } from "./email.service";

const secret = process.env.JWT_SECRET || 'your-secret-key';
const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

// Type definitions
interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    userId: string;
    email: string;
    role: string;
    imageUrl?: string;
    profile: any;
  };
}

// Auth Service
export const authService = {
  async registerUser(userData: RegisterUserInput): Promise<{ message: string; userId: string }> {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, userData.email))
      .execute();

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password and generate verification token
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours expiration

    // Create base user
    const newUser = await db
      .insert(User)
      .values({
        userId: `USER-${Date.now()}`,
        email: userData.email,
        passwordHash: hashedPassword,
        role: 'client', // Default role
        imageUrl: userData.imageUrl,
        createdAt: new Date(),
        isActive: true,
        verificationToken,
        verificationTokenExpiresAt: expiresAt,
      })
      .returning()
      .execute();

    if (!newUser.length) {
      throw new Error('Failed to register user');
    }

    const userId = newUser[0].userId;

    // Create client profile
    await db.insert(Client).values({
      userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      phone: userData.phone,
      address: userData.address,
    }).execute();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;
    await sendVerificationEmail(newUser[0].email, verificationUrl);

    return {
      message: 'User registered successfully. Please check your email for verification link.',
      userId
    };
  },

  async verifyUser(token: string): Promise<{ message: string }> {
    const now = new Date();

    const users = await db
      .select()
      .from(User)
      .where(
        and(
          eq(User.verificationToken, token),
          gt(User.verificationTokenExpiresAt, now)
        )
      )
      .execute();

    if (users.length === 0) {
      throw new Error("Invalid or expired verification token");
    }

    const user = users[0];

    if (user.isVerified) {
      return { message: "User is already verified" };
    }

    await db
      .update(User)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      })
      .where(eq(User.userId, user.userId))
      .execute();

    return { message: "Account successfully verified!" };
  },

  async loginUser({ email, password }: LoginUserInput): Promise<AuthResponse> {
    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .execute();

    if (users.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = users[0];

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Get profile data based on role
    let profile;
    if (user.role === 'client') {
      const [client] = await db
        .select()
        .from(Client)
        .where(eq(Client.userId, user.userId))
        .execute();
      profile = client;
    } else if (user.role === 'doctor') {
      const [doctor] = await db
        .select()
        .from(Doctor)
        .where(eq(Doctor.userId, user.userId))
        .execute();
      profile = doctor;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.userId,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl
      },
      secret,
      { expiresIn }
    );

    return { 
      token,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
        profile
      }
    };
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .execute();

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiration

    await db
      .update(User)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpiresAt: expiresAt,
      })
      .where(eq(User.userId, user.userId))
      .execute();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    return { message: "Password reset link sent to your email" };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const now = new Date();

    const users = await db
      .select()
      .from(User)
      .where(
        and(
          eq(User.passwordResetToken, token),
          gt(User.passwordResetExpiresAt, now)
        )
      )
      .execute();

    if (users.length === 0) {
      throw new Error("Invalid or expired token");
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(User)
      .set({
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      })
      .where(eq(User.userId, user.userId))
      .execute();

    return { message: "Password updated successfully" };
  },

  async upgradeToDoctor(userId: string, licenseNumber: string, specialization: string): Promise<{ message: string }> {
    // Verify user exists and is a client
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.userId, userId))
      .execute();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== 'client') {
      throw new Error("Only clients can be upgraded to doctors");
    }

    // Update user role
    await db
      .update(User)
      .set({ role: 'doctor' })
      .where(eq(User.userId, userId))
      .execute();

    // Create doctor profile
    await db.insert(Doctor).values({
      userId,
      licenseNumber,
      specialization,
    }).execute();

    return { message: "User upgraded to doctor successfully" };
  },

  async getUserProfile(userId: string): Promise<any> {
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.userId, userId))
      .execute();

    if (!user) {
      throw new Error("User not found");
    }

    let profile;
    if (user.role === 'client') {
      [profile] = await db
        .select()
        .from(Client)
        .where(eq(Client.userId, userId))
        .execute();
    } else if (user.role === 'doctor') {
      [profile] = await db
        .select()
        .from(Doctor)
        .where(eq(Doctor.userId, userId))
        .execute();
    }

    return {
      ...user,
      profile
    };
  },

  async updateUserProfile(userId: string, updateData: any): Promise<{ message: string }> {
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.userId, userId))
      .execute();

    if (!user) {
      throw new Error("User not found");
    }

    // Update base user info
    if (updateData.email || updateData.imageUrl) {
      await db
        .update(User)
        .set({
          email: updateData.email,
          imageUrl: updateData.imageUrl,
        })
        .where(eq(User.userId, userId))
        .execute();
    }

    // Update role-specific profile
    if (user.role === 'client') {
      await db
        .update(Client)
        .set({
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          phone: updateData.phone,
          address: updateData.address,
        })
        .where(eq(Client.userId, userId))
        .execute();
    } else if (user.role === 'doctor') {
      await db
        .update(Doctor)
        .set({
          licenseNumber: updateData.licenseNumber,
          specialization: updateData.specialization,
        })
        .where(eq(Doctor.userId, userId))
        .execute();
    }

    return { message: "Profile updated successfully" };
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.userId, userId))
      .execute();

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(User)
      .set({ passwordHash: hashedPassword })
      .where(eq(User.userId, userId))
      .execute();

    return { message: "Password changed successfully" };
  },

  async searchUsers(query: string, role?: string): Promise<any[]> {
    let whereClause = and(
      or(
        like(User.email, `%${query}%`),
        like(User.userId, `%${query}%`)
      )
    );

    if (role) {
      whereClause = and(whereClause, eq(User.role, role as typeof userRoleEnum.enumValues[number]));
    }

    const users = await db
      .select()
      .from(User)
      .where(whereClause)
      .execute();

    // Fetch profiles for each user
    const results = await Promise.all(users.map(async (user) => {
      let profile;
      if (user.role === 'client') {
        [profile] = await db
          .select()
          .from(Client)
          .where(eq(Client.userId, user.userId))
          .execute();
      } else if (user.role === 'doctor') {
        [profile] = await db
          .select()
          .from(Doctor)
          .where(eq(Doctor.userId, user.userId))
          .execute();
      }

      return {
        ...user,
        profile
      };
    }));

    return results;
  }
};

export default authService;