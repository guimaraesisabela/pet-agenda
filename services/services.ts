export const PETSHOP_SERVICES = [
  "Banho",
  "Tosa",
  "Banho e Tosa",
  "Tosa Higiênica",
  "Consulta Veterinária",
  "Vacinação",
  "Corte de Unhas",
  "Limpeza de Ouvidos",
] as const;

export type PetshopService = typeof PETSHOP_SERVICES[number];