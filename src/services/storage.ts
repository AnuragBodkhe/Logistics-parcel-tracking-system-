import { Parcel } from '../types';
import { notificationService } from './notification';

const STORAGE_KEY = 'logitrack_parcels';

const getDefaultParcels = (): Parcel[] => {
  return [
    {
      id: 'TRK1708123456001',
      senderName: 'John Anderson',
      senderAddress: '123 Main Street, Suite 500, New York, NY 10001',
      receiverName: 'Sarah Mitchell',
      receiverAddress: '456 Oak Avenue, Apt 2B, Los Angeles, CA 90001',
      weight: '2.5 kg',
      deliveryType: 'Express',
      currentStatus: 'In Transit',
      currentLocation: 'Chicago Distribution Center',
      createdDate: '2024-01-15T10:30:00Z',
      expectedDelivery: '2024-01-17T18:00:00Z',
      history: [
        {
          status: 'Order Placed',
          location: 'New York, NY',
          timestamp: '2024-01-15T10:30:00Z',
          note: 'Order received and processed'
        },
        {
          status: 'Packed',
          location: 'New York, NY',
          timestamp: '2024-01-15T14:20:00Z',
          note: 'Package securely packed and labeled'
        },
        {
          status: 'Dispatched',
          location: 'New York, NY',
          timestamp: '2024-01-15T16:45:00Z',
          note: 'Dispatched from origin facility'
        },
        {
          status: 'In Transit',
          location: 'Chicago Distribution Center',
          timestamp: '2024-01-16T09:15:00Z',
          note: 'Arrived at Chicago hub for sorting'
        }
      ],
      assignedAgent: {
        name: 'Michael Rodriguez',
        contact: '+1-555-0123',
        vehicle: 'Delivery Van - Ford Transit'
      }
    },
    {
      id: 'TRK1708123456002',
      senderName: 'Emily Chen',
      senderAddress: '789 Tech Boulevard, Floor 12, San Francisco, CA 94105',
      receiverName: 'David Thompson',
      receiverAddress: '321 Innovation Drive, Austin, TX 78701',
      weight: '1.2 kg',
      deliveryType: 'Standard',
      currentStatus: 'Out for Delivery',
      currentLocation: 'Austin, TX',
      createdDate: '2024-01-14T09:15:00Z',
      expectedDelivery: '2024-01-18T16:00:00Z',
      history: [
        {
          status: 'Order Placed',
          location: 'San Francisco, CA',
          timestamp: '2024-01-14T09:15:00Z',
          note: 'Online order received'
        },
        {
          status: 'Packed',
          location: 'San Francisco, CA',
          timestamp: '2024-01-14T11:30:00Z',
          note: 'Package prepared for shipment'
        },
        {
          status: 'Dispatched',
          location: 'San Francisco, CA',
          timestamp: '2024-01-14T15:20:00Z',
          note: 'Shipped via ground transport'
        },
        {
          status: 'Arrived at Hub',
          location: 'Dallas, TX',
          timestamp: '2024-01-16T08:45:00Z',
          note: 'Arrived at Dallas distribution center'
        },
        {
          status: 'Out for Delivery',
          location: 'Austin, TX',
          timestamp: '2024-01-17T07:30:00Z',
          note: 'Loaded on delivery vehicle'
        }
      ],
      assignedAgent: {
        name: 'Lisa Johnson',
        contact: '+1-555-0124',
        vehicle: 'Delivery Truck - Mercedes Sprinter'
      }
    },
    {
      id: 'TRK1708123456003',
      senderName: 'Robert Williams',
      senderAddress: '555 Commerce Street, Boston, MA 02110',
      receiverName: 'Maria Garcia',
      receiverAddress: '888 Market Street, Suite 300, Philadelphia, PA 19103',
      weight: '4.8 kg',
      deliveryType: 'Express',
      currentStatus: 'Delivered',
      currentLocation: 'Philadelphia, PA',
      createdDate: '2024-01-13T14:20:00Z',
      expectedDelivery: '2024-01-15T12:00:00Z',
      history: [
        {
          status: 'Order Placed',
          location: 'Boston, MA',
          timestamp: '2024-01-13T14:20:00Z',
          note: 'Express order received'
        },
        {
          status: 'Packed',
          location: 'Boston, MA',
          timestamp: '2024-01-13T16:45:00Z',
          note: 'Priority packaging completed'
        },
        {
          status: 'Dispatched',
          location: 'Boston, MA',
          timestamp: '2024-01-13T18:30:00Z',
          note: 'Express dispatch initiated'
        },
        {
          status: 'In Transit',
          location: 'Newark, NJ',
          timestamp: '2024-01-14T06:15:00Z',
          note: 'In transit to destination'
        },
        {
          status: 'Arrived at Hub',
          location: 'Philadelphia, PA',
          timestamp: '2024-01-15T08:00:00Z',
          note: 'Arrived at local delivery hub'
        },
        {
          status: 'Out for Delivery',
          location: 'Philadelphia, PA',
          timestamp: '2024-01-15T09:30:00Z',
          note: 'Out for final delivery'
        },
        {
          status: 'Delivered',
          location: 'Philadelphia, PA',
          timestamp: '2024-01-15T11:45:00Z',
          note: 'Successfully delivered to recipient'
        }
      ],
      assignedAgent: {
        name: 'James Wilson',
        contact: '+1-555-0125',
        vehicle: 'Delivery Van - Dodge ProMaster'
      }
    },
    {
      id: 'TRK1708123456004',
      senderName: 'Amanda Foster',
      senderAddress: '200 Park Avenue, Seattle, WA 98101',
      receiverName: 'Christopher Lee',
      receiverAddress: '1500 Ocean Boulevard, Miami Beach, FL 33139',
      weight: '3.7 kg',
      deliveryType: 'Standard',
      currentStatus: 'Arrived at Hub',
      currentLocation: 'Miami Distribution Center',
      createdDate: '2024-01-16T11:00:00Z',
      expectedDelivery: '2024-01-20T16:00:00Z',
      history: [
        {
          status: 'Order Placed',
          location: 'Seattle, WA',
          timestamp: '2024-01-16T11:00:00Z',
          note: 'Cross-country shipment order'
        },
        {
          status: 'Packed',
          location: 'Seattle, WA',
          timestamp: '2024-01-16T13:15:00Z',
          note: 'Package prepared for long-distance shipping'
        },
        {
          status: 'Dispatched',
          location: 'Seattle, WA',
          timestamp: '2024-01-16T17:30:00Z',
          note: 'Shipped via air freight'
        },
        {
          status: 'In Transit',
          location: 'Denver, CO',
          timestamp: '2024-01-17T10:20:00Z',
          note: 'Transit through Denver hub'
        },
        {
          status: 'Arrived at Hub',
          location: 'Miami Distribution Center',
          timestamp: '2024-01-18T14:45:00Z',
          note: 'Arrived at destination city hub'
        }
      ],
      assignedAgent: {
        name: 'Patricia Martinez',
        contact: '+1-555-0126',
        vehicle: 'Delivery Truck - Isuzu NPR'
      }
    },
    {
      id: 'TRK1708123456005',
      senderName: 'Daniel Kim',
      senderAddress: '1000 Technology Way, San Jose, CA 95110',
      receiverName: 'Jennifer Brown',
      receiverAddress: '2500 Windy City Drive, Chicago, IL 60601',
      weight: '0.8 kg',
      deliveryType: 'Express',
      currentStatus: 'Failed Delivery',
      currentLocation: 'Chicago, IL',
      createdDate: '2024-01-17T08:45:00Z',
      expectedDelivery: '2024-01-18T12:00:00Z',
      history: [
        {
          status: 'Order Placed',
          location: 'San Jose, CA',
          timestamp: '2024-01-17T08:45:00Z',
          note: 'Urgent document shipment'
        },
        {
          status: 'Packed',
          location: 'San Jose, CA',
          timestamp: '2024-01-17T09:30:00Z',
          note: 'Secure packaging completed'
        },
        {
          status: 'Dispatched',
          location: 'San Jose, CA',
          timestamp: '2024-01-17T11:15:00Z',
          note: 'Express dispatch approved'
        },
        {
          status: 'In Transit',
          location: 'Phoenix, AZ',
          timestamp: '2024-01-17T16:20:00Z',
          note: 'Rapid transit through Phoenix'
        },
        {
          status: 'Out for Delivery',
          location: 'Chicago, IL',
          timestamp: '2024-01-18T09:00:00Z',
          note: 'Out for morning delivery'
        },
        {
          status: 'Failed Delivery',
          location: 'Chicago, IL',
          timestamp: '2024-01-18T11:30:00Z',
          note: 'Recipient not available - will retry tomorrow'
        }
      ],
      assignedAgent: {
        name: 'Robert Taylor',
        contact: '+1-555-0127',
        vehicle: 'Delivery Motorcycle - Honda PCX'
      }
    },
    {
      id: 'TRK1708123456006',
      senderName: 'Lisa Thompson',
      senderAddress: '300 Financial Center, Miami, FL 33131',
      receiverName: 'Mark Davis',
      receiverAddress: '500 Capital Boulevard, Washington, DC 20001',
      weight: '5.2 kg',
      deliveryType: 'Standard',
      currentStatus: 'Packed',
      currentLocation: 'Miami, FL',
      createdDate: '2024-01-18T15:30:00Z',
      expectedDelivery: '2024-01-22T16:00:00Z',
      history: [
        {
          status: 'Order Placed',
          location: 'Miami, FL',
          timestamp: '2024-01-18T15:30:00Z',
          note: 'Government document shipment'
        },
        {
          status: 'Packed',
          location: 'Miami, FL',
          timestamp: '2024-01-18T17:45:00Z',
          note: 'Special handling packaging completed'
        }
      ],
      assignedAgent: {
        name: 'Not Assigned',
        contact: '',
        vehicle: ''
      }
    }
  ];
};

export const storageService = {
  getParcels: (): Parcel[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    
    // Initialize with default parcels if no data exists
    const defaultParcels = getDefaultParcels();
    storageService.saveParcels(defaultParcels);
    return defaultParcels;
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
