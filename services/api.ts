
import { UserProfile } from '../types';

/**
 * MOCK BACKEND SERVICE
 * Simulates API calls to a remote server with persistence.
 */

export interface MarketplaceListing {
  id: string;
  farmerName: string;
  crop: string;
  quantity: string;
  price: string;
  grade: string;
  timestamp: number;
  status: 'pending' | 'sold' | 'active';
}

const STORAGE_KEYS = {
  PROFILE: 'kisanSathi_profile',
  LISTINGS: 'kisanSathi_listings',
  GLOBAL_LISTINGS: 'kisanSathi_global_listings',
};

// Initial mock data for other sellers
const INITIAL_GLOBAL_LISTINGS: MarketplaceListing[] = [
  {
    id: 'g1',
    farmerName: 'Rajesh Kumar',
    crop: 'Organic Basmati Rice',
    quantity: '200 Qtl',
    price: '4500',
    grade: 'Grade A+',
    timestamp: Date.now() - 86400000,
    status: 'active'
  },
  {
    id: 'g2',
    farmerName: 'Suresh Singh',
    crop: 'Yellow Mustard',
    quantity: '50 Qtl',
    price: '5200',
    grade: 'Grade A',
    timestamp: Date.now() - 172800000,
    status: 'active'
  },
  {
    id: 'g3',
    farmerName: 'Amit Patel',
    crop: 'Potatoes (Kufri)',
    quantity: '500 Qtl',
    price: '1200',
    grade: 'Grade B',
    timestamp: Date.now() - 43200000,
    status: 'active'
  }
];

// Simulation delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockBackend = {
  // --- USER PROFILE ENDPOINTS ---
  
  async saveProfile(profile: UserProfile): Promise<{ success: boolean }> {
    await delay(1200); // Simulate network latency
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return { success: true };
  },

  async getProfile(): Promise<UserProfile | null> {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },

  async clearProfile(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.LISTINGS); // Clear user's listings too on logout
  },

  // --- MARKETPLACE ENDPOINTS ---

  async createListing(listing: Omit<MarketplaceListing, 'id' | 'timestamp' | 'status'>): Promise<MarketplaceListing> {
    await delay(1500);
    const newList: MarketplaceListing = {
      ...listing,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'active'
    };
    
    // Save to user's listings
    const existing = await this.getMyListings();
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify([newList, ...existing]));

    // Also save to global listings for the "Sellers" view
    const globalData = localStorage.getItem(STORAGE_KEYS.GLOBAL_LISTINGS);
    const globalListings = globalData ? JSON.parse(globalData) : INITIAL_GLOBAL_LISTINGS;
    localStorage.setItem(STORAGE_KEYS.GLOBAL_LISTINGS, JSON.stringify([newList, ...globalListings]));

    return newList;
  },

  async getMyListings(): Promise<MarketplaceListing[]> {
    const data = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    return data ? JSON.parse(data) : [];
  },

  async getAllListings(): Promise<MarketplaceListing[]> {
    await delay(800);
    const data = localStorage.getItem(STORAGE_KEYS.GLOBAL_LISTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.GLOBAL_LISTINGS, JSON.stringify(INITIAL_GLOBAL_LISTINGS));
      return INITIAL_GLOBAL_LISTINGS;
    }
    return JSON.parse(data);
  },

  async deleteListing(id: string): Promise<void> {
    const existing = await this.getMyListings();
    const filtered = existing.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(filtered));

    // Also remove from global if it's there
    const globalData = localStorage.getItem(STORAGE_KEYS.GLOBAL_LISTINGS);
    if (globalData) {
      const globalListings: MarketplaceListing[] = JSON.parse(globalData);
      const filteredGlobal = globalListings.filter(l => l.id !== id);
      localStorage.setItem(STORAGE_KEYS.GLOBAL_LISTINGS, JSON.stringify(filteredGlobal));
    }
  }
};
