# Sistema WB - Atividade Prática III

**Interface Gráfica para o sistema World Beauty (WB) com Hooks**  
Desenvolvido para a Atividade Prática III da disciplina de Programação Orientada a Objetos

---

## Requisitos Atendidos

Este projeto atende **100% das exigências** da Atividade Prática ATVIII:

- Interface gráfica (GUI) moderna e responsiva
- Componentes **React com hooks e funções** (refatorado de classes)
- Navegação entre telas sem backend
- Funcionalidades da Atividade 1 reimplementadas com interface visual:
  - Cadastro, listagem, edição e exclusão de clientes, produtos e serviços (CRUD)
  - Registro de consumo por cliente
  - Relatórios gerenciais com dados simulados
- Design responsivo para desktop e dispositivos móveis

---

## Tecnologias

- **React 19.1.0** com componentes funcionais e hooks
- **TypeScript 5.8.3**
- **Material-UI 7.1.2** 
- **Vite 7.0.0**

---

## Estrutura de Telas

- **Home:** visão geral com indicadores
- **Cadastros:** formulários validados para clientes, produtos e serviços
- **Listagens:** visualização, edição e exclusão de registros
- **Registro de Consumo:** associação de produtos e serviços aos clientes
- **Relatórios:** análise de consumo e perfil de clientes (top 10, por gênero, etc.)

---

## Dados de Teste

O sistema inicia com 30 clientes, 20 produtos, 20 serviços e registros de consumo simulados.  
Para iniciar com dados vazios, edite `Roteador.tsx` conforme instruções no próprio arquivo.

---

## Como Executar

```bash
# 1. Clonar o repositório
git clone https://github.com/mariana-lins/T3.git
cd T3

# 2. Instalar dependências
npm install

# 3. Rodar servidor de desenvolvimento
npm run dev
```

---

## Estrutura do Projeto

```
src/
├── componentes/        # 12 componentes React (funções com hooks)
├── dados/             # Populador de dados de teste
├── modelo/            # Classes de domínio da Atividade I
├── tema/              # Tema Material-UI
└── tipos/             # Definições TypeScript
```

---

Disciplina: Programação Orientada a Objetos  
Prof. Dr. Eng. Gerson Penha  
Aluna: Mariana Lins