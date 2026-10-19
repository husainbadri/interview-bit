-- Migration: 0001_transcriptions.sql
-- Description: Create transcriptions table with indexes for interview audio and verbatim transcripts.

CREATE TABLE IF NOT EXISTS "transcriptions" (
    "id" TEXT PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "user_id" TEXT,
    "audio_url" TEXT,
    "audio_duration_seconds" REAL DEFAULT 0,
    "raw_transcript" TEXT NOT NULL,
    "formatted_transcript" TEXT,
    "language" TEXT DEFAULT 'en',
    "language_probability" REAL DEFAULT 1.0,
    "transcription_status" TEXT DEFAULT 'completed',
    "model_name" TEXT NOT NULL,
    "processing_time_ms" INTEGER DEFAULT 0,
    "filler_word_count" INTEGER DEFAULT 0,
    "repeated_word_count" INTEGER DEFAULT 0,
    "word_count" INTEGER DEFAULT 0,
    "speaking_rate" REAL DEFAULT 0,
    "pause_count" INTEGER DEFAULT 0,
    "segments" JSONB,
    "word_timestamps" JSONB,
    "confidence_metadata" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for efficient candidate and session retrieval
CREATE INDEX IF NOT EXISTS "idx_transcriptions_session_id" ON "transcriptions" ("session_id");
CREATE INDEX IF NOT EXISTS "idx_transcriptions_question_id" ON "transcriptions" ("question_id");
CREATE INDEX IF NOT EXISTS "idx_transcriptions_user_id" ON "transcriptions" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_transcriptions_status" ON "transcriptions" ("transcription_status");
CREATE INDEX IF NOT EXISTS "idx_transcriptions_created_at" ON "transcriptions" ("created_at");
