import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import apiRoutes from './routes'
import swagger from "./swagger/swagger"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/v1', apiRoutes)
app.use("/api/v1/api-docs", swagger)

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRM Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      test: '/api/v1/test'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
});

export default app;