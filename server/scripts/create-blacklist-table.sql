-- Create blacklisted access tokens table for immediate session invalidation
-- Run this script in your MySQL database

CREATE TABLE IF NOT EXISTS blacklisted_access_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    blacklisted_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    reason ENUM('FORCE_LOGOUT', 'MANUAL_LOGOUT', 'SECURITY_BREACH') NOT NULL,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_blacklisted_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Indexes for performance
CREATE INDEX idx_blacklisted_tokens_user_id ON blacklisted_access_tokens(user_id);
CREATE INDEX idx_blacklisted_tokens_expires_at ON blacklisted_access_tokens(expires_at);
CREATE INDEX idx_blacklisted_tokens_hash ON blacklisted_access_tokens(token_hash);

-- Add comment
ALTER TABLE blacklisted_access_tokens COMMENT = 'Stores blacklisted JWT access tokens for immediate invalidation'; 