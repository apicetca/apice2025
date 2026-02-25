const { body, validationResult } = require('express-validator');
const { validationSets: empresaValidationSets } = require('./empresa-validations');
const commonValidations = {
  nome: body('nome')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres')
    .isLength({ max: 100 })
    .withMessage('Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),

  email: body('email')
    .trim()
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Digite um email válido')
    .normalizeEmail(),

  telefone: body('telefone')
    .trim()
    .notEmpty()
    .withMessage('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Digite um telefone válido no formato (XX) XXXXX-XXXX'),

  password: body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .isLength({ max: 128 })
    .withMessage('Senha muito longa'),

  confirmPassword: body('confirmPassword')
    .notEmpty()
    .withMessage('Confirmação de senha é obrigatória')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Senhas não coincidem');
      }
      return true;
    }),

  rg: body('rg')
    .trim()
    .notEmpty()
    .withMessage('RG é obrigatório')
    .isLength({ min: 7, max: 12 })
    .withMessage('RG deve ter entre 7 e 12 caracteres'),

  data: body('data')
    .notEmpty()
    .withMessage('Data de nascimento é obrigatória')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Digite uma data válida')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 14 || age > 120) {
        throw new Error('Idade deve ser no mínimo de 14 anos');
      }
      return true;
    }),

  sexo: body('sexo')
    .notEmpty()
    .withMessage('Sexo é obrigatório')
    .isIn(['masculino', 'feminino', 'outro'])
    .withMessage('Selecione uma opção válida'),

  estado: body('estado')
    .notEmpty()
    .withMessage('Estado civil é obrigatório')
    .isIn(['solteiro', 'casado', 'divorciado', 'viuvo'])
    .withMessage('Selecione uma opção válida'),

  endereco: body('endereco')
    .trim()
    .notEmpty()
    .withMessage('Endereço é obrigatório')
    .isLength({ min: 5, max: 200 })
    .withMessage('Endereço deve ter entre 5 e 200 caracteres'),

  cep: body('cep')
    .trim()
    .notEmpty()
    .withMessage('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/)
    .withMessage('CEP deve estar no formato XXXXX-XXX'),

  complemento: body('complemento')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Complemento deve ter no máximo 100 caracteres')
};

const empresaValidations = {
  razao_social: body('razao_social')
    .trim()
    .notEmpty()
    .withMessage('Razão social é obrigatória')
    .isLength({ min: 2, max: 200 })
    .withMessage('Razão social deve ter entre 2 e 200 caracteres'),

  nome_fantasia: body('nome_fantasia')
    .trim()
    .notEmpty()
    .withMessage('Nome fantasia é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome fantasia deve ter entre 2 e 100 caracteres'),

  cnpj: body('cnpj')
    .trim()
    .notEmpty()
    .withMessage('CNPJ é obrigatório')
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX')
    .custom((value) => {
      const cnpj = value.replace(/\D/g, '');
      
      if (cnpj.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }
      
      if (/^(\d)\1+$/.test(cnpj)) {
        throw new Error('CNPJ inválido');
      }
      
      let sum = 0;
      let weight = 5;
      
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj[i]) * weight;
        weight = weight === 2 ? 9 : weight - 1;
      }
      
      let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (digit1 !== parseInt(cnpj[12])) {
        throw new Error('CNPJ inválido');
      }
      
      sum = 0;
      weight = 6;
      
      for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj[i]) * weight;
        weight = weight === 2 ? 9 : weight - 1;
      }
      
      let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (digit2 !== parseInt(cnpj[13])) {
        throw new Error('CNPJ inválido');
      }
      
      return true;
    }),

  logradouro: body('logradouro')
    .trim()
    .notEmpty()
    .withMessage('Logradouro é obrigatório')
    .isLength({ min: 5, max: 200 })
    .withMessage('Logradouro deve ter entre 5 e 200 caracteres'),

  cidade: body('cidade')
    .trim()
    .notEmpty()
    .withMessage('Cidade é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Cidade deve conter apenas letras e espaços'),

  estado_empresa: body('estado')
    .notEmpty()
    .withMessage('Estado é obrigatório')
    .isIn(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'])
    .withMessage('Selecione um estado válido')
};

const loginValidations = {
  loginJovem: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Digite um email válido')
      .normalizeEmail()
      .isLength({ max: 254 })
      .withMessage('Email muito longo'),
    
    body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória')
      .isLength({ min: 1, max: 128 })
      .withMessage('Senha inválida')
  ],

  loginEmpresa: [
    body('credencial')
      .trim()
      .notEmpty()
      .withMessage('Credencial é obrigatória')
      .isLength({ min: 3, max: 50 })
      .withMessage('Credencial deve ter entre 3 e 50 caracteres')
      .matches(/^[a-zA-Z0-9@._-]+$/)
      .withMessage('Credencial contém caracteres inválidos'),
    
    body('chave')
      .notEmpty()
      .withMessage('Chave é obrigatória')
      .isLength({ min: 1, max: 128 })
      .withMessage('Chave inválida')
  ]
};

const validationSets = {
  cadastroJovem: [
    commonValidations.nome,
    commonValidations.email,
    commonValidations.telefone,
    commonValidations.password,
    commonValidations.confirmPassword
  ],

  cadastroJovem2: [
    commonValidations.rg,
    commonValidations.data,
    commonValidations.sexo,
    commonValidations.estado,
    commonValidations.endereco,
    commonValidations.cep,
    commonValidations.complemento
  ],

  cadastroEmpresa: empresaValidationSets.cadastroEmpresaEtapa1,

  cadastroEmpresaRepresentante: empresaValidationSets.cadastroEmpresaRepresentante,

  loginJovem: loginValidations.loginJovem,

  loginEmpresa: loginValidations.loginEmpresa
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    req.formData = req.body;
    req.validationErrors = errors.array();
    
    console.log('Erros de validação:', errors.array());
  }
  
  next();
};

const renderWithErrors = (req, res, viewName, additionalData = {}) => {
  if (req.validationErrors) {
    return res.render(viewName, {
      errors: req.validationErrors,
      form: req.formData,
      listaErros: req.validationErrors,
      ...additionalData
    });
  }
  
  return null;
};

module.exports = {
  validationSets,
  commonValidations,
  empresaValidations,
  loginValidations,
  handleValidationErrors,
  renderWithErrors
};