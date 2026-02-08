import Dexie from 'dexie';

// Simplified offline service without IndexedDB initialization
export const offlineService = {
  async cacheProjects(projects) {
    console.log('Offline caching disabled');
  },

  async cacheUsers(users) {
    console.log('Offline caching disabled');
  },

  async cacheOrganisations(organisations) {
    console.log('Offline caching disabled');
  },

  async getCachedProjects() {
    return [];
  },

  async getCachedUsers() {
    return [];
  },

  async getCachedOrganisations() {
    return [];
  },

  async storeOfflineAction(actionType, data) {
    console.log('Offline action storage disabled');
    return null;
  },

  async getPendingSyncActions() {
    return [];
  },

  async markActionSynced(actionId) {
    console.log('Sync marking disabled');
  },

  async storeDraft(formType, data) {
    console.log('Draft storage disabled');
    return null;
  },

  async getDrafts(formType) {
    return [];
  },

  async clearSyncedDrafts() {
    console.log('Clear drafts disabled');
  },

  async hasOfflineData() {
    return false;
  },

  async clearAllData() {
    console.log('Clear data disabled');
  }
};

export const syncService = {
  isOnline() {
    return navigator.onLine;
  },

  async syncPendingActions(apiService) {
    console.log('Sync disabled');
  },

  setupSyncListeners(apiService) {
    console.log('Sync listeners disabled');
  }
};

export default null;