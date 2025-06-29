const readline = require('readline');
const { spawn } = require('child_process');

const opcoes = [
  { titulo: 'Criar novo usuário', script: 'criarUsuario.js' },
  { titulo: 'Criar nova lista de tarefas', script: 'criarLista.js' },
  { titulo: 'Adicionar tarefa a uma lista', script: 'criarTarefa.js' },
  { titulo: 'Exibir todas as listas do usuário', script: 'selecionarListaUsuario.js' },
  { titulo: 'Excluir tarefa', script: 'excluirTarefa.js' },
  { titulo: 'Listar e gerenciar usuários', script: 'listarUsuarios.js' } 
];

function mostrarMenu() {
  console.clear();
  console.log('\n===Mytodo HUB====:\n');
  opcoes.forEach((op, index) => {
    console.log(`${index + 1}. ${op.titulo}`);
  });
  console.log('0. Sair\n');
}

function executarScript(script) {
  return new Promise((resolve, reject) => {
    const processo = spawn('node', [script], { stdio: 'inherit' });

    processo.on('exit', (code) => resolve(code));
    processo.on('error', (err) => reject(err));
  });
}

function perguntar(texto) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(texto, (resposta) => {
      rl.close();
      resolve(resposta.trim());
    });
  });
}

async function main() {
  while (true) {
    mostrarMenu();

    const escolhaStr = await perguntar('Digite o número da opção desejada: ');
    const escolha = parseInt(escolhaStr, 10);

    if (isNaN(escolha) || escolha < 0 || escolha > opcoes.length) {
      console.log('Opção inválida.\n');
      await perguntar('Pressione Enter para continuar...');
      continue;
    }

    if (escolha === 0) {
      console.log('\nSaindo do MyToDo...\n');
      break;
    }

    const opcao = opcoes[escolha - 1];
    console.log(`\nExecutando: ${opcao.titulo}\n`);

    try {
      await executarScript(opcao.script);
    } catch (err) {
      console.error('Erro ao executar o script:', err.message);
    }

    await perguntar('\nPressione Enter para voltar ao menu...');
  }
}

main();
