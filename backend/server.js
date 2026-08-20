const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// ============================================================
// RENDER / PROXY CONFIGURATION
// ============================================================
app.set('trust proxy', 1);

// ============================================================
// DATABASE
// ============================================================
connectDB();

// ============================================================
// SECURITY
// ============================================================
app.use(helmet());

// ============================================================
// CORS
// ============================================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://electro-lab-rose.vercel.app/',
  'https://electro-20jfolk7b-varun-b382.vercel.app/',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (Postman, health checks)
      if (!origin) return callback(null, true);

      // Allow exact matches
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow ANY vercel.app subdomain for your project
      if (origin.endsWith('.vercel.app')) return callback(null, true);

      console.log('❌ CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

// Handle preflight requests
app.options('*', cors());

// ============================================================
// RATE LIMITING
// ============================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,

  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// BODY PARSING
// ============================================================
app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ============================================================
// LOGGING
// ============================================================
app.use(morgan('combined'));

// ============================================================
// ROOT ROUTE
// ============================================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ElectroLab API is running!',
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ElectroLab server is running!',
    timestamp: new Date(),
  });
});

// ============================================================
// API ROUTES
// ============================================================
app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/projects', projectRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/users', userRoutes);

app.use('/api/contacts', contactRoutes);

app.use('/api/analytics', analyticsRoutes);

// ============================================================
// ERROR HANDLERS
// MUST BE LAST
// ============================================================
app.use(notFound);

app.use(errorHandler);

// ============================================================
// SERVER
// ============================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `⚡ ElectroLab server running on port ${PORT} in ${
      process.env.NODE_ENV || 'production'
    } mode`
  );
});