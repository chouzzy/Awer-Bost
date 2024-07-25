interface Estado {
  [nomeEstado: string]: number;
}
interface nomeEstado {
  [numeroEstado: number]: string;
}

const estados: Estado = {
  "Acre": 1,
  "Alagoas": 2,
  "Amazonas": 3,
  "Amapá": 4,
  "Bahia": 5,
  "Ceará": 6,
  "Distrito Federal": 7,
  "Espírito Santo": 8,
  "Goiás": 10,
  "Maranhão": 11,
  "Mato Grosso": 14,
  "Mato Grosso do Sul": 13,
  "Minas Gerais": 12,
  "Pará": 15,
  "Paraíba": 16,
  "Paraná": 19,
  "Pernambuco": 17,
  "Piauí": 18,
  "Rio de Janeiro": 20,
  "Rio Grande do Norte": 21,
  "Rio Grande do Sul": 24,
  "Rondônia": 22,
  "Roraima": 23,
  "Santa Catarina": 25,
  "Sergipe": 26,
  "São Paulo": 27,
  "Tocantins": 28
};

export function obterValorEstado(nomeEstado: string): number | string {
  return estados[nomeEstado] ?? "Estado não encontrado";
}
const nomeEstado: nomeEstado = {
  1:"Acre",
  2:"Alagoas",
  3:"Amazonas",
  4:"Amapá",
  5:"Bahia",
  6:"Ceará",
  7:"Distrito Federal",
  8:"Espírito Santo",
  10:"Goiás",
  11:"Maranhão",
  14:"Mato Grosso",
  13:"Mato Grosso do Sul",
  12:"Minas Gerais",
  15:"Pará",
  16:"Paraíba",
  19:"Paraná",
  17:"Pernambuco",
  18:"Piauí",
  20:"Rio de Janeiro",
  21:"Rio Grande do Norte",
  24:"Rio Grande do Sul",
  22:"Rondônia",
  23:"Roraima",
  25:"Santa Catarina",
  26:"Sergipe",
  27:"São Paulo",
  28: "Tocantins"
};

export async function obterNomeEstado(numeroEstado: number): Promise<string> {
  return nomeEstado[numeroEstado] ?? "Estado não encontrado";
}
