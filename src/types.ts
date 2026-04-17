
export type ParcelStatus = 
  | 'Order Placed' 
  | 'Packed' 
  | 'Dispatched' 
  | 'In Transit' 
  | 'Arrived at Hub' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Failed Delivery' 
  | 'Returned';

export type DeliveryType = 'Standard' | 'Express';

export interface StatusUpdate {
  status: ParcelStatus;
  location: string;
  timestamp: string;
  note?: string;
}

export interface Parcel {
  id: string; // Tracking ID
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  weight: string;
  deliveryType: DeliveryType;
  currentStatus: ParcelStatus;
  currentLocation: string;
  createdDate: string;
  expectedDelivery: string;
  history: StatusUpdate[];
  assignedAgent?: {
    name: string;
    contact: string;
    vehicle: string;
  };
}

export interface DashboardStats {
  total: number;
  delivered: number;
  inTransit: number;
  pending: number;
  failed: number;
}

export interface AppNotification {
  id: string;
  parcelId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'status_change' | 'alert';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  totalParcels: number;
  activeParcels: number;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'on_leave';
  currentLocation: string;
  totalDeliveries: number;
  activeDeliveries: number;
  rating: number;
  joinedDate: string;
}
