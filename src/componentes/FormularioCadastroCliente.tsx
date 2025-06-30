import { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { PropsComEmpresa } from '../tipos';
import { Cliente, CPF, RG, Telefone } from '../modelo';

interface StateFormularioCliente {
  nome: string;
  nomeSocial: string;
  cpf: string;
  rg: string;
  telefone: string;
  genero: string;
  mensagem: string;
  tipoMensagem: 'success' | 'error' | 'info';
}

export default function FormularioCadastroCliente({ empresa, atualizarInterface }: PropsComEmpresa) {
  const [state, setState] = useState<StateFormularioCliente>({
    nome: '',
    nomeSocial: '',
    cpf: '',
    rg: '',
    telefone: '',
    genero: '',
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
    const { nome, nomeSocial, cpf, rg, telefone, genero } = state;

    if (!nome.trim()) {
      setState(prev => ({
        ...prev,
        mensagem: 'Nome é obrigatório',
        tipoMensagem: 'error'
      }));
      return false;
    }

    if (!nomeSocial.trim()) {
      setState(prev => ({
        ...prev,
        mensagem: 'Nome social é obrigatório',
        tipoMensagem: 'error'
      }));
      return false;
    }

    if (!cpf.trim()) {
      setState(prev => ({
        ...prev,
        mensagem: 'CPF é obrigatório',
        tipoMensagem: 'error'
      }));
      return false;
    }

    if (!rg.trim()) {
      setState(prev => ({
        ...prev,
        mensagem: 'RG é obrigatório',
        tipoMensagem: 'error'
      }));
      return false;
    }

    if (!telefone.trim()) {
      setState(prev => ({
        ...prev,
        mensagem: 'Telefone é obrigatório',
        tipoMensagem: 'error'
      }));
      return false;
    }

    if (!genero) {
      setState(prev => ({
        ...prev,
        mensagem: 'Gênero é obrigatório',
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
      const { nome, nomeSocial, cpf, rg, telefone, genero } = state;
      
      const novoCpf = new CPF(cpf);
      const novoRg = new RG(rg);
      const telefoneNumeros = telefone.replace(/\D/g, ''); 
      
      let ddd = '';
      let numeroTelefone = '';
      
      if (telefoneNumeros.length >= 10) {
        ddd = telefoneNumeros.substring(0, 2);
        numeroTelefone = telefoneNumeros.substring(2);
      } else {
        setState(prev => ({
          ...prev,
          mensagem: 'Telefone deve conter DDD e número completo (mínimo 10 dígitos)',
          tipoMensagem: 'error'
        }));
        return;
      }
      
      const novoTelefone = new Telefone(ddd, numeroTelefone);
      
      const novoCliente = new Cliente(nome, nomeSocial, novoCpf, genero);
      novoCliente.adicionarRG(novoRg);
      novoCliente.adicionarTelefone(novoTelefone);

      // Adicionar cliente à empresa através das props
      empresa.adicionarCliente(novoCliente);
      if (atualizarInterface) {
        atualizarInterface();
      }

      setState(prev => ({
        ...prev,
        mensagem: `Cliente ${nome} cadastrado com sucesso!`,
        tipoMensagem: 'success',
        nome: '',
        nomeSocial: '',
        cpf: '',
        rg: '',
        telefone: '',
        genero: ''
      }));

    } catch {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao cadastrar cliente.',
        tipoMensagem: 'error'
      }));
    }
  }, [state, validarFormulario, empresa, atualizarInterface]);

  const { nome, nomeSocial, cpf, rg, telefone, genero, mensagem, tipoMensagem } = state;

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
            label="Nome"
            value={nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Nome Social"
            value={nomeSocial}
            onChange={(e) => handleInputChange('nomeSocial', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="CPF"
            value={cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="RG"
            value={rg}
            onChange={(e) => handleInputChange('rg', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChange={(e) => handleInputChange('telefone', e.target.value)}
            fullWidth
            required
            helperText="Digite com DDD obrigatório: (11) 99999-9999"
          />

          <FormControl fullWidth required>
            <InputLabel>Gênero</InputLabel>
            <Select
              value={genero}
              onChange={(e) => handleInputChange('genero', e.target.value)}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Feminino</MenuItem>
              <MenuItem value="O">Outro</MenuItem>
            </Select>
          </FormControl>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
          >
            Cadastrar Cliente
          </Button>
        </Box>
      </form>
    </Box>
  );
}