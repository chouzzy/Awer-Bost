interface Estado {
  [nomeEstado: string]: number;
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
