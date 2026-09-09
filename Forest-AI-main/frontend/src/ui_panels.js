/**
 * Dashboard Panels UI Module
 */

export class DashboardPanels {
  constructor() {
    console.log('Dashboard panels initialized');
  }

  setBackendStatus(status) {
    console.log('Backend status:', status);
  }

  updateAOIInfo(aoiData) {
    console.log('AOI updated:', aoiData);
  }

  renderBiomassResults(data) {
    console.log('Rendering biomass results:', data);
  }
}
