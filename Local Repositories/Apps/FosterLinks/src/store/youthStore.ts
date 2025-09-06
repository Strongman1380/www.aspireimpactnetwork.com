import { create } from 'zustand';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface YouthProfile {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  fosterParentId?: string;
  foster_worker?: string;
  // Add other youth profile fields as needed
}

interface YouthState {
  youthProfiles: YouthProfile[];
  selectedYouth: YouthProfile | null;
  loading: boolean;
  error: string | null;
  fetchYouthProfiles: (userId: string, userRole: string) => Promise<void>;
  fetchYouthById: (youthId: string) => Promise<void>;
  clearSelectedYouth: () => void;
}

export const useYouthStore = create<YouthState>((set, get) => ({
  youthProfiles: [],
  selectedYouth: null,
  loading: false,
  error: null,
  
  fetchYouthProfiles: async (userId: string, userRole: string) => {
    set({ loading: true, error: null });
    
    try {
      let youthQuery;
      
      if (userRole === 'foster_parent') {
        console.log('Fetching youth for foster parent:', userId);
        youthQuery = query(
          collection(db, 'youth_profiles'),
          where('fosterParentId', '==', userId)
        );
      } else {
        // Admin and workers can see all youth
        console.log('Fetching all youth profiles');
        youthQuery = collection(db, 'youth_profiles');
      }
      
      const querySnapshot = await getDocs(youthQuery);
      
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as YouthProfile[];
      
      console.log(`Found ${profiles.length} youth profiles`);
      set({ youthProfiles: profiles, loading: false });
    } catch (error: any) {
      console.error('Error fetching youth profiles:', error);
      set({ 
        error: 'Failed to load youth profiles. Please try again.', 
        loading: false 
      });
    }
  },
  
  fetchYouthById: async (youthId: string) => {
    set({ loading: true, error: null });
    
    try {
      const youthDoc = await getDoc(doc(db, 'youth_profiles', youthId));
      
      if (youthDoc.exists()) {
        set({ 
          selectedYouth: { id: youthDoc.id, ...youthDoc.data() } as YouthProfile,
          loading: false 
        });
      } else {
        set({ 
          error: 'Youth profile not found', 
          loading: false 
        });
      }
    } catch (error: any) {
      console.error('Error fetching youth profile:', error);
      set({ 
        error: 'Failed to load youth profile. Please try again.', 
        loading: false 
      });
    }
  },
  
  clearSelectedYouth: () => {
    set({ selectedYouth: null });
  }
}));