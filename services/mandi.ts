
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

export const fetchLiveMandiRates = async (commodity?: string, state?: string): Promise<MandiRecord[]> => {
  try {
    let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${MANDI_API_KEY}&format=json&limit=20`;
    
    if (commodity) {
      url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
    }
    if (state) {
      url += `&filters[state]=${encodeURIComponent(state)}`;
    }

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
