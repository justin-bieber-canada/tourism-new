import { dataService } from '../../services/dataService';

export const getResearcherSummary = (researcherId) => {
  const sites = dataService.getSites().filter(s => s.researcher_id === researcherId);
  return {
    totalSites: sites.length,
    pending: sites.filter(s => !s.is_approved).length,
    approved: sites.filter(s => s.is_approved).length
  };
};

export const getResearcherSites = (researcherId) => {
  return dataService.getSites().filter(s => s.researcher_id === researcherId);
};

export const addSite = (site) => {
  return dataService.addSite(site);
};

export const updateSite = (site) => {
  // We need to implement update in dataService
  return dataService.updateSite(site);
};

export const deleteSite = (id) => {
  return dataService.deleteSite(id);
};

export const updateUser = (id, data) => {
  // Implement in dataService
  return dataService.updateUser(id, data);
};

export const changePassword = (id, newPassword) => {
  // Implement in dataService
  return dataService.changePassword(id, newPassword);
};
