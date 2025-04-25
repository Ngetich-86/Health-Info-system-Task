import { Context } from "hono";
import { authService } from "./auth.service";
import { sendEmail } from "../utils/mail";
import { randomBytes } from 'crypto';

// Type definitions
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  licenseNumber?: string;
  specialization?: string;
}

export const authController = {
  async register(c: Context) {
    try {
      const userData: RegisterRequest = await c.req.json();
      
      // Convert date string to Date object
      userData.dateOfBirth = new Date(userData.dateOfBirth);
      
      const result = await authService.registerUser(userData);
      return c.json({ message: result.message, userId: result.userId }, 201);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async login(c: Context) {
    try {
      const { email, password }: LoginRequest = await c.req.json();
      
      if (!email || !password) {
        return c.json({ error: "Email and password are required" }, 400);
      }

      const result = await authService.loginUser({ email, password });
      return c.json(result, 200);
    } catch (error: any) {
      if (error.message === "User not found") {
        return c.json({ error: "Invalid credentials" }, 401);
      }
      return c.json({ error: error.message }, 400);
    }
  },

  async verifyAccount(c: Context) {
    try {
      const { token } = c.req.query();
      const result = await authService.verifyUser(token);
      return c.json({ message: result.message }, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async requestPasswordReset(c: Context) {
    try {
      const { email } = await c.req.json();
      const result = await authService.requestPasswordReset(email);
      return c.json({ message: result.message }, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async resetPassword(c: Context) {
    try {
      const { token } = c.req.query();
      const { newPassword } = await c.req.json();
      
      const result = await authService.resetPassword(token, newPassword);
      return c.json({ message: result.message }, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async getUserProfile(c: Context) {
    try {
      const userId = c.req.param('userId');
      const user = await authService.getUserProfile(userId);
      return c.json(user, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async updateProfile(c: Context) {
    try {
      const userId = c.req.param('userId');
      const updateData: UpdateProfileRequest = await c.req.json();
      
      const result = await authService.updateUserProfile(userId, updateData);
      return c.json({ message: result.message }, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async changePassword(c: Context) {
    try {
      const userId = c.req.param('userId');
      const { currentPassword, newPassword } = await c.req.json();
      
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      return c.json({ message: result.message }, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async upgradeToDoctor(c: Context) {
    try {
      const userId = c.req.param('userId');
      const { licenseNumber, specialization } = await c.req.json();
      
      const result = await authService.upgradeToDoctor(userId, licenseNumber, specialization);
      return c.json({ message: result.message }, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async searchUsers(c: Context) {
    try {
      const query = c.req.query('query');
      const role = c.req.query('role');
      
      const results = await authService.searchUsers(query, role);
      return c.json(results, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async sendVerificationEmail(c: Context) {
    try {
      const { email } = await c.req.json();
      const user = await authService.getUserProfile(email);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        return c.json({ message: "User is already verified" }, 400);
      }

      const verificationToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

      await authService.updateUserProfile(user.userId, {
        verificationToken,
        verificationTokenExpiresAt: expiresAt
      });

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;
      const response = await sendEmail(
        email,
        '🔐 Email Verification Required',
        `
          <p>👋 Hello there!</p>
          <p>Please verify your email by clicking this link: <a href="${verificationUrl}">Verify Email</a></p>
          <p>This link will expire in 12 hours.</p>
        `
      );

      return c.json({ 
        message: "Verification email sent",
        response
      }, 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  },

  async getAllUsers(c: Context) {
    try {
      const limit = Number(c.req.query('limit')) || 10;
      const users = await authService.searchUsers('', '');
      return c.json(users.slice(0, limit), 200);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  }
};

export default authController;