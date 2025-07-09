import bcrypt from 'bcryptjs';

/**
 * Temporary Hash Generator Script
 * Generates the correct bcrypt hash for testing
 */

const password = 'UserTest123!<>';
const saltRounds = 12;

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Generated hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash verification:', isValid);
    
    // Test with the provided hash
    const providedHash = '$2b$12$9CMlqCn1ZP08EcAyzUakOeP7lVKx5Ed6fsVGePvqC5cMxPoT5A49K';
    const testProvided = await bcrypt.compare(password, providedHash);
    console.log('Test with provided hash:', testProvided);
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash(); 