/**
 * Forest AI Dashboard — Main Coordinator (Leaflet + OpenStreetMap)
 */

import './theme_bw_minimal.css';
import { ForestMap, NEON_TILE_BOUNDS } from './leaflet_interface.js';
import { DashboardPanels } from './ui_panels.js';
import {
  fetchStatus,
  fetchAOIBiomass,
  fetchBiomassPreset,
  fetchTreeDetection,
  uploadTreeDetection,
  fetchEETileUrl
} from './backend_client.js';

class ForestApp {
  constructor() {
    this.currentMode = 'biomass';
    this.currentAOI = {
      type: 'none',
      geometry: null,
      areaHa: '—',
      areaSqKm: '—',
      center: ['—', '—']
    };
    this.selectedTreeFile = null;
    this.currentEELayer = 'none';
    this.neonEELayer = 'none';
    this.lastNeonDetectionsGeoJSON = null;

    this.panels = new DashboardPanels();
    this.map = new ForestMap('leaflet-map', {
      onAOIChange: (aoiData) => this.handleAOIChange(aoiData),
      onNeonPolygonChange: (polygonGeoJSON) => this.handleNeonPolygonChange(polygonGeoJSON)
    });

    this.initEventListeners();
    this.checkSystemStatus();
  }

  async checkSystemStatus() {
    try {
      const status = await fetchStatus();
      this.panels.setBackendStatus(status);
    } catch (err) {
      console.warn('Backend status check error:', err);
      this.panels.setBackendStatus({ backend: 'offline', demo_mode: true });
    }
  }

  handleAOIChange(aoiData) {
    this.currentAOI = aoiData;
    this.panels.updateAOIInfo(aoiData);
    if (this.currentEELayer && this.currentEELayer !== 'none') {
      this.loadEELayer(this.currentEELayer);
    }
  }

  initEventListeners() {
    const btnModeBiomass = document.getElementById('mode-biomass-btn');
    const btnModeTrees = document.getElementById('mode-trees-btn');
    const panelBiomass = document.getElementById('panel-biomass');
    const panelTrees = document.getElementById('panel-trees');

    btnModeBiomass.addEventListener('click', () => {
      this.currentMode = 'biomass';
      btnModeBiomass.classList.add('active');
      btnModeTrees.classList.remove('active');
      panelBiomass.classList.add('active');
      panelTrees.classList.remove('active');
      this.map.setMode('biomass');
    });

    btnModeTrees.addEventListener('click', () => {
      this.currentMode = 'trees';
      btnModeTrees.classList.add('active');
      btnModeBiomass.classList.remove('active');
      panelTrees.classList.add('active');
      panelBiomass.classList.remove('active');
      this.map.setMode('trees');
    });

    const searchInput = document.getElementById('location-search-input');
    const btnSearchGo = document.getElementById('btn-search-go');
    const handleSearch = async () => {
      const query = searchInput.value;
      if (!query.trim()) return;
      const res = await this.map.searchLocation(query);
    };
    btnSearchGo.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    });

    const btnRunBiomass = document.getElementById('btn-run-biomass');
    btnRunBiomass.addEventListener('click', () => this.runBiomassAnalysis());
  }

  async loadEELayer(layer) {
    this.currentEELayer = layer;
    if (layer === 'none') {
      this.map.removeEETileLayer();
      return;
    }
  }

  async runBiomassAnalysis() {
    if (this.currentAOI.type === 'none' || !this.currentAOI.geometry) {
      alert('Please draw an Area of Interest polygon on the map.');
      return;
    }
    try {
      const data = await fetchAOIBiomass(this.currentAOI.geometry);
      this.panels.renderBiomassResults(data);
    } catch (err) {
      console.error('Biomass analysis error:', err);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new ForestApp();
});
