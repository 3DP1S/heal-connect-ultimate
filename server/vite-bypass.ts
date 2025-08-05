
// HEAL CONNECT: Permanent fix to prevent Vite connection issues
import express from 'express';
import path from 'path';

export function configureStaticServing(app: express.Application): void {
  console.log('🔧 HEAL CONNECT: Permanently disabling Vite middleware mode');
  
  // Serve static assets directly
  app.use('/assets', express.static(path.join(__dirname, '../client/src/assets')));
  app.use('/public', express.static(path.join(__dirname, '../public')));
  
  // Override any Vite middleware setup
  app.use('*', (req, res, next) => {
    if (req.originalUrl.includes('@vite') || req.originalUrl.includes('/@fs/')) {
      res.status(404).send('Vite middleware disabled for stability');
      return;
    }
    next();
  });
}

export const VITE_DISABLED = true;
