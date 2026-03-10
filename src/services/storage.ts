import { Parcel } from '../types';
import { notificationService } from './notification';

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
    
    notificationService.addNotification({
      parcelId: parcel.id,
      title: 'New Shipment Created',
      message: `Shipment ${parcel.id} for ${parcel.receiverName} has been created.`,
      type: 'status_change'
    });
  },

  updateParcel: (updatedParcel: Parcel): void => {
    const parcels = storageService.getParcels();
    const index = parcels.findIndex(p => p.id === updatedParcel.id);
    if (index !== -1) {
      const oldParcel = parcels[index];
      const statusChanged = oldParcel.currentStatus !== updatedParcel.currentStatus;
      
      parcels[index] = updatedParcel;
      storageService.saveParcels(parcels);

      if (statusChanged) {
        notificationService.addNotification({
          parcelId: updatedParcel.id,
          title: 'Shipment Status Updated',
          message: `Shipment ${updatedParcel.id} is now ${updatedParcel.currentStatus}.`,
          type: 'status_change'
        });
      }
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

  // Async versions to simulate network latency
  getParcelByIdAsync: async (id: string): Promise<Parcel | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(storageService.getParcelById(id));
      }, 800); // 800ms delay
    });
  },

  generateTrackingId: (): string => {
    return `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
};
