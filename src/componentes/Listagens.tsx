import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PropsComEmpresa } from '../tipos';
import { Cliente, CPF, RG, Telefone, Produto, Servico } from '../modelo';

interface StateListagens {
  tabAtiva: number;
  modalEdicaoAberto: boolean;
  modalExclusaoAberto: boolean;
  tipoModal: 'cliente' | 'produto' | 'servico' | null;
  itemSelecionado: any;
  indexSelecionado: number;
  // Campos do formulário de edição
  nome: string;
  nomeSocial: string;
  cpf: string;
  rg: string;
  telefone: string;
  genero: string;
  preco: string;
  mensagem: string;
  tipoMensagem: 'success' | 'error' | 'info';
}

export default function Listagens({ empresa, atualizarInterface }: PropsComEmpresa) {
  const [state, setState] = useState<StateListagens>({
    tabAtiva: 0,
    modalEdicaoAberto: false,
    modalExclusaoAberto: false,
    tipoModal: null,
    itemSelecionado: null,
    indexSelecionado: -1,
    nome: '',
    nomeSocial: '',
    cpf: '',
    rg: '',
    telefone: '',
    genero: '',
    preco: '',
    mensagem: '',
    tipoMensagem: 'info',
  });

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setState(prev => ({ ...prev, tabAtiva: newValue }));
  }, []);

  const abrirModalEdicao = useCallback((tipo: 'cliente' | 'produto' | 'servico', item: any, index: number) => {
    if (tipo === 'cliente') {
      setState(prev => ({
        ...prev,
        modalEdicaoAberto: true,
        tipoModal: tipo,
        itemSelecionado: item,
        indexSelecionado: index,
        nome: item.nome,
        nomeSocial: item.nomeSocial,
        cpf: item.getCpf.getValor,
        rg: item.getRgs.length > 0 ? item.getRgs[0].getValor : '',
        telefone: item.getTelefones.length > 0 ? 
          `${item.getTelefones[0].getDdd}${item.getTelefones[0].getNumero}` : '',
        genero: item.genero,
      }));
    } else {
      setState(prev => ({
        ...prev,
        modalEdicaoAberto: true,
        tipoModal: tipo,
        itemSelecionado: item,
        indexSelecionado: index,
        nome: item.nome,
        preco: item.preco.toString(),
      }));
    }
  }, []);

  const abrirModalExclusao = useCallback((tipo: 'cliente' | 'produto' | 'servico', item: any, index: number) => {
    setState(prev => ({
      ...prev,
      modalExclusaoAberto: true,
      tipoModal: tipo,
      itemSelecionado: item,
      indexSelecionado: index,
    }));
  }, []);

  const fecharModais = useCallback(() => {
    setState(prev => ({
      ...prev,
      modalEdicaoAberto: false,
      modalExclusaoAberto: false,
      tipoModal: null,
      itemSelecionado: null,
      indexSelecionado: -1,
      nome: '',
      nomeSocial: '',
      cpf: '',
      rg: '',
      telefone: '',
      genero: '',
      preco: '',
      mensagem: '',
    }));
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      mensagem: ''
    }));
  }, []);

  const salvarEdicao = useCallback(() => {
    const { tipoModal, indexSelecionado, nome, nomeSocial, cpf, rg, telefone, genero, preco } = state;

    try {
      if (tipoModal === 'cliente') {
        const novoCpf = new CPF(cpf);
        const novoRg = new RG(rg);
        const telefoneNumeros = telefone.replace(/\D/g, '');
        
        let ddd = '';
        let numeroTelefone = '';
        
        if (telefoneNumeros.length >= 10) {
          ddd = telefoneNumeros.substring(0, 2);
          numeroTelefone = telefoneNumeros.substring(2);
        }
        
        const novoTelefone = new Telefone(ddd, numeroTelefone);
        const clienteEditado = new Cliente(nome, nomeSocial, novoCpf, genero);
        clienteEditado.adicionarRG(novoRg);
        clienteEditado.adicionarTelefone(novoTelefone);

        // Atualizar na empresa
        const clientes = empresa.getClientes;
        clientes[indexSelecionado] = clienteEditado;

      } else if (tipoModal === 'produto') {
        const precoNumerico = parseFloat(preco.replace(',', '.'));
        const produtoEditado = new Produto(nome, precoNumerico);
        const produtos = empresa.getProdutos;
        produtos[indexSelecionado] = produtoEditado;

      } else if (tipoModal === 'servico') {
        const precoNumerico = parseFloat(preco.replace(',', '.'));
        const servicoEditado = new Servico(nome, precoNumerico);
        const servicos = empresa.getServicos;
        servicos[indexSelecionado] = servicoEditado;
      }

      if (atualizarInterface) {
        atualizarInterface();
      }

      setState(prev => ({
        ...prev,
        mensagem: `${tipoModal} editado com sucesso!`,
        tipoMensagem: 'success'
      }));

      setTimeout(() => fecharModais(), 1500);

    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao salvar edição.',
        tipoMensagem: 'error'
      }));
    }
  }, [state, empresa, atualizarInterface, fecharModais]);

  const confirmarExclusao = useCallback(() => {
    const { tipoModal, indexSelecionado } = state;

    try {
      if (tipoModal === 'cliente') {
        const clientes = empresa.getClientes;
        clientes.splice(indexSelecionado, 1);
      } else if (tipoModal === 'produto') {
        const produtos = empresa.getProdutos;
        produtos.splice(indexSelecionado, 1);
      } else if (tipoModal === 'servico') {
        const servicos = empresa.getServicos;
        servicos.splice(indexSelecionado, 1);
      }

      if (atualizarInterface) {
        atualizarInterface();
      }

      fecharModais();

    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao excluir item.',
        tipoMensagem: 'error'
      }));
    }
  }, [state, empresa, atualizarInterface, fecharModais]);

  const renderizarClientes = useCallback(() => {
    const clientes = empresa.getClientes;

    if (clientes.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
          Nenhum cliente cadastrado.
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {clientes.map((cliente, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{cliente.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nome Social: {cliente.nomeSocial}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CPF: {cliente.getCpf.getValor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    RG: {cliente.getRgs.length > 0 ? cliente.getRgs[0].getValor : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Telefone: {cliente.getTelefones.length > 0 ? 
                      `(${cliente.getTelefones[0].getDdd}) ${cliente.getTelefones[0].getNumero}` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gênero: {cliente.genero === 'M' ? 'Masculino' : cliente.genero === 'F' ? 'Feminino' : 'Outro'}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => abrirModalEdicao('cliente', cliente, index)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => abrirModalExclusao('cliente', cliente, index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }, [empresa, abrirModalEdicao, abrirModalExclusao]);

  const renderizarProdutos = useCallback(() => {
    const produtos = empresa.getProdutos;

    if (produtos.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
          Nenhum produto cadastrado.
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        {produtos.map((produto, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{produto.nome}</Typography>
                  <Typography variant="body1" color="primary">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => abrirModalEdicao('produto', produto, index)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => abrirModalExclusao('produto', produto, index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }, [empresa, abrirModalEdicao, abrirModalExclusao]);

  const renderizarServicos = useCallback(() => {
    const servicos = empresa.getServicos;

    if (servicos.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
          Nenhum serviço cadastrado.
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        {servicos.map((servico, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{servico.nome}</Typography>
                  <Typography variant="body1" color="primary">
                    R$ {servico.preco.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => abrirModalEdicao('servico', servico, index)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => abrirModalExclusao('servico', servico, index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }, [empresa, abrirModalEdicao, abrirModalExclusao]);

  const { 
    tabAtiva, 
    modalEdicaoAberto, 
    modalExclusaoAberto, 
    tipoModal,
    nome, 
    nomeSocial, 
    cpf, 
    rg, 
    telefone, 
    genero, 
    preco, 
    mensagem, 
    tipoMensagem 
  } = state;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Listagens
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabAtiva} onChange={handleTabChange}>
          <Tab 
            label="Clientes"
            icon={<PersonIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Produtos"
            icon={<ShoppingCartIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Serviços"
            icon={<ContentCutIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {tabAtiva === 0 && renderizarClientes()}
      {tabAtiva === 1 && renderizarProdutos()}
      {tabAtiva === 2 && renderizarServicos()}

      {/* Modal de Edição */}
      <Dialog open={modalEdicaoAberto} onClose={fecharModais} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar {tipoModal === 'cliente' ? 'Cliente' : tipoModal === 'produto' ? 'Produto' : 'Serviço'}
        </DialogTitle>
        <DialogContent>
          {mensagem && (
            <Alert severity={tipoMensagem} sx={{ mb: 2 }}>
              {mensagem}
            </Alert>
          )}

          {tipoModal === 'cliente' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Nome"
                value={nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                fullWidth
              />
              <TextField
                label="Nome Social"
                value={nomeSocial}
                onChange={(e) => handleInputChange('nomeSocial', e.target.value)}
                fullWidth
              />
              <TextField
                label="CPF"
                value={cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                fullWidth
              />
              <TextField
                label="RG"
                value={rg}
                onChange={(e) => handleInputChange('rg', e.target.value)}
                fullWidth
              />
              <TextField
                label="Telefone"
                value={telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
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
            </Box>
          )}

          {(tipoModal === 'produto' || tipoModal === 'servico') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label={`Nome do ${tipoModal === 'produto' ? 'Produto' : 'Serviço'}`}
                value={nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                fullWidth
              />
              <TextField
                label="Preço"
                value={preco}
                onChange={(e) => handleInputChange('preco', e.target.value)}
                fullWidth
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModais}>
            Cancelar
          </Button>
          <Button onClick={salvarEdicao} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={modalExclusaoAberto} onClose={fecharModais}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este {tipoModal}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModais}>
            Cancelar
          </Button>
          <Button onClick={confirmarExclusao} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
