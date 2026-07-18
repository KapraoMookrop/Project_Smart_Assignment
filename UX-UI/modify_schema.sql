-- Migration Script to drop unused tables and columns

-- 1. Drop unused tables and their indexes
DROP TABLE IF EXISTS sa.Notifications CASCADE;
DROP TABLE IF EXISTS sa.Activity_Logs CASCADE;

-- 2. Drop unused columns from sa.Companies
ALTER TABLE sa.Companies 
    DROP COLUMN IF EXISTS username,
    DROP COLUMN IF EXISTS email,
    DROP COLUMN IF EXISTS password_hash,
    DROP COLUMN IF EXISTS must_change_password,
    DROP COLUMN IF EXISTS last_login_at;

-- 3. Drop unused columns from sa.Tasks
ALTER TABLE sa.Tasks 
    DROP COLUMN IF EXISTS reward_points,
    DROP COLUMN IF EXISTS estimated_duration;
