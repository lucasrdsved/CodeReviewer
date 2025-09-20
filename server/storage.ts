import {
  users,
  exercises,
  workouts,
  workoutExercises,
  workoutSessions,
  sets,
  messages,
  evaluations,
  measurements,
  goals,
  achievements,
  type User,
  type UpsertUser,
  type Exercise,
  type InsertExercise,
  type Workout,
  type InsertWorkout,
  type WorkoutExercise,
  type WorkoutSession,
  type InsertWorkoutSession,
  type Set,
  type InsertSet,
  type Message,
  type InsertMessage,
  type Evaluation,
  type InsertEvaluation,
  type Measurement,
  type Goal,
  type InsertGoal,
  type Achievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, sql, or } from "drizzle-orm";

export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Exercise operations
  getExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: string, exercise: Partial<InsertExercise>): Promise<Exercise>;
  deleteExercise(id: string): Promise<void>;
  searchExercises(query: string): Promise<Exercise[]>;
  
  // Workout operations
  getWorkouts(userId?: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  getWorkoutWithExercises(id: string): Promise<any>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: Partial<InsertWorkout>): Promise<Workout>;
  deleteWorkout(id: string): Promise<void>;
  assignWorkout(workoutId: string, userId: string): Promise<Workout>;
  
  // Workout exercise operations
  addExerciseToWorkout(workoutId: string, exerciseId: string, details: any): Promise<WorkoutExercise>;
  removeExerciseFromWorkout(workoutId: string, exerciseId: string): Promise<void>;
  
  // Workout session operations
  getWorkoutSessions(userId: string): Promise<WorkoutSession[]>;
  getWorkoutSession(id: string): Promise<WorkoutSession | undefined>;
  startWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  completeWorkoutSession(id: string, data: any): Promise<WorkoutSession>;
  
  // Set operations
  getSessionSets(sessionId: string): Promise<Set[]>;
  recordSet(set: InsertSet): Promise<Set>;
  updateSet(id: string, set: Partial<InsertSet>): Promise<Set>;
  
  // Message operations
  getMessages(userId1: string, userId2: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<Message>;
  getUnreadMessageCount(userId: string): Promise<number>;
  
  // Evaluation operations
  getUserEvaluations(userId: string): Promise<Evaluation[]>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
  addMeasurement(evaluationId: string, measurementType: string, value: number, unit?: string): Promise<Measurement>;
  
  // Goal operations
  getUserGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal>;
  updateGoalProgress(id: string, currentValue: number): Promise<Goal>;
  
  // Achievement operations
  getUserAchievements(userId: string): Promise<Achievement[]>;
  awardAchievement(userId: string, achievementType: string, title: string, description: string): Promise<Achievement>;
  
  // Analytics operations
  getUserStats(userId: string): Promise<any>;
  getTrainerDashboard(trainerId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Exercise operations
  async getExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises).orderBy(asc(exercises.name));
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  async updateExercise(id: string, exercise: Partial<InsertExercise>): Promise<Exercise> {
    const [updatedExercise] = await db
      .update(exercises)
      .set({ ...exercise, updatedAt: new Date() })
      .where(eq(exercises.id, id))
      .returning();
    return updatedExercise;
  }

  async deleteExercise(id: string): Promise<void> {
    await db.delete(exercises).where(eq(exercises.id, id));
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(
        or(
          like(exercises.name, `%${query}%`),
          like(exercises.description, `%${query}%`)
        )
      )
      .orderBy(asc(exercises.name));
  }

  // Workout operations
  async getWorkouts(userId?: string): Promise<Workout[]> {
    if (userId) {
      return await db
        .select()
        .from(workouts)
        .where(or(eq(workouts.createdBy, userId), eq(workouts.assignedTo, userId)))
        .orderBy(desc(workouts.createdAt));
    }
    return await db.select().from(workouts).orderBy(desc(workouts.createdAt));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }

  async getWorkoutWithExercises(id: string): Promise<any> {
    const workout = await db.query.workouts.findFirst({
      where: eq(workouts.id, id),
      with: {
        workoutExercises: {
          with: {
            exercise: true
          },
          orderBy: asc(workoutExercises.orderIndex)
        }
      }
    });
    return workout;
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }

  async updateWorkout(id: string, workout: Partial<InsertWorkout>): Promise<Workout> {
    const [updatedWorkout] = await db
      .update(workouts)
      .set({ ...workout, updatedAt: new Date() })
      .where(eq(workouts.id, id))
      .returning();
    return updatedWorkout;
  }

  async deleteWorkout(id: string): Promise<void> {
    await db.delete(workouts).where(eq(workouts.id, id));
  }

  async assignWorkout(workoutId: string, userId: string): Promise<Workout> {
    const [assignedWorkout] = await db
      .update(workouts)
      .set({ assignedTo: userId, updatedAt: new Date() })
      .where(eq(workouts.id, workoutId))
      .returning();
    return assignedWorkout;
  }

  // Workout exercise operations
  async addExerciseToWorkout(workoutId: string, exerciseId: string, details: any): Promise<WorkoutExercise> {
    const [workoutExercise] = await db
      .insert(workoutExercises)
      .values({
        workoutId,
        exerciseId,
        ...details
      })
      .returning();
    return workoutExercise;
  }

  async removeExerciseFromWorkout(workoutId: string, exerciseId: string): Promise<void> {
    await db
      .delete(workoutExercises)
      .where(and(eq(workoutExercises.workoutId, workoutId), eq(workoutExercises.exerciseId, exerciseId)));
  }

  // Workout session operations
  async getWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
    return await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId))
      .orderBy(desc(workoutSessions.startedAt));
  }

  async getWorkoutSession(id: string): Promise<WorkoutSession | undefined> {
    const [session] = await db.select().from(workoutSessions).where(eq(workoutSessions.id, id));
    return session;
  }

  async startWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession> {
    const [newSession] = await db.insert(workoutSessions).values(session).returning();
    return newSession;
  }

  async completeWorkoutSession(id: string, data: any): Promise<WorkoutSession> {
    const [completedSession] = await db
      .update(workoutSessions)
      .set({
        completedAt: new Date(),
        status: "completed",
        ...data
      })
      .where(eq(workoutSessions.id, id))
      .returning();
    return completedSession;
  }

  // Set operations
  async getSessionSets(sessionId: string): Promise<Set[]> {
    return await db
      .select()
      .from(sets)
      .where(eq(sets.sessionId, sessionId))
      .orderBy(asc(sets.setNumber));
  }

  async recordSet(set: InsertSet): Promise<Set> {
    const [newSet] = await db.insert(sets).values(set).returning();
    return newSet;
  }

  async updateSet(id: string, set: Partial<InsertSet>): Promise<Set> {
    const [updatedSet] = await db
      .update(sets)
      .set(set)
      .where(eq(sets.id, id))
      .returning();
    return updatedSet;
  }

  // Message operations
  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<Message> {
    const [readMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return readMessage;
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(messages)
      .where(and(eq(messages.receiverId, userId), eq(messages.isRead, false)));
    return Number(result[0]?.count || 0);
  }

  // Evaluation operations
  async getUserEvaluations(userId: string): Promise<Evaluation[]> {
    return await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.userId, userId))
      .orderBy(desc(evaluations.createdAt));
  }

  async createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation> {
    const [newEvaluation] = await db.insert(evaluations).values(evaluation).returning();
    return newEvaluation;
  }

  async addMeasurement(evaluationId: string, measurementType: string, value: number, unit: string = "cm"): Promise<Measurement> {
    const [measurement] = await db
      .insert(measurements)
      .values({
        evaluationId,
        measurementType,
        value: value.toString(),
        unit
      })
      .returning();
    return measurement;
  }

  // Goal operations
  async getUserGoals(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.createdAt));
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db.insert(goals).values(goal).returning();
    return newGoal;
  }

  async updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal> {
    const [updatedGoal] = await db
      .update(goals)
      .set({ ...goal, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    return updatedGoal;
  }

  async updateGoalProgress(id: string, currentValue: number): Promise<Goal> {
    const [updatedGoal] = await db
      .update(goals)
      .set({ currentValue: currentValue.toString(), updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    return updatedGoal;
  }

  // Achievement operations
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedAt));
  }

  async awardAchievement(userId: string, achievementType: string, title: string, description: string): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values({
        userId,
        achievementType,
        title,
        description
      })
      .returning();
    return achievement;
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<any> {
    const totalSessions = await db
      .select({ count: sql`count(*)` })
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId));

    const completedSessions = await db
      .select({ count: sql`count(*)` })
      .from(workoutSessions)
      .where(and(eq(workoutSessions.userId, userId), eq(workoutSessions.status, "completed")));

    const currentStreak = await this.calculateStreak(userId);
    
    return {
      totalSessions: Number(totalSessions[0]?.count || 0),
      completedSessions: Number(completedSessions[0]?.count || 0),
      currentStreak,
      adherenceRate: totalSessions[0] ? (Number(completedSessions[0]?.count || 0) / Number(totalSessions[0]?.count || 1)) * 100 : 0
    };
  }

  async getTrainerDashboard(trainerId: string): Promise<any> {
    // Get all students assigned to this trainer
    const students = await db
      .select()
      .from(users)
      .where(eq(users.userType, "student"));

    // Get recent activity, workout stats, etc.
    const totalWorkouts = await db
      .select({ count: sql`count(*)` })
      .from(workouts)
      .where(eq(workouts.createdBy, trainerId));

    return {
      totalStudents: students.length,
      totalWorkouts: Number(totalWorkouts[0]?.count || 0),
      students: students.slice(0, 10) // Limit for dashboard view
    };
  }

  private async calculateStreak(userId: string): Promise<number> {
    // Simplified streak calculation - would need more complex logic for real implementation
    const recentSessions = await db
      .select()
      .from(workoutSessions)
      .where(and(eq(workoutSessions.userId, userId), eq(workoutSessions.status, "completed")))
      .orderBy(desc(workoutSessions.completedAt))
      .limit(30);

    let streak = 0;
    let currentDate = new Date();
    
    for (const session of recentSessions) {
      if (!session.completedAt) break;
      
      const sessionDate = new Date(session.completedAt);
      const diffInDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

export const storage = new DatabaseStorage();