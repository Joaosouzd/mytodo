# MyTodo - Sistema de Gerenciamento de Tarefas

Um sistema completo de gerenciamento de tarefas desenvolvido em Node.js com interface web moderna e responsiva.

## 🚀 Funcionalidades

### Frontend Web
- ✅ Interface web moderna e responsiva
- ✅ Criação e gerenciamento de usuários
- ✅ Criação e gerenciamento de listas de tarefas
- ✅ Criação, edição e exclusão de tarefas
- ✅ Marcação de tarefas como concluídas
- ✅ Design responsivo para mobile e desktop
- ✅ Notificações em tempo real
- ✅ Modais interativos

### Backend (Scripts CLI)
- ✅ Criar usuários via linha de comando
- ✅ Criar listas de tarefas
- ✅ Criar tarefas
- ✅ Excluir tarefas
- ✅ Listar usuários
- ✅ Selecionar listas de usuários

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Estilização**: CSS Grid, Flexbox, Gradientes
- **Ícones**: Font Awesome
- **Fontes**: Google Fonts (Inter)

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- NPM ou Yarn

## 🚀 Como usar

### 1. Configuração do Banco de Dados

Certifique-se de que seu banco PostgreSQL está configurado e crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/Joaosouzd/mytodo.git
cd mytodo

# Instale as dependências
npm install
```

### 3. Executando a Aplicação

#### Opção 1: Interface Web (Recomendado)
```bash
# Iniciar o servidor
npm start

# Ou para desenvolvimento com auto-reload
npm run dev
```

Acesse: http://localhost:3000

#### Opção 2: Scripts CLI
```bash
# Menu principal
node Scripts/mytodo.js

# Criar usuário
node Scripts/criarUsuario.js

# Criar lista
node Scripts/criarLista.js

# Criar tarefa
node Scripts/criarTarefa.js

# Listar usuários
node Scripts/listarUsuarios.js

# Excluir tarefa
node Scripts/excluirTarefa.js
```

## 📱 Interface Web

### Funcionalidades da Interface

1. **Gerenciamento de Usuários**
   - Criar novos usuários
   - Visualizar lista de usuários
   - Selecionar usuário ativo

2. **Gerenciamento de Listas**
   - Criar listas de tarefas
   - Visualizar listas do usuário selecionado
   - Selecionar lista ativa

3. **Gerenciamento de Tarefas**
   - Criar novas tarefas
   - Marcar tarefas como concluídas
   - Excluir tarefas
   - Visualizar detalhes das tarefas

### Características da Interface

- 🎨 **Design Moderno**: Interface limpa e intuitiva
- 📱 **Responsiva**: Funciona perfeitamente em mobile e desktop
- ⚡ **Performance**: Carregamento rápido e interações fluidas
- 🔔 **Notificações**: Feedback visual para todas as ações
- 🎯 **UX Otimizada**: Fluxo de trabalho intuitivo

## 📁 Estrutura do Projeto

```
Mytodo/
├── public/                 # Frontend web
│   ├── index.html         # Página principal
│   ├── styles.css         # Estilos CSS
│   └── script.js          # JavaScript do frontend
├── Scripts/               # Scripts CLI
│   ├── criarLista.js
│   ├── criarTarefa.js
│   ├── criarUsuario.js
│   ├── excluirTarefa.js
│   ├── listarUsuarios.js
│   ├── mytodo.js
│   └── selecionarListaUsuario.js
├── server.js              # Servidor Express
├── db.js                  # Configuração do banco
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Usuários
- `GET /api/usuarios` - Listar todos os usuários
- `POST /api/usuarios` - Criar novo usuário

### Listas
- `GET /api/listas/:usuarioId` - Listar listas de um usuário
- `POST /api/listas` - Criar nova lista

### Tarefas
- `GET /api/tarefas/:listaId` - Listar tarefas de uma lista
- `POST /api/tarefas` - Criar nova tarefa
- `PUT /api/tarefas/:id/concluir` - Alternar status de conclusão
- `DELETE /api/tarefas/:id` - Excluir tarefa

## 🎨 Screenshots

### Desktop
- Interface principal com sidebar e área de tarefas
- Modais para criação de usuários, listas e tarefas
- Cards de tarefas com ações

### Mobile
- Layout responsivo adaptado para telas menores
- Navegação otimizada para touch

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**João Souza**
- GitHub: [@Joaosouzd](https://github.com/Joaosouzd)

## 🙏 Agradecimentos

- Font Awesome pelos ícones
- Google Fonts pela fonte Inter
- Comunidade Node.js e Express.js 