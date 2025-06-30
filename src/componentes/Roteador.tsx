/**
 * ROTEADOR - CENTRO DE CONTROLE DO SISTEMA WB
 * ==========================================
 * 
 * Gerencia estado centralizado e navegação entre telas.
 * Convertido para componente funcional com hooks.
 * Utiliza useState e useCallback para controle de estado e ciclo de vida.
 */

import { useState, useCallback } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import BarraNavegacao from './BarraNavegacao';
import Home from './Home';
import Cadastros from './Cadastros';
import Listagens from './Listagens';
import RegistroConsumo from './RegistroConsumo';
import Relatorios from './Relatorios';
import { temaPrincipal } from '../tema';
import { Empresa } from '../modelo';
import { PopuladorDados } from '../dados/PopuladorDados';
import type { TelasDisponiveis } from '../tipos';

export default function Roteador() {
  // Estado usando hooks
  const [tela, setTela] = useState<TelasDisponiveis>('Home');
  const [empresa] = useState<Empresa>(() => {
    // Inicializa empresa com dados de teste usando lazy initial state
    const empresaInicial = new Empresa();
    PopuladorDados.popularDados(empresaInicial);
    return empresaInicial;
  });

  // Funções de controle usando useCallback para otimização
  const atualizarInterface = useCallback(() => {
    // Força re-render - em hooks seria melhor usar um estado separado para forçar update
    console.log('Interface atualizada');
  }, []);

  const selecionarView = useCallback((novaTela: string, evento?: React.MouseEvent) => {
    if (evento) {
      evento.preventDefault();
    }
    console.log('Navegando para:', novaTela);
    setTela(novaTela as TelasDisponiveis);
  }, []);

  // Função para renderizar conteúdo baseado na tela atual
  const renderizarConteudo = () => {
    switch (tela) {
      case 'Home':
        return <Home 
          clientes={empresa.getClientes}
          produtos={empresa.getProdutos}
          servicos={empresa.getServicos}
        />;
      case 'Cadastros':
        return <Cadastros 
          empresa={empresa}
          atualizarInterface={atualizarInterface}
        />;
      case 'Listagens':
        return <Listagens 
          empresa={empresa}
          atualizarInterface={atualizarInterface}
        />;
      case 'Consumo':
        return <RegistroConsumo 
          empresa={empresa}
          atualizarInterface={atualizarInterface}
        />;
      case 'Relatórios':
        return <Relatorios 
          empresa={empresa}
        />;
      default:
        return <Home 
          clientes={empresa.getClientes}
          produtos={empresa.getProdutos}
          servicos={empresa.getServicos}
        />;
    }
  };

  const botoes = ['Home', 'Cadastros', 'Listagens', 'Consumo', 'Relatórios'];

  return (
    <ThemeProvider theme={temaPrincipal}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <BarraNavegacao 
          seletorView={selecionarView} 
          botoes={botoes} 
        />
        <Box component="main">
          {renderizarConteudo()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
