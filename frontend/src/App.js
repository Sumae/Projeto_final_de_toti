import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- URL base da sua API (Node.js/Express com MySQL) ---
const API_BASE_URL = 'http://localhost:3001/api';

// --- Cores para o gráfico de pizza (constante global para reutilização) ---
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF00FF'];

// --- Opções de Tipos de Ajuda (usado para renderizar as checkboxes) ---
// Estas opções devem ser consistenttes com o que seu backend MySQL espera na tabela HelpTypes
const HELP_OPTIONS = [
  "Cesta básica",
  "Acompanhamento psicológico",
  "Treinamento profissionalizante",
  "Suporte educacional"
];

// --- Componente de Cabeçalho (Header) ---
// Adicionadas props para onNavigate e onLogout
function Header({ onNavigate, isLoggedIn, onLogout }) {
  return (
    <header className="w-full bg-blue-800 text-white p-4 relative z-10 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        {/* Logo e Título do Projeto */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2 sm:mb-0">
          {/* Espaço para o logo - você pode substituir este div por uma tag <img> */}
          <div className="bg-white text-blue-800 font-bold p-2 rounded-lg text-lg">
            <img src="https://th.bing.com/th/id/OIP.lg0rYieuA-xEjBwqo099jQHaHa?o=7rm=3&rs=1&pid=ImgDetMain" alt="Logo" className="h-10 w-10 rounded-md" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Gerenciar Beneficiários - Think Human Foundation</h1>
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
        <ul className="flex flex-col sm:flex-row justify-around items-center text-lg space-y-2 sm:space-y-0">
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
              <span>Lista dos Beneficiários</span>
            </button>
          </li>
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
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
          <a href="#" className="hover:text-blue-200 transition-colors duration-200">Política de Privacidade</a>
          <a href="#" className="hover:text-blue-200 transition-colors duration-200">Termos de Serviço</a>
          <a href="#" className="hover:text-blue-200 transition-colors duration-200">FAQ</a>
        </div>
      </div>
    </footer>
  );
}


// --- Componente da Tela de Login ---
function LoginScreen({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await onLogin(email, password);
    if (!success) {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Lado esquerdo: 70% da tela com a imagem de fundo */}
      <div
        className="relative flex-grow-[7] bg-cover bg-center bg-no-repeat hidden md:flex items-center justify-center p-4"
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
              <label htmlFor="email" className="sr-only">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="E-mail (admin@example.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Senha (0000)"
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const result = await onRegister(email, password, name, age);
    if (result.success) {
      setSuccess(result.message);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setAge('');
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
          <label htmlFor="registerEmail" className="sr-only">E-mail</label>
          <input
            id="registerEmail"
            name="email"
            type="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="registerName" className="sr-only">Nome</label>
          <input
            id="registerName"
            name="name"
            type="text"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Seu Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="registerAge" className="sr-only">Idade</label>
          <input
            id="registerAge"
            name="age"
            type="number"
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Sua Idade"
            value={age}
            onChange={(e) => setAge(e.target.value)}
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
          <span className="text-blue-600">Sobre a Fundação</span> - Think Human Foundation
        </h1>
        {/* O botão "Sair" foi removido daqui para evitar duplicação, já existe no Header */}
      </div>
      <div className="text-gray-700 leading-relaxed text-base md:text-lg">
        <p className="mb-4">
          A fundação, criada pela Concentrix (anteriormente chamada Think Human Fund), é voltada a apoiar projetos de educação de qualidade e resiliência climática em diversos países.
        </p>
        <p className="mb-4">
          Para mais informações, você pode visitar os seguintes sites: {' '}
          <a href="https://excellenceruralites.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">excellenceruralites.org</a>, {' '}
          <a href="https://thinkhumanfund.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">thinkhumanfund.org</a>.
        </p>
      </div>
    </div>
  );
}


// --- Componente da Tela do Dashboard ---
function DashboardScreen({ beneficiaries = [], onNavigate, onLogout }) {
  // Garante que beneficiaries é um array antes de usar .reduce()
  const currentBeneficiarios = beneficiaries || [];

  // Processa dados para o gráfico de Tipo de Ajuda (agora pode ser um array)
  const helpTypeData = currentBeneficiarios.reduce((acc, beneficiary) => {
    // Garante que tipoDeAjuda seja um array e itera sobre ele
    const types = Array.isArray(beneficiary.tipoDeAjuda) ? beneficiary.tipoDeAjuda : [beneficiary.tipoDeAjuda || 'Não Especificado'];
    
    types.forEach(type => {
      const existing = acc.find(item => item.name === type);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: type, value: 1 });
      }
    });
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
                <Tooltip />
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


// --- Componente de Gerenciamento de Beneficiários (Formulário e Lista) ---
function BeneficiaryManagementScreen({
  beneficiarios,
  formData,
  editingId,
  handleChange,
  handleSubmit,
  handleEdit,
  confirmDelete,
  resetForm,
  // onNavigate, // Não é mais necessário aqui
  initialView = "form", // 'form' ou 'list'
  // onLogout, // Não é mais necessário aqui
  setFormData
}) {
  // A lógica de abas (currentTab) foi movida para o componente pai (App)
  // Este componente agora apenas renderiza o formulário OU a lista, com base em initialView.

  // Função para lidar com a mudança no campo checkbox de múltiplas seleções
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentTypes = Array.isArray(prev.tipoDeAjuda) ? prev.tipoDeAjuda : [];
      if (checked) {
        return { ...prev, tipoDeAjuda: [...currentTypes, value] };
      } else {
        return { ...prev, tipoDeAjuda: currentTypes.filter(type => type !== value) };
      }
    });
  };

  return (
    <div className="max-w-6xl w-full bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-8">
      {/* Título da tela - removido o botão Sair duplicado */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left mb-6">
        Gerenciamento de Beneficiários
      </h1>

      {/* Remoção das abas internas "Formulário" e "Lista" */}
      {/* O componente agora renderiza o formulário ou a lista diretamente com base em 'initialView' */}

      {initialView === 'form' && ( // Renderiza o formulário se initialView for 'form'
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {editingId ? 'Editar Beneficiário' : 'Cadastrar Novo Beneficiário'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Ajuda Necessária</label>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2"> {/* Usando grid para organizar checkboxes */}
                {HELP_OPTIONS.map(option => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`help-${option.replace(/\s+/g, '-')}`} // Garante ID único e válido
                      name="tipoDeAjuda"
                      value={option}
                      // Verifica se a opção está no array tipoDeAjuda do formData
                      checked={formData.tipoDeAjuda.includes(option)}
                      onChange={handleCheckboxChange} // Novo handler para checkboxes
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`help-${option.replace(/\s+/g, '-')}`} className="ml-2 text-sm text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="situacaoSocial" className="block text-sm font-medium text-gray-700">Situação Social</label>
              <select
                id="situacaoSocial"
                name="situacaoSocial"
                value={formData.situacaoSocial}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              >
                <option value="">Selecione uma situação</option>
                <option value="Vulnerabilidade Extrema">Vulnerabilidade Extrema</option>
                <option value="Vulnerabilidade Média">Vulnerabilidade Média</option>
                <option value="Pobreza">Pobreza</option>
                <option value="Pobreza Extrema">Pobreza Extrema</option>
                <option value="Renda Baixa">Renda Baixa</option>
                <option value="Outra">Outra</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                >
                  Cancelar Edição
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                {editingId ? 'Salvar Alterações' : 'Cadastrar Beneficiário'}
              </button>
            </div>
          </form>
        </div>
      )}

      {initialView === 'list' && ( // Renderiza a lista se initialView for 'list'
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lista de Beneficiários</h2>
          {beneficiarios.length === 0 ? (
            <p className="text-center text-gray-600 py-10">Nenhum beneficiário cadastrado ainda.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Ajuda</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Social</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beneficiarios.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.idade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.telefone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Array.isArray(b.tipoDeAjuda) ? b.tipoDeAjuda.join(', ') : b.tipoDeAjuda}
                      </td> {/* Exibe múltiplos tipos separados por vírgula */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.situacaoSocial}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(b)}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md border border-blue-600 hover:border-blue-900 transition-colors duration-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => confirmDelete(b.id)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md border border-red-600 hover:border-red-900 transition-colors duration-200"
                          >
                            Excluir
                          </button>
                        </div>
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


// --- Componente principal da aplicação ---
export default function App() {
  // Estados para gerenciamento de navegação e autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  // Estados para gerenciamento de beneficiários e formulário
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    email: '',
    telefone: '',
    tipoDeAjuda: [], // Sempre um array para checkboxes
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
  }, [isLoggedIn, currentPage]);

  // Função para lidar com o login
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
        return true;
      } else {
        const errorData = await response.json();
        console.error("Erro no login:", errorData.message);
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  // Função para lidar com o registro de um novo usuário administrador
  const handleRegister = async (email, password, name, age) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, age }),
      });

      if (response.ok) {
        return { success: true, message: 'Conta criada com sucesso!' };
      } else {
        const errorData = await response.json();
        console.error("Erro no registro:", errorData.message);
        return { success: false, message: errorData.message || 'Erro ao criar conta. Tente novamente.' };
      }
    } catch (error) {
      console.error("Erro DETALHADO ao registrar usuário:", error);
      return { success: false, message: 'Erro ao criar conta. Verifique sua conexão ou tente novamente.' };
      }
    }
  ;

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
      setBeneficiarios(data.map(b => ({
        ...b,
        // Garante que tipoDeAjuda seja sempre um array, para lidar com dados legados ou consistência
        tipoDeAjuda: Array.isArray(b.tipoDeAjuda) ? b.tipoDeAjuda : (b.tipoDeAjuda ? [b.tipoDeAjuda] : [])
      })));
    } catch (error) {
      console.error("Erro ao buscar beneficiários:", error);
      setBeneficiarios([]);
    }
  };

  // Lida com a mudança nos campos de input (exceto checkboxes)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Lida com o envio do formulário (cadastro ou edição)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação para tipoDeAjuda (agora que é um array de checkboxes)
    if (formData.tipoDeAjuda.length === 0) {
      alert("Por favor, selecione pelo menos um Tipo de Ajuda Necessária.");
      return;
    }

    if (editingId) {
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
        await fetchBeneficiarios();
        resetForm();
        setCurrentPage('listBeneficiaries');
      } catch (error) {
        console.error("Erro ao atualizar beneficiário:", error);
        alert("Erro ao atualizar beneficiário. Verifique o console para mais detalhes.");
      }
    } else {
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
        await fetchBeneficiarios();
        resetForm();
        setCurrentPage('listBeneficiaries');
      } catch (error) {
        console.error("Erro ao cadastrar beneficiário:", error);
        alert("Erro ao cadastrar beneficiário. Verifique o console para mais detalhes.");
      }
    }
  };

  // Preenche o formulário com os dados do beneficiário para edição
  const handleEdit = (beneficiary) => {
    // Garante que tipoDeAjuda seja um array ao carregar para o formulário
    const formattedBeneficiary = {
      ...beneficiary,
      tipoDeAjuda: Array.isArray(beneficiary.tipoDeAjuda) ? beneficiary.tipoDeAjuda : (beneficiary.tipoDeAjuda ? [beneficiary.tipoDeAjuda] : [])
    };
    setFormData(formattedBeneficiary);
    setEditingId(beneficiary.id);
    setCurrentPage('addBeneficiary');
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
      await fetchBeneficiarios();
      setShowConfirmModal(false);
      setBeneficiaryToDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir beneficiário:", error);
      alert("Erro ao excluir beneficiário. Verifique o console para mais detalhes.");
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
      tipoDeAjuda: [], // Reinicia como array vazio
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
              initialView="form" // Garante que a aba de formulário seja mostrada
              setFormData={setFormData}
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
              initialView="list" // Garante que a aba de lista seja mostrada
              setFormData={setFormData}
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
