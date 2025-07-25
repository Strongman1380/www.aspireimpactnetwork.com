/**
 * Firebase Database Utility Functions
 * Provides methods for interacting with the Recovery Connect Firebase Database
 */

// Initialize Firebase with configuration from config.js
function initializeFirebase() {
  if (!window.firebase) {
    console.error('Firebase SDK not loaded. Please include the Firebase SDK in your project.');
    return false;
  }
  
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
}

// Fetch data from a specified endpoint
async function fetchData(endpoint) {
  if (!endpoint || !dbConnections[endpoint]) {
    console.error(`Invalid endpoint: ${endpoint}`);
    return null;
  }
  
  const { endpoint: url, methods } = dbConnections[endpoint];
  
  if (!methods.includes('GET')) {
    console.error(`GET method not allowed for endpoint: ${endpoint}`);
    return null;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}

// Post data to a specified endpoint
async function postData(endpoint, data) {
  if (!endpoint || !dbConnections[endpoint]) {
    console.error(`Invalid endpoint: ${endpoint}`);
    return false;
  }
  
  const { endpoint: url, methods } = dbConnections[endpoint];
  
  if (!methods.includes('POST')) {
    console.error(`POST method not allowed for endpoint: ${endpoint}`);
    return false;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    return false;
  }
}

// Load and display treatment resources
async function loadTreatmentResources() {
  const treatmentData = await fetchData('treatment');
  
  if (!treatmentData) {
    document.getElementById('treatment-resources').innerHTML = 
      '<p class="error-message">Unable to load treatment resources. Please try again later.</p>';
    return;
  }
  
  const treatmentContainer = document.getElementById('treatment-resources');
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

// Load and display recovery stories
async function loadRecoveryStories() {
  const storiesData = await fetchData('stories');
  
  if (!storiesData) {
    document.getElementById('recovery-stories').innerHTML = 
      '<p class="error-message">Unable to load recovery stories. Please try again later.</p>';
    return;
  }
  
  const storiesContainer = document.getElementById('recovery-stories');
  storiesContainer.innerHTML = '';
  
  Object.keys(storiesData).forEach(key => {
    const story = storiesData[key];
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
  });
}

// Load and display crisis resources
async function loadCrisisResources() {
  const crisisData = await fetchData('crisis');
  
  if (!crisisData) {
    document.getElementById('crisis-resources').innerHTML = 
      '<p class="error-message">Unable to load crisis resources. Please try again later.</p>';
    return;
  }
  
  const crisisContainer = document.getElementById('crisis-resources');
  crisisContainer.innerHTML = '';
  
  Object.keys(crisisData).forEach(key => {
    const resource = crisisData[key];
    const resourceElement = document.createElement('div');
    resourceElement.className = 'crisis-resource';
    resourceElement.innerHTML = `
      <h3>${resource.name}</h3>
      <p>${resource.description}</p>
      <div class="resource-contact">
        <a href="tel:${resource.phone}" class="button button-primary">${resource.phone}</a>
        ${resource.textLine ? `<p>Text ${resource.textLine}</p>` : ''}
      </div>
    `;
    crisisContainer.appendChild(resourceElement);
  });
}

// Submit user story
async function submitUserStory(storyData) {
  const success = await postData('stories', storyData);
  
  if (success) {
    alert('Thank you for sharing your story! It will be reviewed by our team before being published.');
    return true;
  } else {
    alert('There was an error submitting your story. Please try again later.');
    return false;
  }
}

// Export functions
window.recoverConnect = {
  initializeFirebase,
  fetchData,
  postData,
  loadTreatmentResources,
  loadRecoveryStories,
  loadCrisisResources,
  submitUserStory
};