/**
 * Leaflet Map Interface Module
 */

export class ForestMap {
  constructor(containerID, config = {}) {
    this.containerID = containerID;
    this.onAOIChange = config.onAOIChange || (() => {});
  }

  setMode(mode) {
    console.log('Map mode set to:', mode);
  }

  async searchLocation(query) {
    console.log('Searching for:', query);
    return { success: true, name: query };
  }

  removeEETileLayer() {
    console.log('EE tile layer removed');
  }
}

export const NEON_TILE_BOUNDS = [[-81.9915, 29.6884], [-81.9867, 29.6958]];
