import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- URL base da sua API (JSON Server) ---
const API_BASE_URL = 'http://localhost:3001';

// --- Cores para o gráfico de pizza (constante global para reutilização) ---
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF00FF'];

// --- Componente de Cabeçalho (Header) ---
// Adicionadas props para onNavigate e onLogout
function Header({ onNavigate, isLoggedIn, onLogout }) {
  return (
    <header className="w-full bg-blue-800 text-white p-4 relative z-10 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Logo e Título do Projeto */}
        <div className="flex items-center space-x-4">
          {/* Espaço para o logo - você pode substituir este div por uma tag <img> */}
          <div className="bg-white text-blue-800 font-bold p-2 rounded-lg text-lg">
            <img src="https://th.bing.com/th/id/OIP.lg0rYieuA-xEjBwqo099jQHaHa?o=7rm=3&rs=1&pid=ImgDetMain" alt="Logo" className="h-10 w-10 rounded-md" />
          </div>
          <h1 className="text-2xl font-bold">Gerenciar Beneficiários - Think Human Foundation</h1>
        </div>

        {/* Botões de Login/Cadastro ou Sair */}
        <div className="flex space-x-2">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-sm transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-sm transition-colors duration-200"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm transition-colors duration-200"
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// --- Componente da Barra de Navegação (Navbar) ---
function Navbar({ onNavigate }) {
  return (
    <nav className="w-full bg-blue-700 text-white shadow-md relative z-0">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ul className="flex justify-around items-center text-lg">
          <li>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-blue-600 rounded-md transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <span>Home</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('aboutFoundation')} // Navega para a nova tela "Sobre Fundação"
              className="flex items-center space-x-2 px-4 py-2 hover:bg-blue-600 rounded-md transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span>Sobre Fundação</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('addBeneficiary')} // Navega para a tela de cadastro (somente formulário)
              className="flex items-center space-x-2 px-4 py-2 hover:bg-blue-600 rounded-md transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 000 2h4a1 1 0 100-2H8z"></path>
              </svg>
              <span>Cadastrar Beneficiário</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('listBeneficiaries')} // Navega para a tela de lista (somente lista)
              className="flex items-center space-x-2 px-4 py-2 hover:bg-blue-600 rounded-md transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd"></path>
              </svg>
              <span>Lista dos beneficiários</span>
            </button>
          </li>
          {/* Item "Contato" removido conforme solicitação */}
          {/* <li>
            <button
              className="flex items-center space-x-2 px-4 py-2 hover:bg-blue-600 rounded-md transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
              <span>Contato</span>
            </button>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}

// --- Componente do Rodapé (Footer) ---
function Footer() {
  return (
    <footer className="w-full bg-blue-800 text-white p-6 mt-8 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Think Human Foundation. Todos os direitos reservados.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-blue-200 transition-colors duration-200">Política de Privacidade</a>
          <a href="#" className="hover:text-blue-200 transition-colors duration-200">Termos de Serviço</a>
          <a href="#" className="hover:text-blue-200 transition-colors duration-200">FAQ</a>
        </div>
        {/* Adicione ícones de redes sociais se desejar, por exemplo com Font Awesome ou SVGs */}
        {/* <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-white hover:text-blue-200"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="text-white hover:text-blue-200"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-white hover:text-blue-200"><i className="fab fa-instagram"></i></a>
        </div> */}
      </div>
    </footer>
  );
}


// --- Componente principal da aplicação ---
function App() {
  // Estados para gerenciamento de navegação e autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Indica se o usuário está logado
  // currentPage pode ser 'login', 'register', 'dashboard', 'aboutFoundation', 'addBeneficiary', 'listBeneficiaries'
  const [currentPage, setCurrentPage] = useState('login'); // Começa na tela de login

  // Estados para gerenciamento de beneficiários e formulário
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    email: '',
    telefone: '',
    tipoDeAjuda: '',
    situacaoSocial: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [beneficiaryToDeleteId, setBeneficiaryToDeleteId] = useState(null);

  // Efeito para carregar os beneficiários ao montar o componente ou quando a página de dados é acessada
  useEffect(() => {
    if (isLoggedIn && (currentPage === 'dashboard' || currentPage === 'listBeneficiaries' || currentPage === 'addBeneficiary')) {
      fetchBeneficiarios();
    }
  }, [isLoggedIn, currentPage]); // Dependências: isLoggedIn e currentPage

  // Função para lidar com o login
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?username=${username}&password=${password}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      if (users.length > 0) {
        setIsLoggedIn(true);
        setCurrentPage('dashboard'); // Redireciona para o dashboard após o login
        return true;
      } else {
        return false; // Credenciais inválidas
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  // Função para lidar com o registro de um novo usuário administrador
  const handleRegister = async (username, password) => {
    try {
      // Primeiro, verifica se o username já existe
      const checkResponse = await fetch(`${API_BASE_URL}/users?username=${username}`);
      if (!checkResponse.ok) {
        console.error("Erro na verificação de usuário existente (status):", checkResponse.status);
        const errorText = await checkResponse.text();
        throw new Error(`Erro ao verificar usuário existente: ${checkResponse.status} - ${errorText}`);
      }
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        return { success: false, message: 'Nome de usuário já existe!' };
      }

      // Se não existir, cadastra o novo usuário
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        console.error("Erro no cadastro do usuário (status):", response.status);
        const errorText = await response.text();
        throw new Error(`Erro ao cadastrar usuário: ${response.status} - ${errorText}`);
      }
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (error) {
      console.error("Erro DETALHADO ao registrar usuário:", error);
      return { success: false, message: 'Erro ao criar conta. Tente novamente.' };
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  // Função para buscar os beneficiários da API
  const fetchBeneficiarios = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/beneficiarios`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBeneficiarios(data);
    } catch (error) {
      console.error("Erro ao buscar beneficiários:", error);
      setBeneficiarios([]); // Garante que beneficiarios seja um array vazio em caso de erro
    }
  };

  // Lida com a mudança nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Lida com o envio do formulário (cadastro ou edição)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Atualizar beneficiário existente
      try {
        const response = await fetch(`${API_BASE_URL}/beneficiarios/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setBeneficiarios(beneficiarios.map(b => (b.id === editingId ? { ...formData, id: editingId } : b)));
        resetForm();
      } catch (error) {
        console.error("Erro ao atualizar beneficiário:", error);
      }
    } else {
      // Cadastrar novo beneficiário
      try {
        const response = await fetch(`${API_BASE_URL}/beneficiarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newBeneficiary = await response.json();
        setBeneficiarios([...beneficiarios, newBeneficiary]);
        resetForm();
      } catch (error) {
        console.error("Erro ao cadastrar beneficiário:", error);
      }
    }
  };

  // Preenche o formulário com os dados do beneficiário para edição
  const handleEdit = (beneficiary) => {
    setFormData(beneficiary);
    setEditingId(beneficiary.id);
    setCurrentPage('addBeneficiary'); // Direciona para a tela de formulário em modo edição
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirmação antes de excluir
  const confirmDelete = (id) => {
    setBeneficiaryToDeleteId(id);
    setShowConfirmModal(true);
  };

  // Lida com a exclusão de um beneficiário
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/beneficiarios/${beneficiaryToDeleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBeneficiarios(beneficiarios.filter(b => b.id !== beneficiaryToDeleteId));
      setShowConfirmModal(false);
      setBeneficiaryToDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir beneficiário:", error);
      setShowConfirmModal(false);
      setBeneficiaryToDeleteId(null);
    }
  };

  // Reseta o formulário e o estado de edição
  const resetForm = () => {
    setFormData({
      nome: '',
      idade: '',
      email: '',
      telefone: '',
      tipoDeAjuda: '',
      situacaoSocial: ''
    });
    setEditingId(null);
  };

  // Renderiza o conteúdo principal da aplicação baseado na página atual
  const renderMainContent = () => {
    if (!isLoggedIn) {
      if (currentPage === 'register') {
        return <RegisterScreen onRegister={handleRegister} onNavigateToLogin={() => setCurrentPage('login')} />;
      } else {
        return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard':
          return <DashboardScreen beneficiaries={beneficiarios} onNavigate={setCurrentPage} onLogout={handleLogout} />;
        case 'aboutFoundation':
          return <AboutFoundationScreen onNavigate={setCurrentPage} onLogout={handleLogout} />;
        case 'addBeneficiary':
          return (
            <BeneficiaryManagementScreen
              beneficiarios={beneficiarios}
              formData={formData}
              editingId={editingId}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleEdit={handleEdit}
              confirmDelete={confirmDelete}
              resetForm={resetForm}
              onNavigate={setCurrentPage}
              initialView="form" // Mostrar apenas o formulário
              onLogout={handleLogout}
            />
          );
        case 'listBeneficiaries':
          return (
            <BeneficiaryManagementScreen
              beneficiarios={beneficiarios}
              formData={formData}
              editingId={editingId}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleEdit={handleEdit}
              confirmDelete={confirmDelete}
              resetForm={resetForm}
              onNavigate={setCurrentPage}
              initialView="list" // Mostrar apenas a lista
              onLogout={handleLogout}
            />
          );
        default:
          return <DashboardScreen beneficiaries={beneficiarios} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-inter">
      {/* O Header e Navbar só serão exibidos se o usuário estiver logado */}
      {isLoggedIn && <Header onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      {isLoggedIn && <Navbar onNavigate={setCurrentPage} />}
      
      {/* O main agora tem um padding menor e é responsável apenas pelo conteúdo abaixo do header/navbar */}
      <main className="flex-grow w-full py-0 px-0 sm:px-0 lg:px-0 flex justify-center items-start">
        {renderMainContent()}
      </main>

      {/* Rodapé visível apenas se o usuário estiver logado */}
      {isLoggedIn && <Footer />}

      {/* Modal de Confirmação de Exclusão - Mantido aqui para ser global */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">Tem certeza que deseja excluir este beneficiário? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition ease-in-out duration-150"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition ease-in-out duration-150"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Componente da Tela de Login ---
function LoginScreen({ onLogin, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    const success = await onLogin(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Lado esquerdo: 70% da tela com a imagem de fundo */}
      <div
        className="relative flex-grow-[7] bg-cover bg-center bg-no-repeat hidden md:flex items-center justify-center p-4"
        // URL da imagem fornecida pelo usuário
        style={{ backgroundImage: `url(https://jumpmath.org/ca/wp-content/uploads/sites/1/2021/04/CKM0551-1200x799.jpg)` }}
      >
        {/* Opcional: Adicione um overlay para melhorar a legibilidade se houver texto */}
        {/* <div className="absolute inset-0 bg-black opacity-30"></div> */}
        {/* Opcional: Adicione um texto ou logo se desejar no lado da imagem */}
        {/* <h1 className="text-white text-5xl font-bold z-10">Bem-vindo!</h1> */}
      </div>

      {/* Lado direito: 30% da tela com o formulário de login */}
      <div className="flex-grow-[3] flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 md:bg-transparent">
        {/* Título adicionado acima do formulário de login */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Gerenciar Beneficiários</h1>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Think Human Foundation</h1>
        <div className="max-w-md w-full bg-white bg-opacity-90 shadow-xl rounded-lg p-8 space-y-6 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Usuário</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuário (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Senha (admin)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Entrar
              </button>
            </div>
          </form>
          <div className="text-center text-sm">
            Não tem uma conta?{' '}
            <button
              onClick={onNavigateToRegister}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Componente da Tela de Registro de Usuário ---
function RegisterScreen({ onRegister, onNavigateToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const result = await onRegister(username, password);
    if (result.success) {
      setSuccess(result.message);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      // Navega de volta para o login após o registro bem-sucedido
      setTimeout(() => onNavigateToLogin(), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Criar Nova Conta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="registerUsername" className="sr-only">Usuário</label>
          <input
            id="registerUsername"
            name="username"
            type="text"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="registerPassword" className="sr-only">Senha</label>
          <input
            id="registerPassword"
            name="password"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">Confirmar Senha</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            Registrar
          </button>
        </div>
      </form>
      <div className="text-center text-sm">
        Já tem uma conta?{' '}
        <button
          onClick={onNavigateToLogin}
          className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
}

// --- Componente da Tela "Sobre Fundação" ---
function AboutFoundationScreen({ onNavigate, onLogout }) {
  return (
    <div className="max-w-6xl w-full bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="text-blue-600">Sobre a Fundação</span> - Think Human Foundation
        </h1>
        <button
            onClick={onLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
          >
            Sair
        </button>
      </div>
      <div className="text-gray-700 leading-relaxed text-lg">
        <p className="mb-4">
          A fundação, criada pela Concentrix (anteriormente chamada Think Human Fund), é voltada a apoiar projetos de educação de qualidade e resiliência climática em diversos países.
        </p>
        <p className="mb-4">
          Para mais informações, você pode visitar os seguintes sites: {' '}
          <a href="https://excellenceruralites.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">excellenceruralites.org</a>, {' '}
          <a href="https://thinkhumanfund.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">thinkhumanfund.org</a>.
        </p>
        <p>
          Um exemplo claro de parceria que encontramos é com a organização francesa Excellence Ruralités, voltada ao combate à evasão escolar em áreas rurais da França — com apoio financeiro por três anos visando abertura de novas turmas e fortalecimento de escolas.
        </p>
      </div>
    </div>
  );
}


// --- Componente da Tela do Dashboard ---
function DashboardScreen({ beneficiaries = [], onNavigate, onLogout }) {
  // Garante que beneficiaries é um array antes de usar .reduce()
  const currentBeneficiarios = beneficiaries || [];

  // Processa dados para o gráfico de Tipo de Ajuda
  const helpTypeData = currentBeneficiarios.reduce((acc, beneficiary) => {
    const type = beneficiary.tipoDeAjuda || 'Não Especificado';
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  // Processa dados para o gráfico de Situação Social
  const socialSituationData = currentBeneficiarios.reduce((acc, beneficiary) => {
    const situation = beneficiary.situacaoSocial || 'Não Especificado';
    const existing = acc.find(item => item.name === situation);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: situation, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-6xl w-full bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-8">
      {/* Contador de Beneficiários */}
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-8 flex items-center justify-center space-x-2">
        <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
        <span className="font-semibold text-lg">Total de Beneficiários:</span>
        <span className="text-2xl font-bold">{currentBeneficiarios.length}</span> {/* Usando currentBeneficiarios */}
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Gráfico de Barras - Tipos de Ajuda */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Beneficiários por Tipo de Ajuda</h3>
          {helpTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={helpTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} wrapperStyle={{ outline: 'none' }} />
                <Legend iconType="square" />
                <Bar dataKey="value" name="Beneficiários" fill="#8884d8" barSize={30} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">Nenhum dado para o gráfico de Tipos de Ajuda.</p>
          )}
        </div>

        {/* Gráfico de Pizza - Situação Social */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Beneficiários por Situação Social</h3>
          {socialSituationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={socialSituationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {socialSituationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperStyle={{ outline: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">Nenhum dado para o gráfico de Situação Social.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Componente da Tela de Gerenciamento de Beneficiários (Formulário e Lista) ---
// Adicionada prop initialView para controlar qual parte é exibida
function BeneficiaryManagementScreen({
  beneficiarios,
  formData,
  editingId,
  handleChange,
  handleSubmit,
  handleEdit,
  confirmDelete,
  resetForm,
  onNavigate,
  initialView = 'list', // 'form' ou 'list'. Padrão: 'list'
  onLogout
}) {
  const currentBeneficiarios = beneficiarios || [];
  const [currentSubView, setCurrentSubView] = useState(initialView); // Estado local para alternar entre form/list

  // Efeito para sincronizar initialView com currentSubView quando a prop muda
  useEffect(() => {
    setCurrentSubView(initialView);
  }, [initialView]);

  return (
    <div className="max-w-6xl w-full bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-8">
      {/* Cabeçalho de Ações e Navegação Interna */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="text-blue-600">Gerenciar Beneficiários</span> - Think Human Foundation
        </h1>
        <div className="flex space-x-4">
          {/* Botões para alternar entre formulário e lista */}
          <button
            onClick={() => setCurrentSubView('form')}
            className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${currentSubView === 'form' ? 'bg-indigo-600' : 'bg-gray-500'} hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
          >
            Cadastrar Novo
          </button>
          <button
            onClick={() => setCurrentSubView('list')}
            className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${currentSubView === 'list' ? 'bg-indigo-600' : 'bg-gray-500'} hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
          >
            Ver Lista
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Renderiza o formulário OU a lista baseado no estado local */}
      {currentSubView === 'form' ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
            {editingId ? 'Editar Beneficiário' : 'Cadastrar Novo Beneficiário'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: Maria da Silva"
              />
            </div>
            <div>
              <label htmlFor="idade" className="block text-sm font-medium text-gray-700">Idade</label>
              <input
                type="number"
                id="idade"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: 35"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: maria@example.com"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: (DD) 9XXXX-XXXX"
              />
            </div>
            <div>
              <label htmlFor="tipoDeAjuda" className="block text-sm font-medium text-gray-700">Tipo de Ajuda</label>
              <select
                id="tipoDeAjuda"
                name="tipoDeAjuda"
                value={formData.tipoDeAjuda}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione o tipo de ajuda</option>
                <option value="Cesta básica">Cesta básica</option>
                <option value="Acompanhamento psicológico">Acompanhamento psicológico</option>
                <option value="Treinamento profissionalizante">Treinamento profissionalizante</option>
                <option value="Apoio jurídico">Apoio jurídico</option>
                <option value="Suporte educacional">Suporte educacional</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label htmlFor="situacaoSocial" className="block text-sm font-medium text-gray-700">Situação Social</label>
              <select
                id="situacaoSocial"
                name="situacaoSocial"
                value={formData.situacaoSocial}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione a situação social</option>
                <option value="Vulnerabilidade alta">Vulnerabilidade alta</option>
                <option value="Vulnerabilidade média">Vulnerabilidade média</option>
                <option value="Vulnerabilidade baixa">Vulnerabilidade baixa</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-center space-x-4 mt-4">
              <button
                type="submit"
                className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150 transform hover:-translate-y-0.5"
              >
                {editingId ? (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z"></path>
                    </svg>
                    Atualizar Beneficiário
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    Cadastrar Beneficiário
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150 transform hover:-translate-y-0.5"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        // Se currentSubView é 'list', mostra a lista de beneficiários
        <div className="border border-gray-200 rounded-lg p-6 bg-white mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Lista de Beneficiários</h2>
          {currentBeneficiarios.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum beneficiário cadastrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Ajuda</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Social</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBeneficiarios.map((beneficiary) => (
                    <tr key={beneficiary.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{beneficiary.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiary.idade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiary.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiary.telefone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiary.tipoDeAjuda}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiary.situacaoSocial}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(beneficiary)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z"></path>
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => confirmDelete(beneficiary.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd"></path>
                          </svg>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
