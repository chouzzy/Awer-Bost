export interface dateSelected {
  initial: {
    day: string,
    month: string,
    year: string,
  },
  final: {
    day: string,
    month: string,
    year: string,
  }
}

type painelProps = 'Minha pauta' | 'Processos arquivados' | 'Pendentes de manifestação' | 'Acervo Geral'

export interface ScrapeData {
  username: string,
  password: string,
  trt: string,
  painel: painelProps,
  date: dateSelected
}

export interface credentials {
  user: string,
  password: string
}

export interface PuppeteerResult {
  page: any;
  browser: any;
}

export interface audistProps {
  processo: {
    numero: any;
    orgaoJulgador: { descricao: string; }
  };
  tipo: { descricao: string; }
}
export interface importDataProps {
  excelPath: string
  operationType: string
}

export interface scrapeDataListProps {
  trt: string
  trtNumber:number
  username: credentials["user"]
  password: credentials["password"]
  date: {
    initial: {
      day: string;
      month: string;
      year: string;
    };
    final: {
      day: string;
      month: string;
      year: string;
    };
  }
}
export interface processosArquivadosExcelList {
  trt: string
  trtNumber:number
  username: credentials["user"]
  password: credentials["password"]
  date: {
    initial: {
      day: string;
      month: string;
      year: string;
    };
    final: {
      day: string;
      month: string;
      year: string;
    };
  }
}

export type PuppeteerCallback = (headless: boolean) => Promise<PuppeteerResult>
