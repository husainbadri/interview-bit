import { pgTable, text, timestamp, integer, real, jsonb } from "drizzle-orm/pg-core";

/**
 * Transcriptions Table
 * Single source of truth for verbatim candidate speech.
 * Never stores a grammatically 'corrected' version as the primary transcript.
 */
export const transcriptions = pgTable("transcriptions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  questionId: text("question_id").notNull(),
  userId: text("user_id"),
  audioUrl: text("audio_url"),
  audioDurationSeconds: real("audio_duration_seconds").default(0),
  
  // RAW verbatim speech — source of truth for evaluation
  rawTranscript: text("raw_transcript").notNull(),
  
  // Optional display-only formatting (without changing words)
  formattedTranscript: text("formatted_transcript"),
  
  language: text("language").default("en"),
  languageProbability: real("language_probability").default(1.0),
  transcriptionStatus: text("transcription_status").default("completed"),
  modelName: text("model_name").notNull(), // e.g. openai/whisper-large-v3-turbo
  processingTimeMs: integer("processing_time_ms").default(0),
  
  // Speech diagnostics & analytics
  fillerWordCount: integer("filler_word_count").default(0),
  repeatedWordCount: integer("repeated_word_count").default(0),
  wordCount: integer("word_count").default(0),
  speakingRate: real("speaking_rate").default(0), // Words Per Minute (WPM)
  pauseCount: integer("pause_count").default(0),
  
  // Segments and word-level timestamps
  segments: jsonb("segments"),
  wordTimestamps: jsonb("word_timestamps"),
  confidenceMetadata: jsonb("confidence_metadata"),
  
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Transcription = typeof transcriptions.$inferSelect;
export type NewTranscription = typeof transcriptions.$inferInsert;
