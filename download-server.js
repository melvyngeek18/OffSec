const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from download-page directory
app.use(express.static(path.join(__dirname, '../download-page')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    app: 'OffSec Download Page',
    version: '1.0.0'
  });
});

// API endpoint to get app info
app.get('/api/app-info', (req, res) => {
  res.json({
    name: 'OffSec - Officier Sécurité',
    version: '1.0.0',
    package: 'com.offsec.app',
    platform: 'Android',
    minVersion: 'Android 6.0+',
    size: '~50 MB',
    permissions: ['GPS', 'Internet'],
    features: [
      'Géolocalisation GPS automatique',
      'Suivi des interventions opérationnelles',
      '12 actions principales à valider',
      '53 mesures opérationnelles',
      '28 points de zones à risques',
      'Calcul automatique du score SSO',
      'Préconisations selon le niveau',
      'Synthèse complète de l\'intervention'
    ]
  });
});

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../download-page/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚒 OffSec Download Server`);
  console.log(`📱 Page de téléchargement disponible sur:`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → http://0.0.0.0:${PORT}`);
  console.log(`\n✅ Serveur démarré avec succès!`);
  console.log(`\n📋 Endpoints disponibles:`);
  console.log(`   → GET /          - Page de téléchargement`);
  console.log(`   → GET /health    - Health check`);
  console.log(`   → GET /api/app-info - Informations de l'app`);
});

module.exports = app;
