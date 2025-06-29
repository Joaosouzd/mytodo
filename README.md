# MyTodo - Sistema de Gerenciamento de Tarefas

Um sistema simples de gerenciamento de tarefas desenvolvido em Node.js com scripts para criar usuários, listas e tarefas.

## 📋 Funcionalidades

- Criar usuários
- Criar listas de tarefas
- Criar tarefas
- Excluir tarefas
- Listar usuários
- Selecionar listas de usuários

## 🚀 Como usar

### Pré-requisitos

- Node.js instalado
- NPM ou Yarn

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd Mytodo
```

2. Instale as dependências:
```bash
npm install
```

### Scripts disponíveis

- `node Scripts/criarUsuario.js` - Criar um novo usuário
- `node Scripts/criarLista.js` - Criar uma nova lista de tarefas
- `node Scripts/criarTarefa.js` - Criar uma nova tarefa
- `node Scripts/excluirTarefa.js` - Excluir uma tarefa
- `node Scripts/listarUsuarios.js` - Listar todos os usuários
- `node Scripts/selecionarListaUsuario.js` - Selecionar listas de um usuário
- `node Scripts/mytodo.js` - Menu principal do sistema

## 📁 Estrutura do projeto

```
Mytodo/
├── Scripts/
│   ├── criarLista.js
│   ├── criarTarefa.js
│   ├── criarUsuario.js
│   ├── excluirTarefa.js
│   ├── listarUsuarios.js
│   ├── mytodo.js
│   └── selecionarListaUsuario.js
├── db.js
├── package.json
└── README.md
```

## 🤝 Contribuição

Sinta-se à vontade para contribuir com o projeto através de pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. 