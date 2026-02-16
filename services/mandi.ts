
const MANDI_API_KEY = "579b464db66ec23bdd000001b6aa54e73f324b1e5692bed843155603";
const RESOURCE_ID = "9ef27c38-7da2-4302-abd4-4318391afc21";

export interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export interface MandiFilters {
  commodity?: string;
  state?: string;
  district?: string;
  market?: string;
}

export const fetchLiveMandiRates = async (filters: MandiFilters = {}): Promise<MandiRecord[]> => {
  try {
    let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${MANDI_API_KEY}&format=json&limit=50`;
    
    if (filters.commodity) {
      url += `&filters[commodity]=${encodeURIComponent(filters.commodity)}`;
    }
    if (filters.state) {
      url += `&filters[state]=${encodeURIComponent(filters.state)}`;
    }
    if (filters.district) {
      url += `&filters[district]=${encodeURIComponent(filters.district)}`;
    }
    if (filters.market) {
      url += `&filters[market]=${encodeURIComponent(filters.market)}`;
    }

    // Default sorting by arrival date if supported, though usually records are fresh
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.records) {
      return data.records as MandiRecord[];
    }
    return [];
  } catch (error) {
    console.error("Mandi API Error:", error);
    return [];
  }
};
