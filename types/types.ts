export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  PRESTATAIRE = 'prestataire'
}

export enum InterventionStatus {
  A_ATTRIBUER = 'a_attribuer',
  ACCEPTEE = 'acceptee',
  EN_COURS = 'en_cours',
  TERMINEE = 'terminee'
}

export enum InterventionType {
  STANDARD = 'standard',
  INTENDANCE = 'intendance'
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  company_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Logement {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  access_code?: string;
  instructions?: string;
  client_id: string;
  photos?: string[];
  created_at?: string;
}

export interface Intervention {
  id: string;
  logement_id: string;
  client_id: string;
  prestataire_id?: string | null;
  date: string;
  status: InterventionStatus;
  type: InterventionType;
  prix_client_ttc: number;
  prix_prestataire_ht: number;
  nb_voyageurs: number;
  special_instructions?: string;
  completed_at?: string;
  created_at?: string;
}

export interface AppState {
  isReady: boolean;
  currentStep: string;
}