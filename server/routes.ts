import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertExerciseSchema,
  insertWorkoutSchema,
  insertWorkoutSessionSchema,
  insertSetSchema,
  insertMessageSchema,
  insertEvaluationSchema,
  insertGoalSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Exercise routes
  app.get('/api/exercises', isAuthenticated, async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get('/api/exercises/search', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter required" });
      }
      const exercises = await storage.searchExercises(query);
      res.json(exercises);
    } catch (error) {
      console.error("Error searching exercises:", error);
      res.status(500).json({ message: "Failed to search exercises" });
    }
  });

  app.get('/api/exercises/:id', isAuthenticated, async (req, res) => {
    try {
      const exercise = await storage.getExercise(req.params.id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  app.post('/api/exercises', isAuthenticated, async (req: any, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub
      });
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid exercise data", errors: error.errors });
      }
      console.error("Error creating exercise:", error);
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });

  app.put('/api/exercises/:id', isAuthenticated, async (req, res) => {
    try {
      const exercise = await storage.updateExercise(req.params.id, req.body);
      res.json(exercise);
    } catch (error) {
      console.error("Error updating exercise:", error);
      res.status(500).json({ message: "Failed to update exercise" });
    }
  });

  app.delete('/api/exercises/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteExercise(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting exercise:", error);
      res.status(500).json({ message: "Failed to delete exercise" });
    }
  });

  // Workout routes
  app.get('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workouts = await storage.getWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get('/api/workouts/:id', isAuthenticated, async (req, res) => {
    try {
      const workout = await storage.getWorkoutWithExercises(req.params.id);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  app.post('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub
      });
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      }
      console.error("Error creating workout:", error);
      res.status(500).json({ message: "Failed to create workout" });
    }
  });

  app.put('/api/workouts/:id', isAuthenticated, async (req, res) => {
    try {
      const workout = await storage.updateWorkout(req.params.id, req.body);
      res.json(workout);
    } catch (error) {
      console.error("Error updating workout:", error);
      res.status(500).json({ message: "Failed to update workout" });
    }
  });

  app.delete('/api/workouts/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteWorkout(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });

  app.post('/api/workouts/:id/assign', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.body;
      const workout = await storage.assignWorkout(req.params.id, userId);
      res.json(workout);
    } catch (error) {
      console.error("Error assigning workout:", error);
      res.status(500).json({ message: "Failed to assign workout" });
    }
  });

  // Workout sessions routes
  app.get('/api/workout-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getWorkoutSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching workout sessions:", error);
      res.status(500).json({ message: "Failed to fetch workout sessions" });
    }
  });

  app.get('/api/workout-sessions/:id', isAuthenticated, async (req, res) => {
    try {
      const session = await storage.getWorkoutSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching workout session:", error);
      res.status(500).json({ message: "Failed to fetch workout session" });
    }
  });

  app.post('/api/workout-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const sessionData = insertWorkoutSessionSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
        startedAt: new Date()
      });
      const session = await storage.startWorkoutSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      console.error("Error starting workout session:", error);
      res.status(500).json({ message: "Failed to start workout session" });
    }
  });

  app.put('/api/workout-sessions/:id/complete', isAuthenticated, async (req, res) => {
    try {
      const session = await storage.completeWorkoutSession(req.params.id, req.body);
      res.json(session);
    } catch (error) {
      console.error("Error completing workout session:", error);
      res.status(500).json({ message: "Failed to complete workout session" });
    }
  });

  // Sets routes
  app.get('/api/workout-sessions/:sessionId/sets', isAuthenticated, async (req, res) => {
    try {
      const sets = await storage.getSessionSets(req.params.sessionId);
      res.json(sets);
    } catch (error) {
      console.error("Error fetching sets:", error);
      res.status(500).json({ message: "Failed to fetch sets" });
    }
  });

  app.post('/api/sets', isAuthenticated, async (req, res) => {
    try {
      const setData = insertSetSchema.parse(req.body);
      const set = await storage.recordSet(setData);
      res.status(201).json(set);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid set data", errors: error.errors });
      }
      console.error("Error recording set:", error);
      res.status(500).json({ message: "Failed to record set" });
    }
  });

  app.put('/api/sets/:id', isAuthenticated, async (req, res) => {
    try {
      const set = await storage.updateSet(req.params.id, req.body);
      res.json(set);
    } catch (error) {
      console.error("Error updating set:", error);
      res.status(500).json({ message: "Failed to update set" });
    }
  });

  // Messages routes
  app.get('/api/messages/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const messages = await storage.getMessages(currentUserId, req.params.userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user.claims.sub
      });
      const message = await storage.sendMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.put('/api/messages/:id/read', isAuthenticated, async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(req.params.id);
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.get('/api/messages/unread/count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadMessageCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error getting unread message count:", error);
      res.status(500).json({ message: "Failed to get unread message count" });
    }
  });

  // Evaluations routes
  app.get('/api/evaluations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.query.userId || req.user.claims.sub;
      const evaluations = await storage.getUserEvaluations(userId);
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      res.status(500).json({ message: "Failed to fetch evaluations" });
    }
  });

  app.post('/api/evaluations', isAuthenticated, async (req: any, res) => {
    try {
      const evaluationData = insertEvaluationSchema.parse({
        ...req.body,
        conductedBy: req.user.claims.sub
      });
      const evaluation = await storage.createEvaluation(evaluationData);
      res.status(201).json(evaluation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid evaluation data", errors: error.errors });
      }
      console.error("Error creating evaluation:", error);
      res.status(500).json({ message: "Failed to create evaluation" });
    }
  });

  // Goals routes
  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.query.userId || req.user.claims.sub;
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const goalData = insertGoalSchema.parse({
        ...req.body,
        userId: req.user.claims.sub
      });
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goal data", errors: error.errors });
      }
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.put('/api/goals/:id', isAuthenticated, async (req, res) => {
    try {
      const goal = await storage.updateGoal(req.params.id, req.body);
      res.json(goal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.put('/api/goals/:id/progress', isAuthenticated, async (req, res) => {
    try {
      const { currentValue } = req.body;
      const goal = await storage.updateGoalProgress(req.params.id, currentValue);
      res.json(goal);
    } catch (error) {
      console.error("Error updating goal progress:", error);
      res.status(500).json({ message: "Failed to update goal progress" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/user/:userId', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get('/api/analytics/trainer/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const trainerId = req.user.claims.sub;
      const dashboard = await storage.getTrainerDashboard(trainerId);
      res.json(dashboard);
    } catch (error) {
      console.error("Error fetching trainer dashboard:", error);
      res.status(500).json({ message: "Failed to fetch trainer dashboard" });
    }
  });

  // User management routes (for trainers)
  app.get('/api/users/students', isAuthenticated, async (req, res) => {
    try {
      const students = await storage.getWorkouts(); // This would need to be updated to get students specifically
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup Socket.IO for real-time chat
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-chat', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined chat`);
    });

    socket.on('send-message', async (data) => {
      try {
        const message = await storage.sendMessage({
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          messageType: data.messageType || 'text'
        });
        
        // Emit to both sender and receiver
        io.to(`user-${data.senderId}`).emit('new-message', message);
        io.to(`user-${data.receiverId}`).emit('new-message', message);
      } catch (error) {
        console.error('Error sending real-time message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    socket.on('typing', (data) => {
      socket.to(`user-${data.receiverId}`).emit('user-typing', {
        senderId: data.senderId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return httpServer;
}
