# E-commerce Admin Interface

Este é um projeto de interface administrativa para um e-commerce, desenvolvido em React, que permite o gerenciamento completo de produtos, categorias e visualização de vendas.

## 🚀 Tecnologias Utilizadas

- **React** (v18.2.0) - Framework principal
- **Chakra UI** (v2.8.2) - Sistema de design para interface moderna e responsiva
- **React Router DOM** (v6.22.0) - Gerenciamento de rotas
- **Axios** (v1.6.7) - Cliente HTTP para comunicação com a API
- **React Icons** (v5.5.0) - Biblioteca de ícones
- **Framer Motion** (v11.0.3) - Animações suaves

## 📋 Funcionalidades

### 1. Gerenciamento de Produtos

- Listagem em tabela com imagens e detalhes
- Criação, edição e exclusão de produtos
- Upload de imagens via URL
- Integração com categorias
- Controle de estoque e preços

### 2. Gerenciamento de Categorias

- Lista organizada de categorias
- Criação, edição e exclusão de categorias
- Interface simples e intuitiva
- Badges visuais para melhor identificação

### 3. Visualização de Vendas

- Histórico detalhado de vendas
- Detalhes expandíveis por venda
- Informações de cliente, data e produtos
- Cálculo automático de totais
- Opção de exclusão de registros

## 🎨 Estilização

O projeto utiliza o Chakra UI como sistema de design principal, oferecendo:

- Design responsivo e moderno
- Tema claro/escuro
- Componentes pré-estilizados e customizáveis
- Sistema de grid flexível
- Animações e transições suaves

## 🔌 Conexão com Backend

A comunicação com o backend é gerenciada através do arquivo `api.js`, utilizando Axios:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend-completo.vercel.app",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

### Endpoints Principais:

#### Produtos

- GET `/app/produtos/:usuario` - Lista produtos
- POST `/app/produtos` - Cria produto
- PUT `/app/produtos` - Atualiza produto
- DELETE `/app/produtos` - Remove produto

#### Categorias

- GET `/app/categorias` - Lista categorias
- POST `/app/categorias` - Cria categoria
- PUT `/app/categorias` - Atualiza categoria
- DELETE `/app/categorias` - Remove categoria

#### Vendas

- GET `/app/venda` - Lista vendas
- DELETE `/app/venda` - Remove venda

## 🔒 Autenticação

O sistema utiliza autenticação via token JWT:

- Token armazenado no localStorage
- Enviado automaticamente em todas as requisições
- Rotas protegidas no frontend
- Redirecionamento automático para login quando necessário

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto:

```bash
npm start
```

4. Acesse `http://localhost:3000`

## ⚙️ Estrutura do Projeto

```
src/
  ├── components/      # Componentes React
  ├── services/        # Configuração de serviços (API)
  ├── assets/          # Recursos estáticos
  └── App.js          # Componente principal e rotas
```
