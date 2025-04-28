const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si todos los campos están presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Por favor, complete todos los campos' });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear el nuevo usuario
    const user = await User.create({
      nombre,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        message: 'Usuario registrado correctamente',
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el email y la contraseña están presentes
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, ingrese email y contraseña' });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email }).select('+password');
    
    // Verificar si el usuario existe y la contraseña es correcta
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
    // @desc    Verificar token de autenticación
    // @route   GET /api/auth/verify-token
    // @access  Private
    exports.verifyToken = async (req, res) => {
        try {
        // El middleware protect ya verificó el token, solo confirmamos al cliente
        res.status(200).json({ 
            valid: true,
            message: 'Token válido'
        });
        } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(500).json({ message: 'Error del servidor' });
        }
    };
};