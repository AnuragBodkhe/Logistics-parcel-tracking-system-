import { Parcel } from '../types';
import { notificationService } from './notification';
import { mockParcels } from './mockData';

const STORAGE_KEY = 'logitrack_parcels';
const MOCK_DATA_KEY = 'logitrack_mock_initialized';

export const storageService = {
  getParcels: (): Parcel[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    const mockInitialized = localStorage.getItem(MOCK_DATA_KEY);
    
    if (!data && !mockInitialized) {
      // Initialize with mock data on first load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockParcels));
      localStorage.setItem(MOCK_DATA_KEY, 'true');
      return mockParcels;
    }
    
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
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `LTRK${year}${random}`;
  }
};
