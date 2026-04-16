import { Parcel, StatusUpdate, DeliveryAgent } from '../types';

export const mockParcels: Parcel[] = [
  {
    id: 'LTRK2024001',
    senderName: 'John Anderson',
    senderAddress: '123 Tech Park, Silicon Valley, CA 94025',
    senderPhone: '+1-555-0123',
    senderEmail: 'john.anderson@techcorp.com',
    receiverName: 'Sarah Mitchell',
    receiverAddress: '456 Business District, New York, NY 10001',
    receiverPhone: '+1-555-0456',
    receiverEmail: 'sarah.mitchell@business.com',
    weight: '2.5 kg',
    dimensions: {
      length: '30 cm',
      width: '20 cm',
      height: '15 cm'
    },
    deliveryType: 'Express',
    currentStatus: 'In Transit',
    currentLocation: 'Chicago Distribution Center',
    createdDate: '2024-01-15T09:00:00Z',
    expectedDelivery: '2024-01-17T18:00:00Z',
    price: 45.99,
    insurance: true,
    insuranceAmount: 500,
    specialInstructions: 'Handle with care - contains sensitive electronics',
    category: 'Electronics',
    priority: 'Express',
    paymentMethod: 'Credit Card',
    trackingUrl: 'https://track.logitrack.com/LTRK2024001',
    history: [
      {
        status: 'Order Placed',
        location: 'San Francisco, CA',
        timestamp: '2024-01-15T09:00:00Z',
        note: 'Order placed by John Anderson'
      },
      {
        status: 'Packed',
        location: 'San Francisco Warehouse',
        timestamp: '2024-01-15T11:30:00Z',
        note: 'Package prepared for shipment'
      },
      {
        status: 'Dispatched',
        location: 'San Francisco Distribution Center',
        timestamp: '2024-01-15T14:00:00Z',
        note: 'Package dispatched via Express delivery'
      },
      {
        status: 'In Transit',
        location: 'Chicago Distribution Center',
        timestamp: '2024-01-16T08:15:00Z',
        note: 'Package arrived at Chicago hub'
      }
    ],
    assignedAgent: {
      id: '1',
      name: 'Michael Roberts',
      contact: '+1-555-0789',
      vehicle: 'Van',
      vehicleNumber: 'EXP-1234',
      rating: 4.8
    }
  },
  {
    id: 'LTRK2024002',
    senderName: 'Emily Chen',
    senderAddress: '789 Fashion Avenue, Los Angeles, CA 90001',
    senderPhone: '+1-555-0234',
    senderEmail: 'emily.chen@fashionboutique.com',
    receiverName: 'David Thompson',
    receiverAddress: '321 Shopping Mall, Miami, FL 33101',
    receiverPhone: '+1-555-0567',
    receiverEmail: 'david.thompson@email.com',
    weight: '1.2 kg',
    dimensions: {
      length: '25 cm',
      width: '15 cm',
      height: '10 cm'
    },
    deliveryType: 'Standard',
    currentStatus: 'Delivered',
    currentLocation: 'Miami, FL',
    createdDate: '2024-01-10T10:00:00Z',
    expectedDelivery: '2024-01-14T17:00:00Z',
    actualDelivery: '2024-01-13T14:30:00Z',
    price: 12.50,
    insurance: false,
    category: 'Clothing',
    priority: 'Standard',
    paymentMethod: 'Prepaid',
    trackingUrl: 'https://track.logitrack.com/LTRK2024002',
    history: [
      {
        status: 'Order Placed',
        location: 'Los Angeles, CA',
        timestamp: '2024-01-10T10:00:00Z',
        note: 'Order placed by Emily Chen'
      },
      {
        status: 'Packed',
        location: 'Los Angeles Warehouse',
        timestamp: '2024-01-10T13:00:00Z',
        note: 'Designer clothing packaged'
      },
      {
        status: 'Dispatched',
        location: 'Los Angeles Distribution Center',
        timestamp: '2024-01-11T09:00:00Z',
        note: 'Shipped via Standard delivery'
      },
      {
        status: 'In Transit',
        location: 'Phoenix, AZ',
        timestamp: '2024-01-11T16:00:00Z',
        note: 'In transit to Miami'
      },
      {
        status: 'Arrived at Hub',
        location: 'Miami Distribution Center',
        timestamp: '2024-01-12T11:00:00Z',
        note: 'Arrived at Miami hub'
      },
      {
        status: 'Out for Delivery',
        location: 'Miami, FL',
        timestamp: '2024-01-13T08:00:00Z',
        note: 'Out for final delivery'
      },
      {
        status: 'Delivered',
        location: 'Miami, FL',
        timestamp: '2024-01-13T14:30:00Z',
        note: 'Delivered to David Thompson'
      }
    ],
    assignedAgent: {
      id: '2',
      name: 'Lisa Martinez',
      contact: '+1-555-0890',
      vehicle: 'Motorcycle',
      vehicleNumber: 'STD-5678',
      rating: 4.9
    }
  },
  {
    id: 'LTRK2024003',
    senderName: 'Robert Williams',
    senderAddress: '555 Financial Center, Chicago, IL 60601',
    senderPhone: '+1-555-0345',
    senderEmail: 'robert.williams@lawfirm.com',
    receiverName: 'Jennifer Davis',
    receiverAddress: '999 Legal Street, Washington, DC 20001',
    receiverPhone: '+1-555-0678',
    receiverEmail: 'jennifer.davis@legal.com',
    weight: '0.5 kg',
    dimensions: {
      length: '35 cm',
      width: '25 cm',
      height: '5 cm'
    },
    deliveryType: 'Overnight',
    currentStatus: 'Out for Delivery',
    currentLocation: 'Washington, DC',
    createdDate: '2024-01-16T16:00:00Z',
    expectedDelivery: '2024-01-17T10:00:00Z',
    price: 85.00,
    insurance: true,
    insuranceAmount: 1000,
    specialInstructions: 'Confidential legal documents - signature required',
    category: 'Documents',
    priority: 'Overnight',
    paymentMethod: 'Credit Card',
    trackingUrl: 'https://track.logitrack.com/LTRK2024003',
    history: [
      {
        status: 'Order Placed',
        location: 'Chicago, IL',
        timestamp: '2024-01-16T16:00:00Z',
        note: 'Urgent legal documents shipment'
      },
      {
        status: 'Packed',
        location: 'Chicago Legal Office',
        timestamp: '2024-01-16T17:00:00Z',
        note: 'Documents secured in tamper-proof packaging'
      },
      {
        status: 'Dispatched',
        location: 'Chicago O\'Hare Airport',
        timestamp: '2024-01-16T20:00:00Z',
        note: 'Air freight to Washington DC'
      },
      {
        status: 'Arrived at Hub',
        location: 'Washington DC Airport',
        timestamp: '2024-01-17T06:00:00Z',
        note: 'Arrived at destination airport'
      },
      {
        status: 'Out for Delivery',
        location: 'Washington, DC',
        timestamp: '2024-01-17T08:00:00Z',
        note: 'Special courier assigned for delivery'
      }
    ],
    assignedAgent: {
      id: '3',
      name: 'James Wilson',
      contact: '+1-555-0901',
      vehicle: 'Secured Van',
      vehicleNumber: 'OVN-9999',
      rating: 5.0
    }
  },
  {
    id: 'LTRK2024004',
    senderName: 'Maria Garcia',
    senderAddress: '777 Food Market, Houston, TX 77001',
    senderPhone: '+1-555-0456',
    senderEmail: 'maria.garcia@restaurant.com',
    receiverName: 'Thomas Lee',
    receiverAddress: '888 Culinary Street, Dallas, TX 75201',
    receiverPhone: '+1-555-0789',
    receiverEmail: 'thomas.lee@dining.com',
    weight: '5.0 kg',
    dimensions: {
      length: '40 cm',
      width: '30 cm',
      height: '25 cm'
    },
    deliveryType: 'Express',
    currentStatus: 'Failed Delivery',
    currentLocation: 'Dallas, TX',
    createdDate: '2024-01-14T08:00:00Z',
    expectedDelivery: '2024-01-14T16:00:00Z',
    price: 35.75,
    insurance: false,
    specialInstructions: 'Perishable items - deliver within 24 hours',
    category: 'Food',
    priority: 'Express',
    paymentMethod: 'COD',
    trackingUrl: 'https://track.logitrack.com/LTRK2024004',
    history: [
      {
        status: 'Order Placed',
        location: 'Houston, TX',
        timestamp: '2024-01-14T08:00:00Z',
        note: 'Fresh food order placed'
      },
      {
        status: 'Packed',
        location: 'Houston Restaurant',
        timestamp: '2024-01-14T09:00:00Z',
        note: 'Food items packed in temperature-controlled containers'
      },
      {
        status: 'Dispatched',
        location: 'Houston Distribution Center',
        timestamp: '2024-01-14T10:00:00Z',
        note: 'Express shipment to Dallas'
      },
      {
        status: 'In Transit',
        location: 'En route to Dallas',
        timestamp: '2024-01-14T12:00:00Z',
        note: 'Vehicle en route'
      },
      {
        status: 'Arrived at Hub',
        location: 'Dallas Distribution Center',
        timestamp: '2024-01-14T14:00:00Z',
        note: 'Arrived at Dallas hub'
      },
      {
        status: 'Out for Delivery',
        location: 'Dallas, TX',
        timestamp: '2024-01-14T15:00:00Z',
        note: 'Out for delivery'
      },
      {
        status: 'Failed Delivery',
        location: 'Dallas, TX',
        timestamp: '2024-01-14T17:30:00Z',
        note: 'Recipient not available - will retry tomorrow'
      }
    ],
    assignedAgent: {
      id: '4',
      name: 'Carlos Rodriguez',
      contact: '+1-555-0912',
      vehicle: 'Refrigerated Van',
      vehicleNumber: 'EXP-3456',
      rating: 4.6
    }
  },
  {
    id: 'LTRK2024005',
    senderName: 'Amanda Foster',
    senderAddress: '222 Antique Shop, Boston, MA 02101',
    senderPhone: '+1-555-0567',
    senderEmail: 'amanda.foster@antiques.com',
    receiverName: 'Christopher Moore',
    receiverAddress: '444 Art Gallery, Philadelphia, PA 19101',
    receiverPhone: '+1-555-0890',
    receiverEmail: 'christopher.moore@gallery.com',
    weight: '8.5 kg',
    dimensions: {
      length: '60 cm',
      width: '40 cm',
      height: '50 cm'
    },
    deliveryType: 'Standard',
    currentStatus: 'Arrived at Hub',
    currentLocation: 'Philadelphia Distribution Center',
    createdDate: '2024-01-12T11:00:00Z',
    expectedDelivery: '2024-01-18T16:00:00Z',
    price: 125.00,
    insurance: true,
    insuranceAmount: 2500,
    specialInstructions: 'Extremely fragile antique vase - maximum care required',
    category: 'Fragile',
    priority: 'Standard',
    paymentMethod: 'Credit Card',
    trackingUrl: 'https://track.logitrack.com/LTRK2024005',
    history: [
      {
        status: 'Order Placed',
        location: 'Boston, MA',
        timestamp: '2024-01-12T11:00:00Z',
        note: 'Antique vase shipment ordered'
      },
      {
        status: 'Packed',
        location: 'Boston Antique Shop',
        timestamp: '2024-01-12T13:00:00Z',
        note: 'Item professionally packed with custom crate'
      },
      {
        status: 'Dispatched',
        location: 'Boston Distribution Center',
        timestamp: '2024-01-13T09:00:00Z',
        note: 'Special handling shipment dispatched'
      },
      {
        status: 'In Transit',
        location: 'New York, NY',
        timestamp: '2024-01-13T16:00:00Z',
        note: 'Transit through New York hub'
      },
      {
        status: 'Arrived at Hub',
        location: 'Philadelphia Distribution Center',
        timestamp: '2024-01-14T10:00:00Z',
        note: 'Arrived at Philadelphia hub - inspection required'
      }
    ],
    assignedAgent: {
      id: '5',
      name: 'Patricia Chen',
      contact: '+1-555-0923',
      vehicle: 'Specialized Truck',
      vehicleNumber: 'FRG-7890',
      rating: 4.9
    }
  },
  {
    id: 'LTRK2024006',
    senderName: 'Daniel Kim',
    senderAddress: '333 Electronics Store, Seattle, WA 98101',
    senderPhone: '+1-555-0678',
    senderEmail: 'daniel.kim@electronics.com',
    receiverName: 'Sophie Turner',
    receiverAddress: '666 Tech Avenue, Portland, OR 97201',
    receiverPhone: '+1-555-0901',
    receiverEmail: 'sophie.turner@tech.com',
    weight: '3.2 kg',
    dimensions: {
      length: '45 cm',
      width: '35 cm',
      height: '20 cm'
    },
    deliveryType: 'Express',
    currentStatus: 'Packed',
    currentLocation: 'Seattle Warehouse',
    createdDate: '2024-01-17T14:00:00Z',
    expectedDelivery: '2024-01-19T12:00:00Z',
    price: 55.25,
    insurance: true,
    insuranceAmount: 800,
    specialInstructions: 'High-value electronics - require signature and ID verification',
    category: 'Electronics',
    priority: 'Express',
    paymentMethod: 'Prepaid',
    trackingUrl: 'https://track.logitrack.com/LTRK2024006',
    history: [
      {
        status: 'Order Placed',
        location: 'Seattle, WA',
        timestamp: '2024-01-17T14:00:00Z',
        note: 'Electronics order placed'
      },
      {
        status: 'Packed',
        location: 'Seattle Warehouse',
        timestamp: '2024-01-17T16:00:00Z',
        note: 'Laptop and accessories packaged securely'
      }
    ],
    assignedAgent: {
      id: '6',
      name: 'Kevin Park',
      contact: '+1-555-0934',
      vehicle: 'Van',
      vehicleNumber: 'EXP-2468',
      rating: 4.7
    }
  }
];

export const mockAgents: DeliveryAgent[] = [
  {
    id: '1',
    name: 'Michael Roberts',
    phone: '+1-555-0789',
    email: 'michael.roberts@logitrack.com',
    vehicle: 'Van',
    vehicleNumber: 'EXP-1234',
    licenseNumber: 'DL123456',
    status: 'active',
    currentLocation: 'Chicago, IL',
    totalDeliveries: 145,
    activeDeliveries: 8,
    rating: 4.8,
    joinedDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Lisa Martinez',
    phone: '+1-555-0890',
    email: 'lisa.martinez@logitrack.com',
    vehicle: 'Motorcycle',
    vehicleNumber: 'STD-5678',
    licenseNumber: 'DL789012',
    status: 'active',
    currentLocation: 'Miami, FL',
    totalDeliveries: 132,
    activeDeliveries: 5,
    rating: 4.9,
    joinedDate: '2023-03-20'
  },
  {
    id: '3',
    name: 'James Wilson',
    phone: '+1-555-0901',
    email: 'james.wilson@logitrack.com',
    vehicle: 'Secured Van',
    vehicleNumber: 'OVN-9999',
    licenseNumber: 'DL345678',
    status: 'active',
    currentLocation: 'Washington, DC',
    totalDeliveries: 98,
    activeDeliveries: 3,
    rating: 5.0,
    joinedDate: '2023-02-10'
  },
  {
    id: '4',
    name: 'Carlos Rodriguez',
    phone: '+1-555-0912',
    email: 'carlos.rodriguez@logitrack.com',
    vehicle: 'Refrigerated Van',
    vehicleNumber: 'EXP-3456',
    licenseNumber: 'DL456789',
    status: 'active',
    currentLocation: 'Dallas, TX',
    totalDeliveries: 87,
    activeDeliveries: 6,
    rating: 4.6,
    joinedDate: '2023-04-15'
  },
  {
    id: '5',
    name: 'Patricia Chen',
    phone: '+1-555-0923',
    email: 'patricia.chen@logitrack.com',
    vehicle: 'Specialized Truck',
    vehicleNumber: 'FRG-7890',
    licenseNumber: 'DL567890',
    status: 'active',
    currentLocation: 'Philadelphia, PA',
    totalDeliveries: 76,
    activeDeliveries: 4,
    rating: 4.9,
    joinedDate: '2023-05-20'
  },
  {
    id: '6',
    name: 'Kevin Park',
    phone: '+1-555-0934',
    email: 'kevin.park@logitrack.com',
    vehicle: 'Van',
    vehicleNumber: 'EXP-2468',
    licenseNumber: 'DL678901',
    status: 'active',
    currentLocation: 'Seattle, WA',
    totalDeliveries: 64,
    activeDeliveries: 2,
    rating: 4.7,
    joinedDate: '2023-06-25'
  }
];
