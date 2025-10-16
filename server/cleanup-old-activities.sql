-- Cleanup script to remove old activity logs with invalid enum values
-- Run this SQL script in your MySQL database to clean up old activity logs

-- Delete activity logs with old enum values that are no longer valid
DELETE FROM activity_logs 
WHERE type IN ('PROJECT_COMPLETED', 'TASK_ASSIGNED', 'COMMENT_ADDED', 'USER_MENTIONED');

-- Verify the cleanup
SELECT type, COUNT(*) as count 
FROM activity_logs 
GROUP BY type 
ORDER BY type;
