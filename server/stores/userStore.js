import { v4 as uuidv4 } from 'uuid';

export class UserStore {
  constructor() {
    this.users = new Map();
    this.emailIndex = new Map();
    this.apiKeyIndex = new Map();
  }

  create(userData) {
    const user = {
      id: uuidv4(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      apiKey: userData.apiKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.set(user.id, user);
    this.emailIndex.set(user.email, user.id);
    this.apiKeyIndex.set(user.apiKey, user.id);

    return user;
  }

  findById(id) {
    return this.users.get(id);
  }

  findByEmail(email) {
    const userId = this.emailIndex.get(email);
    return userId ? this.users.get(userId) : null;
  }

  findByApiKey(apiKey) {
    const userId = this.apiKeyIndex.get(apiKey);
    return userId ? this.users.get(userId) : null;
  }

  updateApiKey(userId, newApiKey) {
    const user = this.users.get(userId);
    if (user) {
      // Remove old API key from index
      this.apiKeyIndex.delete(user.apiKey);
      
      // Update user
      user.apiKey = newApiKey;
      user.updatedAt = new Date().toISOString();
      
      // Add new API key to index
      this.apiKeyIndex.set(newApiKey, userId);
      
      return user;
    }
    return null;
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }
}