// Tipos principais do sistema WB - compatíveis com as classes do modelo
import type { Empresa, Cliente, Produto, Servico } from '../modelo';

// Tipos para componentes
export interface PropsComponente {
  // Interface base - sem tema pois usamos ThemeProvider global
}

export interface PropsBarraNavegacao extends PropsComponente {
  botoes: string[];
  seletorView: (novaTela: string, evento: React.MouseEvent) => void;
}

export interface PropsHome extends PropsComponente {
  clientes?: Cliente[];
  produtos?: Produto[];
  servicos?: Servico[];
}

export interface PropsComEmpresa extends PropsComponente {
  empresa: Empresa;
  atualizarInterface?: () => void;
}

export type TelasDisponiveis = 'Home' | 'Cadastros' | 'Listagens' | 'Consumo' | 'Relatórios';
