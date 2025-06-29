// Variáveis globais
let currentUser = null;
let currentList = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupEventListeners();
});

// Configuração dos event listeners
function setupEventListeners() {
    // Form de criar usuário
    document.getElementById('create-user-form').addEventListener('submit', handleCreateUser);
    
    // Form de criar lista
    document.getElementById('create-list-form').addEventListener('submit', handleCreateList);
    
    // Form de criar tarefa
    document.getElementById('create-task-form').addEventListener('submit', handleCreateTask);
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// ===== FUNÇÕES DE USUÁRIOS =====

// Carregar usuários
async function loadUsers() {
    try {
        const response = await fetch('/api/usuarios');
        const usuarios = await response.json();
        displayUsers(usuarios);
    } catch (error) {
        showNotification('Erro ao carregar usuários', 'error');
    }
}

// Exibir usuários na sidebar
function displayUsers(usuarios) {
    const container = document.getElementById('usuarios-list');
    container.innerHTML = '';
    
    if (usuarios.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Nenhum usuário encontrado</p>';
        return;
    }
    
    usuarios.forEach(usuario => {
        const userItem = document.createElement('div');
        userItem.className = 'list-item';
        userItem.onclick = () => selectUser(usuario);
        
        userItem.innerHTML = `
            <div class="list-item-info">
                <h4>${usuario.nome}</h4>
                <p>${usuario.email}</p>
            </div>
        `;
        
        container.appendChild(userItem);
    });
}

// Selecionar usuário
async function selectUser(usuario) {
    currentUser = usuario;
    currentList = null;
    
    // Atualizar UI
    document.querySelectorAll('.list-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.list-item').classList.add('active');
    
    // Mostrar seção de listas
    document.getElementById('listas-section').style.display = 'block';
    
    // Carregar listas do usuário
    await loadUserLists(usuario.id);
    
    // Mostrar tela de boas-vindas
    showWelcomeScreen();
}

// ===== FUNÇÕES DE LISTAS =====

// Carregar listas do usuário
async function loadUserLists(userId) {
    try {
        const response = await fetch(`/api/listas/${userId}`);
        const listas = await response.json();
        displayLists(listas);
    } catch (error) {
        showNotification('Erro ao carregar listas', 'error');
    }
}

// Exibir listas na sidebar
function displayLists(listas) {
    const container = document.getElementById('listas-list');
    container.innerHTML = '';
    
    if (listas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Nenhuma lista encontrada</p>';
        return;
    }
    
    listas.forEach(lista => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.onclick = () => selectList(lista);
        
        listItem.innerHTML = `
            <div class="list-item-info">
                <h4>${lista.nome}</h4>
                <p>Lista de tarefas</p>
            </div>
        `;
        
        container.appendChild(listItem);
    });
}

// Selecionar lista
async function selectList(lista) {
    currentList = lista;
    
    // Atualizar UI
    document.querySelectorAll('#listas-list .list-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.list-item').classList.add('active');
    
    // Atualizar título da lista
    document.getElementById('lista-titulo').textContent = lista.nome;
    
    // Carregar tarefas da lista
    await loadTasks(lista.id);
    
    // Mostrar área de tarefas
    showTasksArea();
}

// ===== FUNÇÕES DE TAREFAS =====

// Carregar tarefas da lista
async function loadTasks(listaId) {
    try {
        const response = await fetch(`/api/tarefas/${listaId}`);
        const tarefas = await response.json();
        displayTasks(tarefas);
    } catch (error) {
        showNotification('Erro ao carregar tarefas', 'error');
    }
}

// Exibir tarefas na área principal
function displayTasks(tarefas) {
    const container = document.getElementById('tarefas-list');
    container.innerHTML = '';
    
    if (tarefas.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>Nenhuma tarefa encontrada</h3>
                <p>Clique em "Nova Tarefa" para começar!</p>
            </div>
        `;
        return;
    }
    
    tarefas.forEach(tarefa => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${tarefa.concluida ? 'completed' : ''}`;
        
        taskCard.innerHTML = `
            <div class="task-header">
                <div class="task-title">${tarefa.titulo}</div>
                <div class="task-actions">
                    <button class="btn-complete" onclick="toggleTaskComplete(${tarefa.id})" title="${tarefa.concluida ? 'Desmarcar como concluída' : 'Marcar como concluída'}">
                        <i class="fas ${tarefa.concluida ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteTask(${tarefa.id})" title="Excluir tarefa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${tarefa.descricao ? `<div class="task-description">${tarefa.descricao}</div>` : ''}
            <div class="task-meta">
                <span>Criada em: ${new Date(tarefa.criada_em).toLocaleDateString('pt-BR')}</span>
                <span>${tarefa.concluida ? 'Concluída' : 'Pendente'}</span>
            </div>
        `;
        
        container.appendChild(taskCard);
    });
}

// ===== FUNÇÕES DE CRIAÇÃO =====

// Criar usuário
async function handleCreateUser(event) {
    event.preventDefault();
    
    const nome = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    
    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email })
        });
        
        if (response.ok) {
            const novoUsuario = await response.json();
            showNotification('Usuário criado com sucesso!', 'success');
            closeModal('create-user-modal');
            document.getElementById('create-user-form').reset();
            loadUsers();
        } else {
            throw new Error('Erro ao criar usuário');
        }
    } catch (error) {
        showNotification('Erro ao criar usuário', 'error');
    }
}

// Criar lista
async function handleCreateList(event) {
    event.preventDefault();
    
    const nome = document.getElementById('list-name').value;
    
    try {
        const response = await fetch('/api/listas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, usuario_id: currentUser.id })
        });
        
        if (response.ok) {
            const novaLista = await response.json();
            showNotification('Lista criada com sucesso!', 'success');
            closeModal('create-list-modal');
            document.getElementById('create-list-form').reset();
            loadUserLists(currentUser.id);
        } else {
            throw new Error('Erro ao criar lista');
        }
    } catch (error) {
        showNotification('Erro ao criar lista', 'error');
    }
}

// Criar tarefa
async function handleCreateTask(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('task-title').value;
    const descricao = document.getElementById('task-description').value;
    
    try {
        const response = await fetch('/api/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titulo, descricao, lista_id: currentList.id })
        });
        
        if (response.ok) {
            const novaTarefa = await response.json();
            showNotification('Tarefa criada com sucesso!', 'success');
            closeModal('create-task-modal');
            document.getElementById('create-task-form').reset();
            loadTasks(currentList.id);
        } else {
            throw new Error('Erro ao criar tarefa');
        }
    } catch (error) {
        showNotification('Erro ao criar tarefa', 'error');
    }
}

// ===== FUNÇÕES DE AÇÃO =====

// Alternar status de conclusão da tarefa
async function toggleTaskComplete(taskId) {
    try {
        const response = await fetch(`/api/tarefas/${taskId}/concluir`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            const tarefaAtualizada = await response.json();
            showNotification(
                tarefaAtualizada.concluida ? 'Tarefa marcada como concluída!' : 'Tarefa desmarcada!',
                'success'
            );
            loadTasks(currentList.id);
        } else {
            throw new Error('Erro ao atualizar tarefa');
        }
    } catch (error) {
        showNotification('Erro ao atualizar tarefa', 'error');
    }
}

// Excluir tarefa
async function deleteTask(taskId) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/tarefas/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Tarefa excluída com sucesso!', 'success');
            loadTasks(currentList.id);
        } else {
            throw new Error('Erro ao excluir tarefa');
        }
    } catch (error) {
        showNotification('Erro ao excluir tarefa', 'error');
    }
}

// ===== FUNÇÕES DE UI =====

// Mostrar modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Fechar modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Mostrar tela de boas-vindas
function showWelcomeScreen() {
    document.getElementById('welcome-screen').style.display = 'flex';
    document.getElementById('tarefas-area').style.display = 'none';
}

// Mostrar área de tarefas
function showTasksArea() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('tarefas-area').style.display = 'block';
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        padding: 1rem;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== FUNÇÕES DE MODAL =====

// Mostrar modal de criar usuário
function showCreateUserModal() {
    showModal('create-user-modal');
}

// Mostrar modal de criar lista
function showCreateListModal() {
    if (!currentUser) {
        showNotification('Selecione um usuário primeiro!', 'error');
        return;
    }
    showModal('create-list-modal');
}

// Mostrar modal de criar tarefa
function showCreateTaskModal() {
    if (!currentList) {
        showNotification('Selecione uma lista primeiro!', 'error');
        return;
    }
    showModal('create-task-modal');
} 