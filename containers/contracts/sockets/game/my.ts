import { z } from 'zod';

// ===============================================================
// INTERFACES SOCKET.IO
// ===============================================================

export type ClientToServerGameEvents = {
  'game:submit-plan': (payload: GameSubmitPlan) => void;
  'game:end-turn': () => void; // Si el jugador pasa turno sin hacer nada
};

export type ServerToClientGameEvents = {
  'game:state-sync': (payload: GameStateSync) => void;
  'game:phase-change': (payload: GamePhaseChange) => void;
  'game:execute-plan': (payload: GameExecutePlan) => void;
  'game:error': (payload: GameError) => void;
};

// ===============================================================
// SHARED (Tipos base del juego)
// ===============================================================

export const PosSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const GamePhaseSchema = z.enum([
  'PLANNING',
  'EXECUTION',
  'ENEMY_TURN',
  'TURN_END',
]);

// La habilidad planeada por el jugador

export const AbilityActionSchema = z.object({
  name: z.string(),
  target: z.string(),
  dice: z.number(),
  aftermov: z.boolean(),

  // ¡IMPORTANTE! El resultado de la tirada. 
  // El cliente lo manda vacío, el servidor lo rellena y lo devuelve.

  rollResult: z.number().optional(),
});

// Una acción dentro del historial

export const HistoryActionSchema = z.object({
  who: z.string(),
  moveto: z.string().nullable(),
  abilities: z.array(AbilityActionSchema).optional(),
});

// Representación básica de una entidad para sincronizaciones completas

export const EntitySchema = z.object({
  id: z.string(),
  type: z.enum(['player', 'enemy', 'clone']),
  hp: z.number(),
  maxHp: z.number(),
  position: PosSchema,
  status: z.string().nullable(),
  facing: z.string(),
  dice: z.array(z.number()),
  usedDice: z.array(z.number()),
  hasMoved: z.boolean(),
});

// ===============================================================
// CLIENT -> SERVER (Lo que mandas al backend)
// ===============================================================
// Cuando el jugador pulsa "Execute Plan"

export const GameSubmitPlanSchema = z.object({
  playerId: z.string(), // Quién manda el plan
  actions: z
    .array(HistoryActionSchema)
    .max(4, { message: 'Cannot submit more than 4 actions' }),
});

export type GameSubmitPlan = z.infer<typeof GameSubmitPlanSchema>;

// ===============================================================
// SERVER -> CLIENT (Lo que recibes del backend)
// ===============================================================
// 1. Sincronización dura (Al conectar o al final del turno para corregir desvíos)

export const GameStateSyncSchema = z.object({
  turn: z.number(),
  phase: GamePhaseSchema,
  players: z.record(z.string(), EntitySchema),
  enemies: z.record(z.string(), EntitySchema),
});

export type GameStateSync = z.infer<typeof GameStateSyncSchema>;

// 2. Cambio de fase orquestado por el servidor
//
export const GamePhaseChangeSchema = z.object({
  newPhase: GamePhaseSchema,
});

export type GamePhaseChange = z.infer<typeof GamePhaseChangeSchema>;

// 3. El servidor te devuelve el plan validado y con los dados ya tirados
//
export const GameExecutePlanSchema = z.object({
  playerId: z.string(),
  actions: z.array(HistoryActionSchema), // Aquí las abilities YA TIENEN el `rollResult`
});

export type GameExecutePlan = z.infer<typeof GameExecutePlanSchema>;

// ===============================================================
// errors
// ===============================================================
//
export const GAME_ERRORS = [
  'NOT_YOUR_TURN',
  'INVALID_MOVE',
  'ABILITY_ON_COOLDOWN',
  'INVALID_DICE',
  'DESYNC',
] as const;

export const GameErrorSchema = z.object({
  type: z.literal('error'),
  code: z.enum(GAME_ERRORS),
  message: z.string().optional(),
});

export type GameError = z.infer<typeof GameErrorSchema>;
