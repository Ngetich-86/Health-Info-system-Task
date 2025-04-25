import { pgTable, serial, varchar, text, date, boolean, timestamp, index, primaryKey, pgEnum } from 'drizzle-orm/pg-core';

// 1. Define User Roles as a PostgreSQL ENUM
export const userRoleEnum = pgEnum('user_role', ['client', 'doctor', 'admin']);

// 2. User Table (Now with image_url)
export const User = pgTable('user', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('client').notNull(),
  imageUrl: varchar('image_url', { length: 255 }), // New field for profile pictures
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationToken: varchar('verification_token', { length: 255 }),
  verificationTokenExpiresAt: timestamp('verification_token_expires_at'),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  passwordResetExpiresAt: timestamp('password_reset_expires_at'),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  roleIdx: index('role_idx').on(table.role),
}));

// 3. Client Profile (No image_url here – it's in the User table)
export const Client = pgTable('client', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 50 }).notNull()
    .references(() => User.userId, { onDelete: 'cascade' }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
});

// 4. Doctor Profile (No image_url here – it's in the User table)
export const Doctor = pgTable('doctor', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 50 }).notNull()
    .references(() => User.userId, { onDelete: 'cascade' }),
  licenseNumber: varchar('license_number', { length: 50 }).unique(),
  specialization: varchar('specialization', { length: 100 }),
});

// 5. HealthProgram and Enrollment (Same as before, but now linked to Client.userId)
export const HealthProgram = pgTable('health_program', {
  id: serial('id').primaryKey(),
  programId: varchar('program_id', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const Enrollment = pgTable('enrollment', {
  userId: varchar('user_id', { length: 50 }).notNull()
    .references(() => User.userId, { onDelete: 'cascade' }), // Now references User, not Client
  programId: varchar('program_id', { length: 50 }).notNull()
    .references(() => HealthProgram.programId, { onDelete: 'cascade' }),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  notes: text('notes'),
}, (table) => ({
  enrollmentPk: primaryKey(table.userId, table.programId),
  userIdx: index('enrollment_user_idx').on(table.userId),
}));