/**
 * Firebase Database Utility Functions (NPM Module Version)
 * Provides methods for interacting with the Recovery Connect Firebase Database
 * Uses Firebase v9+ modular SDK
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration (import from config.js or define here)
// Note: In a real project, use environment variables for sensitive data
const firebaseConfig = {
  apiKey: "AIzaSyCcp4pvdVEs5jG7yT7532BGzK0kf_aRQ1Q",
  authDomain: "lift-and-renewal-33bbb.firebaseapp.com",
  databaseURL: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com", // Preserved for database operations
  projectId: "lift-and-renewal-33bbb",
  storageBucket: "lift-and-renewal-33bbb.firebasestorage.app",
  messagingSenderId: "945546956580",
  appId: "1:945546956580:web:25c1c89b1778201f31edb1",
  measurementId: "G-4QK3K2Z4SP"
};

// Database endpoint configuration
const dbEndpoints = {
  treatment: "treatment",
  resources: "resources", 
  stories: "stories",
  crisis: "crisis"
};

class FirebaseService {
  constructor() {
    this.app = null;
    this.database = null;
    this.analytics = null;
    this.initialized = false;
  }

  /**
   * Initialize Firebase application and database
   */
  initialize() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.database = getDatabase(this.app);
      this.analytics = getAnalytics(this.app);
      this.initialized = true;
      console.log('Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Fetch data from a specified endpoint
   */
  async fetchData(endpoint) {
    if (!this.initialized) {
      console.error('Firebase not initialized. Call initialize() first.');
      return null;
    }

    if (!dbEndpoints[endpoint]) {
      console.error(`Invalid endpoint: ${endpoint}`);
      return null;
    }

    try {
      const dbRef = ref(this.database, dbEndpoints[endpoint]);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log(`No data available for endpoint: ${endpoint}`);
        return {};
      }
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return null;
    }
  }

  /**
   * Post data to a specified endpoint
   */
  async postData(endpoint, data) {
    if (!this.initialized) {
      console.error('Firebase not initialized. Call initialize() first.');
      return false;
    }

    if (!dbEndpoints[endpoint]) {
      console.error(`Invalid endpoint: ${endpoint}`);
      return false;
    }

    try {
      const dbRef = ref(this.database, dbEndpoints[endpoint]);
      await push(dbRef, data);
      console.log(`Data posted successfully to ${endpoint}`);
      return true;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      return false;
    }
  }

  /**
   * Update data at a specific path
   */
  async updateData(endpoint, id, data) {
    if (!this.initialized) {
      console.error('Firebase not initialized. Call initialize() first.');
      return false;
    }

    if (!dbEndpoints[endpoint]) {
      console.error(`Invalid endpoint: ${endpoint}`);
      return false;
    }

    try {
      const dbRef = ref(this.database, `${dbEndpoints[endpoint]}/${id}`);
      await set(dbRef, data);
      console.log(`Data updated successfully at ${endpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error updating data at ${endpoint}/${id}:`, error);
      return false;
    }
  }

  /**
   * Load and display treatment resources
   */
  async loadTreatmentResources() {
    const treatmentData = await this.fetchData('treatment');
    
    if (!treatmentData) {
      const container = document.getElementById('treatment-resources');
      if (container) {
        container.innerHTML = '<p class="error-message">Unable to load treatment resources. Please try again later.</p>';
      }
      return;
    }
    
    const treatmentContainer = document.getElementById('treatment-resources');
    if (!treatmentContainer) return;
    
    treatmentContainer.innerHTML = '';
    
    Object.keys(treatmentData).forEach(key => {
      const resource = treatmentData[key];
      const resourceElement = document.createElement('div');
      resourceElement.className = 'resource-card';
      resourceElement.innerHTML = `
        <h3>${resource.name}</h3>
        <p>${resource.description}</p>
        <div class="resource-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${resource.location}</span>
          <span><i class="fas fa-phone"></i> ${resource.phone}</span>
        </div>
        <a href="${resource.website}" target="_blank" class="button button-secondary">Visit Website</a>
      `;
      treatmentContainer.appendChild(resourceElement);
    });
  }

  /**
   * Load and display recovery stories
   */
  async loadRecoveryStories() {
    const storiesData = await this.fetchData('stories');
    
    if (!storiesData) {
      const container = document.getElementById('recovery-stories');
      if (container) {
        container.innerHTML = '<p class="error-message">Unable to load recovery stories. Please try again later.</p>';
      }
      return;
    }
    
    const storiesContainer = document.getElementById('recovery-stories');
    if (!storiesContainer) return;
    
    storiesContainer.innerHTML = '';
    
    Object.keys(storiesData).forEach(key => {
      const story = storiesData[key];
      if (story.published) { // Only show published stories
        const storyElement = document.createElement('div');
        storyElement.className = 'story-card';
        storyElement.innerHTML = `
          <div class="story-header">
            <h3>${story.title}</h3>
            <span class="story-author">${story.author}</span>
          </div>
          <p class="story-excerpt">${story.excerpt}</p>
          <a href="stories.html?id=${key}" class="button button-text">Read Full Story</a>
        `;
        storiesContainer.appendChild(storyElement);
      }
    });
  }

  /**
   * Load and display crisis resources
   */
  async loadCrisisResources() {
    const crisisData = await this.fetchData('crisis');
    
    if (!crisisData) {
      const container = document.getElementById('crisis-resources');
      if (container) {
        container.innerHTML = '<p class="error-message">Unable to load crisis resources. Please try again later.</p>';
      }
      return;
    }
    
    const crisisContainer = document.getElementById('crisis-resources');
    if (!crisisContainer) return;
    
    crisisContainer.innerHTML = '';
    
    Object.keys(crisisData).forEach(key => {
      const resource = crisisData[key];
      const resourceElement = document.createElement('div');
      resourceElement.className = 'crisis-resource';
      resourceElement.innerHTML = `
        <h3>${resource.name}</h3>
        <p>${resource.description}</p>
        <div class="resource-contact">
          ${resource.phone ? `<a href="tel:${resource.phone}" class="button button-primary">${resource.phone}</a>` : ''}
          ${resource.textLine ? `<p>Text: ${resource.textLine}</p>` : ''}
        </div>
      `;
      crisisContainer.appendChild(resourceElement);
    });
  }

  /**
   * Submit user story
   */
  async submitUserStory(storyData) {
    const storyWithMetadata = {
      ...storyData,
      dateSubmitted: new Date().toISOString(),
      published: false // Stories require approval before publishing
    };

    const success = await this.postData('stories', storyWithMetadata);
    
    if (success) {
      alert('Thank you for sharing your story! It will be reviewed by our team before being published.');
      return true;
    } else {
      alert('There was an error submitting your story. Please try again later.');
      return false;
    }
  }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();

// Export both the class and instance for flexibility
export { FirebaseService, firebaseService };
export default firebaseService;