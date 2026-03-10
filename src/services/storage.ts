import { Parcel } from '../types';

const STORAGE_KEY = 'logitrack_parcels';

export const storageService = {
  getParcels: (): Parcel[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveParcels: (parcels: Parcel[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parcels));
  },

  addParcel: (parcel: Parcel): void => {
    const parcels = storageService.getParcels();
    parcels.push(parcel);
    storageService.saveParcels(parcels);
  },

  updateParcel: (updatedParcel: Parcel): void => {
    const parcels = storageService.getParcels();
    const index = parcels.findIndex(p => p.id === updatedParcel.id);
    if (index !== -1) {
      parcels[index] = updatedParcel;
      storageService.saveParcels(parcels);
    }
  },

  deleteParcel: (id: string): void => {
    const parcels = storageService.getParcels();
    const filtered = parcels.filter(p => p.id !== id);
    storageService.saveParcels(filtered);
  },

  getParcelById: (id: string): Parcel | undefined => {
    const parcels = storageService.getParcels();
    return parcels.find(p => p.id === id);
  },

  generateTrackingId: (): string => {
    return `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
};
