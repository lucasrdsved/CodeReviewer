import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
  date,
  serial
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Athletica Pro specific fields
  userType: varchar("user_type", { enum: ["student", "trainer"] }).notNull().default("student"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exercises table
export const exercises = pgTable("exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  instructions: text("instructions"),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  targetMuscles: text("target_muscles").array(),
  equipment: varchar("equipment"),
  difficulty: varchar("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).default("beginner"),
  category: varchar("category"),
  isCustom: boolean("is_custom").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workouts table
export const workouts = pgTable("workouts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  estimatedDuration: integer("estimated_duration"), // in minutes
  difficulty: varchar("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).default("beginner"),
  workoutType: varchar("workout_type", { enum: ["strength", "cardio", "hiit", "functional", "hybrid"] }).default("strength"),
  isTemplate: boolean("is_template").default(false),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  scheduledDate: date("scheduled_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workout exercises - junction table for workouts and exercises
export const workoutExercises = pgTable("workout_exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  workoutId: uuid("workout_id").references(() => workouts.id).notNull(),
  exerciseId: uuid("exercise_id").references(() => exercises.id).notNull(),
  orderIndex: integer("order_index").notNull(),
  sets: integer("sets").notNull(),
  reps: varchar("reps"), // can be "8-12" or "15"
  weight: decimal("weight", { precision: 5, scale: 2 }),
  restTime: integer("rest_time"), // in seconds
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workout sessions - actual workout executions
export const workoutSessions = pgTable("workout_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  workoutId: uuid("workout_id").references(() => workouts.id).notNull(),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  status: varchar("status", { enum: ["in_progress", "completed", "abandoned"] }).default("in_progress"),
  totalDuration: integer("total_duration"), // in seconds
  notes: text("notes"),
  mood: integer("mood"), // 1-5 scale
  energy: integer("energy"), // 1-5 scale
  difficulty: integer("difficulty"), // 1-5 scale
  createdAt: timestamp("created_at").defaultNow(),
});

// Sets - individual set executions
export const sets = pgTable("sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => workoutSessions.id).notNull(),
  exerciseId: uuid("exercise_id").references(() => exercises.id).notNull(),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  rpe: integer("rpe"), // Rate of Perceived Exertion 1-10
  notes: text("notes"),
  duration: integer("duration"), // in seconds for timed exercises
  completedAt: timestamp("completed_at").defaultNow(),
});

// Messages for chat system
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { enum: ["text", "image", "audio", "video"] }).default("text"),
  fileUrl: varchar("file_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Physical evaluations
export const evaluations = pgTable("evaluations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  conductedBy: varchar("conducted_by").references(() => users.id).notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  bodyFatPercentage: decimal("body_fat_percentage", { precision: 4, scale: 2 }),
  muscleMass: decimal("muscle_mass", { precision: 5, scale: 2 }),
  bmr: integer("bmr"), // Basal Metabolic Rate
  notes: text("notes"),
  evaluationType: varchar("evaluation_type", { enum: ["initial", "monthly", "quarterly", "final"] }).default("monthly"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Body measurements
export const measurements = pgTable("measurements", {
  id: uuid("id").defaultRandom().primaryKey(),
  evaluationId: uuid("evaluation_id").references(() => evaluations.id).notNull(),
  measurementType: varchar("measurement_type").notNull(), // chest, waist, hip, arm, thigh, etc.
  value: decimal("value", { precision: 5, scale: 2 }).notNull(),
  unit: varchar("unit").default("cm"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Goals and objectives
export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  goalType: varchar("goal_type", { enum: ["weight_loss", "muscle_gain", "strength", "endurance", "custom"] }).notNull(),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).default("0"),
  unit: varchar("unit"),
  targetDate: date("target_date"),
  status: varchar("status", { enum: ["active", "completed", "paused", "cancelled"] }).default("active"),
  priority: varchar("priority", { enum: ["low", "medium", "high"] }).default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workout streaks and achievements
export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementType: varchar("achievement_type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  badgeIcon: varchar("badge_icon"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts, { relationName: "created_workouts" }),
  assignedWorkouts: many(workouts, { relationName: "assigned_workouts" }),
  workoutSessions: many(workoutSessions),
  sentMessages: many(messages, { relationName: "sent_messages" }),
  receivedMessages: many(messages, { relationName: "received_messages" }),
  evaluations: many(evaluations, { relationName: "user_evaluations" }),
  conductedEvaluations: many(evaluations, { relationName: "conducted_evaluations" }),
  goals: many(goals),
  achievements: many(achievements),
  customExercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  creator: one(users, {
    fields: [exercises.createdBy],
    references: [users.id],
  }),
  workoutExercises: many(workoutExercises),
  sets: many(sets),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  creator: one(users, {
    fields: [workouts.createdBy],
    references: [users.id],
    relationName: "created_workouts",
  }),
  assignee: one(users, {
    fields: [workouts.assignedTo],
    references: [users.id],
    relationName: "assigned_workouts",
  }),
  workoutExercises: many(workoutExercises),
  sessions: many(workoutSessions),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [workoutSessions.userId],
    references: [users.id],
  }),
  workout: one(workouts, {
    fields: [workoutSessions.workoutId],
    references: [workouts.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  session: one(workoutSessions, {
    fields: [sets.sessionId],
    references: [workoutSessions.id],
  }),
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sent_messages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "received_messages",
  }),
}));

export const evaluationsRelations = relations(evaluations, ({ one, many }) => ({
  user: one(users, {
    fields: [evaluations.userId],
    references: [users.id],
    relationName: "user_evaluations",
  }),
  conductor: one(users, {
    fields: [evaluations.conductedBy],
    references: [users.id],
    relationName: "conducted_evaluations",
  }),
  measurements: many(measurements),
}));

export const measurementsRelations = relations(measurements, ({ one }) => ({
  evaluation: one(evaluations, {
    fields: [measurements.evaluationId],
    references: [evaluations.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  userType: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({
  id: true,
  createdAt: true,
});

export const insertSetSchema = createInsertSchema(sets).omit({
  id: true,
  completedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertEvaluationSchema = createInsertSchema(evaluations).omit({
  id: true,
  createdAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type Set = typeof sets.$inferSelect;
export type InsertSet = z.infer<typeof insertSetSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;
export type Measurement = typeof measurements.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Achievement = typeof achievements.$inferSelect;