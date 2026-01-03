import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CRM Backend API'
  });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'CRM Backend API is running!',
    version: '1.0.0'
  });
});

export default router;