const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes, Op } = require('sequelize'); // Importa Sequelize

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. Configuração do Banco de Dados MySQL com Sequelize ---
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Desabilita logs de SQL no console (defina como true para depurar)
    define: {
      timestamps: true, // Habilita createdAt e updatedAt automaticamente
      underscored: true, // Usa snake_case para nomes de colunas gerados (ex: createdAt -> created_at)
    },
    pool: { // Configurações do pool de conexão
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// --- 2. Definição dos Modelos (Tabelas) com Sequelize ---

// Modelo User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true // Pode ser nulo se não for informado
  }
}, {
  // hooks para hashing de senha antes de criar/atualizar
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) { // Apenas se a senha foi modificada
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Modelo Beneficiario
const Beneficiario = sequelize.define('Beneficiario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(20), // Exemplo de limite de caracteres
    allowNull: true
  },
  situacaoSocial: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Coluna para chave estrangeira que referencia User
  registeredByUserId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Pode ser nulo
    references: {
      model: User, // Referencia o modelo User
      key: 'id',
    }
  }
});

// Modelo HelpType (para tipos de ajuda)
const HelpType = sequelize.define('HelpType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// --- 3. Definição das Associações (Relacionamentos) ---

// Um Beneficiario pertence a um User (quem registrou)
Beneficiario.belongsTo(User, { foreignKey: 'registeredByUserId', as: 'registeredBy' });
User.hasMany(Beneficiario, { foreignKey: 'registeredByUserId', as: 'beneficiaries' });

// Relacionamento muitos-para-muitos entre Beneficiario e HelpType
// Um Beneficiario pode ter muitos HelpTypes
// Um HelpType pode estar associado a muitos Beneficiarios
Beneficiario.belongsToMany(HelpType, {
  through: 'BeneficiarioHelpTypes', // Nome da tabela de junção
  foreignKey: 'beneficiarioId',
  otherKey: 'helpTypeId',
  as: 'helpTypes'
});
HelpType.belongsToMany(Beneficiario, {
  through: 'BeneficiarioHelpTypes',
  foreignKey: 'helpTypeId',
  otherKey: 'beneficiarioId',
  as: 'beneficiarios'
});

// --- 4. Sincronizar Modelos com o Banco de Dados ---
// Isso irá criar as tabelas se elas não existirem.
// Use `force: true` APENAS em desenvolvimento, pois apaga e recria tabelas existentes.
sequelize.sync({ force: false }) // Altere para true se quiser recriar todas as tabelas (cuidado!)
  .then(async () => {
    console.log('Tabelas sincronizadas com o banco de dados MySQL.');

    // --- Inserir tipos de ajuda iniciais (se não existirem) ---
    const initialHelpTypes = [
      { name: "Educação" },
      { name: "Saúde" },
      { name: "Moradia" },
      { name: "Alimentação" },
      { name: "Outro" },
      { name: "Cesta básica" },
      { name: "Acompanhamento psicológico" },
      { name: "Treinamento profissionalizante" },
      { name: "Suporte educacional" }
    ];
    for (const type of initialHelpTypes) {
      // Usar findOrCreate para evitar duplicação em execuções repetidas
      await HelpType.findOrCreate({
        where: { name: type.name },
        defaults: type
      });
    }
    console.log('Tipos de ajuda iniciais garantidos.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar tabelas com o MySQL:', err);
    process.exit(1);
  });

// --- 5. Rotas da API ---

// --- Rotas de Autenticação (Auth) ---
// Rota de Registro
app.post('/api/register', async (req, res) => {
  const { email, password, name, age } = req.body;
  try {
    const newUser = await User.create({ email, password, name, age });
    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: newUser.id });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'E-mail já registrado.' });
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro no servidor ao registrar usuário.' });
  }
});

// Rota de Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    res.json({ message: 'Login bem-sucedido!', userId: user.id });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor ao fazer login.' });
  }
});

// --- Rotas de Beneficiários ---

// GET todos os beneficiários (incluindo os tipos de ajuda associados)
app.get('/api/beneficiarios', async (req, res) => {
  try {
    const beneficiarios = await Beneficiario.findAll({
      include: [{ model: HelpType, as: 'helpTypes', attributes: ['id', 'name'], through: { attributes: [] } }] // Inclui os tipos de ajuda
    });
    // O Sequelize retorna os dados com uma estrutura ligeiramente diferente, precisamos normalizar para o frontend
    const formattedBeneficiarios = beneficiarios.map(b => ({
      id: b.id, // Frontend espera 'id'
      nome: b.nome,
      idade: b.idade,
      email: b.email,
      telefone: b.telefone,
      situacaoSocial: b.situacaoSocial,
      // Mapeia os helpTypes associados de volta para um array de strings
      tipoDeAjuda: b.helpTypes ? b.helpTypes.map(ht => ht.name) : [],
      // Adicionar registeredByUserId se necessário no frontend
    }));
    res.status(200).json(formattedBeneficiarios);
  } catch (error) {
    console.error('Erro ao buscar beneficiários:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar beneficiários.' });
  }
});

// GET beneficiário por ID
app.get('/api/beneficiarios/:id', async (req, res) => {
  try {
    const beneficiario = await Beneficiario.findByPk(req.params.id, {
      include: [{ model: HelpType, as: 'helpTypes', attributes: ['id', 'name'], through: { attributes: [] } }]
    });
    if (!beneficiario) {
      return res.status(404).json({ message: 'Beneficiário não encontrado.' });
    }
    const formattedBeneficiario = {
      id: beneficiario.id,
      nome: beneficiario.nome,
      idade: beneficiario.idade,
      email: beneficiario.email,
      telefone: beneficiario.telefone,
      situacaoSocial: beneficiario.situacaoSocial,
      tipoDeAjuda: beneficiario.helpTypes ? beneficiario.helpTypes.map(ht => ht.name) : [],
    };
    res.status(200).json(formattedBeneficiario);
  } catch (error) {
    console.error('Erro ao buscar beneficiário:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar beneficiário.' });
  }
});

// POST novo beneficiário
app.post('/api/beneficiarios', async (req, res) => {
  const { nome, idade, email, telefone, tipoDeAjuda, situacaoSocial, registeredByUserId } = req.body;
  try {
    const newBeneficiario = await Beneficiario.create({ nome, idade, email, telefone, situacaoSocial, registeredByUserId });

    // Encontra os IDs dos tipos de ajuda pelos nomes recebidos
    if (tipoDeAjuda && tipoDeAjuda.length > 0) {
      const helpTypeInstances = await HelpType.findAll({
        where: { name: { [Op.in]: tipoDeAjuda } }
      });
      await newBeneficiario.setHelpTypes(helpTypeInstances.map(ht => ht.id));
    }

    // Retorna o beneficiário com os tipos de ajuda para o frontend
    const createdBeneficiarioWithHelpTypes = await Beneficiario.findByPk(newBeneficiario.id, {
      include: [{ model: HelpType, as: 'helpTypes', attributes: ['id', 'name'], through: { attributes: [] } }]
    });

    const formattedBeneficiario = {
      id: createdBeneficiarioWithHelpTypes.id,
      nome: createdBeneficiarioWithHelpTypes.nome,
      idade: createdBeneficiarioWithHelpTypes.idade,
      email: createdBeneficiarioWithHelpTypes.email,
      telefone: createdBeneficiarioWithHelpTypes.telefone,
      situacaoSocial: createdBeneficiarioWithHelpTypes.situacaoSocial,
      tipoDeAjuda: createdBeneficiarioWithHelpTypes.helpTypes ? createdBeneficiarioWithHelpTypes.helpTypes.map(ht => ht.name) : [],
    };
    res.status(201).json(formattedBeneficiario);
  } catch (error) {
    console.error('Erro ao cadastrar beneficiário:', error);
    res.status(500).json({ message: 'Erro no servidor ao cadastrar beneficiário.' });
  }
});

// PUT atualizar beneficiário por ID
app.put('/api/beneficiarios/:id', async (req, res) => {
  const { nome, idade, email, telefone, tipoDeAjuda, situacaoSocial, registeredByUserId } = req.body;
  try {
    const beneficiario = await Beneficiario.findByPk(req.params.id);
    if (!beneficiario) {
      return res.status(404).json({ message: 'Beneficiário não encontrado.' });
    }

    await beneficiario.update({ nome, idade, email, telefone, situacaoSocial, registeredByUserId });

    // Atualiza os tipos de ajuda associados
    if (tipoDeAjuda !== undefined) { // Permite desassociar todos se array vazio for enviado
      const helpTypeInstances = await HelpType.findAll({
        where: { name: { [Op.in]: tipoDeAjuda } }
      });
      await beneficiario.setHelpTypes(helpTypeInstances.map(ht => ht.id));
    }

    // Retorna o beneficiário atualizado com os tipos de ajuda
    const updatedBeneficiarioWithHelpTypes = await Beneficiario.findByPk(beneficiario.id, {
      include: [{ model: HelpType, as: 'helpTypes', attributes: ['id', 'name'], through: { attributes: [] } }]
    });

    const formattedBeneficiario = {
      id: updatedBeneficiarioWithHelpTypes.id,
      nome: updatedBeneficiarioWithHelpTypes.nome,
      idade: updatedBeneficiarioWithHelpTypes.idade,
      email: updatedBeneficiarioWithHelpTypes.email,
      telefone: updatedBeneficiarioWithHelpTypes.telefone,
      situacaoSocial: updatedBeneficiarioWithHelpTypes.situacaoSocial,
      tipoDeAjuda: updatedBeneficiarioWithHelpTypes.helpTypes ? updatedBeneficiarioWithHelpTypes.helpTypes.map(ht => ht.name) : [],
    };
    res.status(200).json(formattedBeneficiario);
  } catch (error) {
    console.error('Erro ao atualizar beneficiário:', error);
    res.status(500).json({ message: 'Erro no servidor ao atualizar beneficiário.' });
  }
});

// DELETE beneficiário por ID
app.delete('/api/beneficiarios/:id', async (req, res) => {
  try {
    const beneficiario = await Beneficiario.findByPk(req.params.id);
    if (!beneficiario) {
      return res.status(404).json({ message: 'Beneficiário não encontrado.' });
    }
    await beneficiario.destroy(); // Exclui o beneficiário e suas associações na tabela de junção
    res.status(200).json({ message: 'Beneficiário excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir beneficiário:', error);
    res.status(500).json({ message: 'Erro no servidor ao excluir beneficiário.' });
  }
});

// --- 6. Iniciar o Servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
