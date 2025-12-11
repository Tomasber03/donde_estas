export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  location: string;
  date: string;
  reward?: string;
  imageUrl: string;
  statusTag: string; // Ej: "Perdido Propio"
}