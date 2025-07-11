-- Cleanup script for blacklisted access tokens
-- This script removes any existing blacklist entries that might be causing auto-logout issues
-- Run this script to clean up the blacklist table

-- Delete all existing blacklist entries (this will allow users to log in again)
DELETE FROM blacklisted_access_tokens;

-- Reset auto-increment counter
ALTER TABLE blacklisted_access_tokens AUTO_INCREMENT = 1;

-- Verify the cleanup
SELECT COUNT(*) as remaining_blacklist_entries FROM blacklisted_access_tokens;

-- Show current refresh tokens for reference
SELECT 
    rt.user_id,
    u.email,
    COUNT(rt.id) as active_refresh_tokens
FROM refresh_tokens rt
JOIN users u ON rt.user_id = u.id
WHERE rt.is_revoked = FALSE 
    AND rt.expires_at > NOW()
GROUP BY rt.user_id, u.email
ORDER BY active_refresh_tokens DESC; 