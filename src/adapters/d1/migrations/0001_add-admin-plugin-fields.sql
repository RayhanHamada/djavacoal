-- Migration: Add admin plugin fields to users table
-- This migration adds role-based access control fields required by Better Auth admin plugin

ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'admin';
ALTER TABLE users ADD COLUMN banned INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN ban_reason TEXT;
ALTER TABLE users ADD COLUMN ban_expires INTEGER;

-- Add impersonation support to sessions table
ALTER TABLE sessions ADD COLUMN impersonated_by TEXT;
