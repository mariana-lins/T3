import { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import type { PropsComEmpresa } from '../tipos';
import { Servico } from '../modelo';

interface StateFormularioServico {
  nome: string;
  preco: string;
  mensagem: string;
  tipoMensagem: 'success' | 'error' | 'info';
}

export default function FormularioCadastroServico({ empresa, atualizarInterface }: PropsComEmpresa) {
  const [state, setState] = useState<StateFormularioServico>({
    nome: '',
    preco: '',
    mensagem: '',
    tipoMensagem: 'info',
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      mensagem: ''
    }));
  }, []);

  const validarFormulario = useCallback((): boolean => {
    const { nome, preco } = state;

    if (!nome.trim()) {
      setState(prev => ({
        ...prev,
        mensagem: 'Nome do serviço é obrigatório',
        tipoMensagem: 'error'
      }));
      return false;
    }

    if (!preco.trim()) {
      setState(prev => ({
        ...prev,
        mensagem: 'Preço é obrigatório',
        tipoMensagem: 'error'
      }));
      return false;
    }

    const precoNumerico = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      setState(prev => ({
        ...prev,
        mensagem: 'Preço deve ser um número válido maior que zero',
        tipoMensagem: 'error'
      }));
      return false;
    }

    return true;
  }, [state]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      const { nome, preco } = state;
      const precoNumerico = parseFloat(preco.replace(',', '.'));
      
      const novoServico = new Servico(nome, precoNumerico);

      // Adicionar serviço à empresa através das props
      empresa.adicionarServico(novoServico);
      if (atualizarInterface) {
        atualizarInterface();
      }

      setState(prev => ({
        ...prev,
        mensagem: `Serviço ${nome} cadastrado com sucesso!`,
        tipoMensagem: 'success',
        nome: '',
        preco: ''
      }));

    } catch {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao cadastrar serviço.',
        tipoMensagem: 'error'
      }));
    }
  }, [state, validarFormulario, empresa, atualizarInterface]);

  const { nome, preco, mensagem, tipoMensagem } = state;

  return (
    <Box>
      {mensagem && (
        <Alert severity={tipoMensagem} sx={{ mb: 3 }}>
          {mensagem}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nome do Serviço"
            value={nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Preço"
            value={preco}
            onChange={(e) => handleInputChange('preco', e.target.value)}
            fullWidth
            required
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            helperText="Digite o preço em reais (ex: 45.00)"
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
          >
            Cadastrar Serviço
          </Button>
        </Box>
      </form>
    </Box>
  );
}