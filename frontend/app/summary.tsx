import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';
import PhotoCapture from '../components/PhotoCapture';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

// Liste des risques
const RISKS = [
  { id: 'risk1', text: 'Zone de propagation du feu' },
  { id: 'risk2', text: 'Zone d\'effondrement potentiel' },
  { id: 'risk3', text: 'Zone de chute d\'objets' },
  { id: 'risk4', text: 'Zone ATEX (atmosphère explosive)' },
  { id: 'risk5', text: 'Zone de présence de matières dangereuses' },
  { id: 'risk6', text: 'Zone électrique haute tension' },
  { id: 'risk7', text: 'Zone de circulation dangereuse' },
  { id: 'risk8', text: 'Zone d\'accès restreint' },
  { id: 'risk9', text: 'Zone de travail en hauteur' },
  { id: 'risk10', text: 'Zone inondable ou présence d\'eau' },
  { id: 'risk11', text: 'Zone de rayonnement' },
  { id: 'risk12', text: 'Zone de bruit excessif' },
];

// Liste des actions
const ACTIONS = [
  { id: 'action1', text: 'Présentation au COS' },
  { id: 'action2', text: 'Prise en compte de la mission' },
  { id: 'action3', text: 'Information chefs de secteurs' },
  { id: 'action4', text: 'Contact chef secteur soutien/SSO' },
  { id: 'action5', text: 'Reconnaissance cubique' },
  { id: 'action6', text: 'Mesures conservatoires si danger' },
  { id: 'action7', text: 'Analyse des risques' },
  { id: 'action8', text: 'Compte-rendu au COS' },
  { id: 'action9', text: 'Transmission à officier RENS' },
  { id: 'action10', text: 'Mesures d\'hygiène et prévention' },
  { id: 'action11', text: 'Réévaluation périodique' },
  { id: 'action12', text: 'Retour d\'expérience' },
];

// Liste des opérations par catégorie
const OPERATIONS = [
  { id: 'op1', category: 'Binômes', text: 'Présence d\'un contrôleur' },
  { id: 'op2', category: 'Binômes', text: 'Présence d\'un binôme de sécurité' },
  { id: 'op3', category: 'Binômes', text: 'Retrait des bips et téléphones si milieu explosif' },
  { id: 'op4', category: 'Binômes', text: 'Matériels ATEX' },
  { id: 'op5', category: 'Binômes', text: 'Présence d\'un sas et d\'un contrôleur' },
  { id: 'op6', category: 'Phénomènes thermiques', text: 'Repérage risque d\'Explosion de Fumées' },
  { id: 'op7', category: 'Phénomènes thermiques', text: 'Repérage risque d\'Embrasement Généralisé Éclair' },
  { id: 'op8', category: 'Circulations', text: 'Vérification des trous' },
  { id: 'op9', category: 'Circulations', text: 'Vérification du vide' },
  { id: 'op10', category: 'Circulations', text: 'Vérification des gravats' },
  { id: 'op11', category: 'Circulations', text: 'Éclairage adéquat' },
  { id: 'op12', category: 'Circulations', text: 'Ventilation' },
  { id: 'op35', category: 'Hauteur', text: 'Utilisation du LSPCC' },
  { id: 'op36', category: 'Hauteur', text: 'Détection des lignes HT' },
  { id: 'op40', category: 'Moteurs', text: 'Mise à la terre des groupes électrogènes' },
  { id: 'op52', category: 'Radio', text: 'Liaisons VPC/terrain fonctionnelles' },
];

export default function Summary() {
  const router = useRouter();
  const { data, updateActions, resetIntervention, saveIntervention } = useIntervention();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const remainingActions = ACTIONS.filter(action => !data.actions[action.id]);
  const completedActions = ACTIONS.filter(action => data.actions[action.id]);
  
  // Risques identifiés
  const identifiedRisks = RISKS.filter(risk => data.risks[risk.id]);
  
  // Opérations validées
  const validatedOperations = OPERATIONS.filter(op => data.operations[op.id]);

  const handleReset = () => {
    Alert.alert(
      'Confirmer la réinitialisation',
      'Êtes-vous sûr de vouloir commencer une nouvelle intervention ? Toutes les données actuelles seront perdues.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            resetIntervention();
            router.replace('/');
          },
        },
      ]
    );
  };

  const toggleAction = async (actionId: string) => {
    updateActions(actionId, !data.actions[actionId]);
    await saveIntervention();
  };

  const getBase64FromUri = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Erreur conversion image:', error);
      return '';
    }
  };

  const generatePdfHtml = async (): Promise<string> => {
    const currentDate = new Date().toLocaleString('fr-FR');
    
    // Récupérer les photos par type
    const arrivalPhotos = data.photos.filter(p => p.type === 'arrival');
    const progressPhotos = data.photos.filter(p => p.type === 'progress');
    const endPhotos = data.photos.filter(p => p.type === 'end');

    // Générer le HTML des photos
    let photosArrivalHtml = '';
    let photosProgressHtml = '';
    let photosEndHtml = '';
    
    // Photos à l'arrivée
    if (arrivalPhotos.length > 0) {
      photosArrivalHtml = '<div class="section"><h3>📸 PHOTOS À L\'ARRIVÉE SUR LES LIEUX</h3><div class="photos-grid">';
      for (const photo of arrivalPhotos) {
        try {
          const base64 = await getBase64FromUri(photo.uri);
          if (base64) {
            photosArrivalHtml += `<div class="photo-item"><img src="${base64}" /><p class="photo-date">${photo.timestamp}</p></div>`;
          }
        } catch (e) {
          console.log('Photo non accessible');
        }
      }
      photosArrivalHtml += '</div></div>';
    }

    // Photos en cours d'action
    if (progressPhotos.length > 0) {
      photosProgressHtml = '<div class="section"><h3>📸 PHOTOS PENDANT L\'INTERVENTION</h3><div class="photos-grid">';
      for (const photo of progressPhotos) {
        try {
          const base64 = await getBase64FromUri(photo.uri);
          if (base64) {
            photosProgressHtml += `<div class="photo-item"><img src="${base64}" /><p class="photo-date">${photo.timestamp}</p></div>`;
          }
        } catch (e) {
          console.log('Photo non accessible');
        }
      }
      photosProgressHtml += '</div></div>';
    }

    // Photos de fin
    if (endPhotos.length > 0) {
      photosEndHtml = '<div class="section"><h3>📸 PHOTOS APRÈS L\'INTERVENTION</h3><div class="photos-grid">';
      for (const photo of endPhotos) {
        try {
          const base64 = await getBase64FromUri(photo.uri);
          if (base64) {
            photosEndHtml += `<div class="photo-item"><img src="${base64}" /><p class="photo-date">${photo.timestamp}</p></div>`;
          }
        } catch (e) {
          console.log('Photo non accessible');
        }
      }
      photosEndHtml += '</div></div>';
    }

    // HTML des risques identifiés
    let risksHtml = '';
    if (identifiedRisks.length > 0) {
      risksHtml = identifiedRisks.map(r => `<li class="risk-item">⚠️ ${r.text}</li>`).join('');
    } else {
      risksHtml = '<li class="no-item">Aucun risque particulier identifié</li>';
    }

    // HTML des actions complétées
    let actionsCompletedHtml = '';
    if (completedActions.length > 0) {
      actionsCompletedHtml = completedActions.map(a => `<li class="completed-item">✅ ${a.text}</li>`).join('');
    }

    // HTML des actions restantes
    let actionsRemainingHtml = '';
    if (remainingActions.length > 0) {
      actionsRemainingHtml = remainingActions.map(a => `<li class="remaining-item">❌ ${a.text}</li>`).join('');
    }

    // HTML des opérations validées par catégorie
    let operationsHtml = '';
    if (validatedOperations.length > 0) {
      const categories = [...new Set(validatedOperations.map(op => op.category))];
      categories.forEach(cat => {
        const ops = validatedOperations.filter(op => op.category === cat);
        operationsHtml += `<div class="ops-category"><strong>${cat}:</strong><ul>`;
        ops.forEach(op => {
          operationsHtml += `<li>✅ ${op.text}</li>`;
        });
        operationsHtml += '</ul></div>';
      });
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px; 
          color: #333;
          line-height: 1.5;
        }
        .header { 
          text-align: center; 
          background: linear-gradient(135deg, #262135 0%, #3a3450 100%); 
          color: white; 
          padding: 30px 20px; 
          margin-bottom: 25px; 
          border-radius: 12px;
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .header .subtitle { 
          margin: 10px 0 0 0; 
          font-size: 14px;
          opacity: 0.9;
        }
        .header .date {
          margin: 5px 0 0 0;
          font-size: 12px;
          opacity: 0.7;
        }
        .section { 
          background: #f8f9fa; 
          padding: 20px; 
          margin-bottom: 20px; 
          border-radius: 10px;
          border-left: 4px solid #5a4fcf;
          page-break-inside: avoid;
        }
        .section h3 { 
          margin: 0 0 15px 0; 
          color: #262135; 
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .info-item {
          background: white;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }
        .info-label { 
          font-size: 11px;
          color: #666; 
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .info-value { 
          font-size: 14px;
          font-weight: bold;
          color: #262135;
        }
        .info-full {
          grid-column: 1 / -1;
        }
        .weather-box {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .weather-item {
          text-align: center;
        }
        .weather-value {
          font-size: 32px;
          font-weight: bold;
        }
        .weather-label {
          font-size: 12px;
          opacity: 0.9;
        }
        .risks-section {
          background: #fff3cd;
          border-left-color: #ffc107;
        }
        .risks-section h3 {
          color: #856404;
        }
        .risk-item {
          background: #fff;
          padding: 8px 12px;
          margin: 5px 0;
          border-radius: 6px;
          border-left: 3px solid #dc3545;
          list-style: none;
        }
        .actions-section-completed {
          background: #d4edda;
          border-left-color: #28a745;
        }
        .actions-section-completed h3 {
          color: #155724;
        }
        .completed-item {
          background: #fff;
          padding: 8px 12px;
          margin: 5px 0;
          border-radius: 6px;
          border-left: 3px solid #28a745;
          list-style: none;
        }
        .actions-section-remaining {
          background: #f8d7da;
          border-left-color: #dc3545;
        }
        .actions-section-remaining h3 {
          color: #721c24;
        }
        .remaining-item {
          background: #fff;
          padding: 8px 12px;
          margin: 5px 0;
          border-radius: 6px;
          border-left: 3px solid #dc3545;
          list-style: none;
        }
        .no-item {
          color: #666;
          font-style: italic;
          list-style: none;
        }
        .ops-category {
          margin-bottom: 15px;
        }
        .ops-category strong {
          color: #5a4fcf;
          display: block;
          margin-bottom: 5px;
        }
        .ops-category ul {
          margin: 0;
          padding-left: 20px;
        }
        .ops-category li {
          margin: 3px 0;
        }
        .photos-grid { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 15px;
          justify-content: flex-start;
        }
        .photo-item { 
          width: 180px;
          background: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .photo-item img { 
          width: 100%; 
          height: 135px; 
          object-fit: cover; 
          border-radius: 6px;
        }
        .photo-date { 
          font-size: 10px; 
          color: #666; 
          text-align: center; 
          margin: 8px 0 0 0;
        }
        .sso-box {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .sso-box h3 {
          margin: 0 0 15px 0;
          color: white;
        }
        .sso-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .sso-item {
          background: rgba(255,255,255,0.2);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .sso-value {
          font-size: 24px;
          font-weight: bold;
        }
        .sso-label {
          font-size: 11px;
          opacity: 0.9;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        .stat-box {
          background: #5a4fcf;
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value {
          font-size: 28px;
          font-weight: bold;
        }
        .stat-label {
          font-size: 10px;
          opacity: 0.9;
          text-transform: uppercase;
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 2px solid #e0e0e0; 
          color: #666; 
          font-size: 11px;
        }
        .footer p {
          margin: 5px 0;
        }
        ul {
          margin: 0;
          padding-left: 0;
        }
        @media print {
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <!-- EN-TÊTE -->
      <div class="header">
        <h1>🛡️ RAPPORT D'INTERVENTION</h1>
        <p class="subtitle">Officier Sécurité - Document de Synthèse</p>
        <p class="date">Généré le ${currentDate}</p>
      </div>

      <!-- COORDONNÉES DE L'INTERVENTION -->
      <div class="section">
        <h3>📍 COORDONNÉES DE L'INTERVENTION</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Officier</div>
            <div class="info-value">${data.nom || 'Non renseigné'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Matricule</div>
            <div class="info-value">${data.matricule || 'Non renseigné'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">N° Intervention</div>
            <div class="info-value">${data.numeroIntervention || 'Non renseigné'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Coordonnées GPS</div>
            <div class="info-value">${data.latitude && data.longitude ? `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}` : 'Non disponibles'}</div>
          </div>
          <div class="info-item info-full">
            <div class="info-label">Adresse du lieu d'intervention</div>
            <div class="info-value">${data.adresse || 'Non renseignée'}</div>
          </div>
        </div>
      </div>

      <!-- MÉTÉO SUR PLACE -->
      ${data.weatherData && (data.weatherData.temperature !== null || data.weatherData.windSpeed !== null) ? `
      <div class="weather-box">
        <div class="weather-item">
          <div class="weather-value">🌡️ ${data.weatherData.temperature !== null ? Math.round(data.weatherData.temperature) + '°C' : 'N/A'}</div>
          <div class="weather-label">Température</div>
        </div>
        <div class="weather-item">
          <div class="weather-value">💨 ${data.weatherData.windSpeed !== null ? Math.round(data.weatherData.windSpeed) + ' km/h' : 'N/A'}</div>
          <div class="weather-label">Vitesse du vent</div>
        </div>
        <div class="weather-item">
          <div class="weather-value">☁️</div>
          <div class="weather-label">${data.weatherData.description || 'Conditions météo'}</div>
        </div>
      </div>
      ` : `
      <div class="section">
        <h3>🌤️ MÉTÉO SUR PLACE</h3>
        <p style="color: #666; font-style: italic;">Données météo non disponibles</p>
      </div>
      `}

      <!-- SSO - SOUTIEN SANITAIRE OPÉRATIONNEL -->
      ${data.ssoScore > 0 ? `
      <div class="sso-box">
        <h3>🏋️ SOUTIEN SANITAIRE OPÉRATIONNEL (SSO)</h3>
        <div class="sso-grid">
          <div class="sso-item">
            <div class="sso-value">${data.ssoScore}</div>
            <div class="sso-label">Score total</div>
          </div>
          <div class="sso-item">
            <div class="sso-value">${data.ssoLevel || 'N/A'}</div>
            <div class="sso-label">Niveau</div>
          </div>
          <div class="sso-item">
            <div class="sso-value" style="font-size: 14px;">${data.ssoRecommendation || 'N/A'}</div>
            <div class="sso-label">Moyens recommandés</div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- STATISTIQUES GLOBALES -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">${completedActions.length}/${ACTIONS.length}</div>
          <div class="stat-label">Actions</div>
        </div>
        <div class="stat-box" style="background: #dc3545;">
          <div class="stat-value">${identifiedRisks.length}</div>
          <div class="stat-label">Risques</div>
        </div>
        <div class="stat-box" style="background: #28a745;">
          <div class="stat-value">${validatedOperations.length}</div>
          <div class="stat-label">Mesures</div>
        </div>
        <div class="stat-box" style="background: #17a2b8;">
          <div class="stat-value">${data.photos.length}</div>
          <div class="stat-label">Photos</div>
        </div>
      </div>

      <!-- RISQUES PRÉSENTS -->
      <div class="section risks-section">
        <h3>⚠️ RISQUES IDENTIFIÉS SUR LE SITE</h3>
        <ul>${risksHtml}</ul>
      </div>

      <!-- ACTIONS ENTREPRISES -->
      ${completedActions.length > 0 ? `
      <div class="section actions-section-completed">
        <h3>✅ ACTIONS ENTREPRISES (${completedActions.length})</h3>
        <ul>${actionsCompletedHtml}</ul>
      </div>
      ` : ''}

      <!-- ACTIONS RESTANTES -->
      ${remainingActions.length > 0 ? `
      <div class="section actions-section-remaining">
        <h3>❌ ACTIONS RESTANTES (${remainingActions.length})</h3>
        <ul>${actionsRemainingHtml}</ul>
      </div>
      ` : ''}

      <!-- MESURES OPÉRATIONNELLES VALIDÉES -->
      ${validatedOperations.length > 0 ? `
      <div class="section">
        <h3>📋 MESURES OPÉRATIONNELLES VALIDÉES</h3>
        ${operationsHtml}
      </div>
      ` : ''}

      <!-- PHOTOS AVANT -->
      ${photosArrivalHtml}

      <!-- PHOTOS PENDANT -->
      ${photosProgressHtml}

      <!-- PHOTOS APRÈS -->
      ${photosEndHtml}

      <!-- PIED DE PAGE -->
      <div class="footer">
        <p><strong>Document généré automatiquement par l'application OffSec</strong></p>
        <p>Officier Sécurité - Rapport d'intervention n°${data.numeroIntervention || 'N/A'}</p>
        <p>${currentDate}</p>
      </div>
    </body>
    </html>
    `;
  };

  const generatePdf = async () => {
    setGeneratingPdf(true);
    try {
      const html = await generatePdfHtml();
      
      // 1. D'abord afficher l'aperçu pour validation
      Alert.alert(
        '📄 Aperçu du Rapport',
        'Voulez-vous visualiser l\'aperçu du rapport avant de l\'enregistrer ?',
        [
          {
            text: 'Voir l\'aperçu',
            onPress: async () => {
              // Afficher l'aperçu d'impression
              await Print.printAsync({ html });
            },
          },
          {
            text: 'Enregistrer directement',
            onPress: async () => {
              await savePdfToHistory(html);
            },
          },
          { text: 'Annuler', style: 'cancel' },
        ]
      );
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      Alert.alert('Erreur', 'Impossible de générer le PDF. Veuillez réessayer.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const savePdfToHistory = async (html: string) => {
    try {
      // 1. Créer le dossier "historique OffSec" s'il n'existe pas
      const historyDir = `${FileSystem.documentDirectory}historique_OffSec/`;
      
      const dirInfo = await FileSystem.getInfoAsync(historyDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(historyDir, { intermediates: true });
        console.log('Dossier historique créé:', historyDir);
      }
      
      // 2. Générer le fichier PDF
      const { uri: tempUri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      
      // 3. Créer un nom de fichier avec la date et le numéro d'intervention
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const timeStr = new Date().toTimeString().slice(0, 5).replace(':', 'h');
      const fileName = `Intervention_${data.numeroIntervention || 'NA'}_${dateStr}_${timeStr}.pdf`;
      const finalPath = `${historyDir}${fileName}`;
      
      // 4. Copier le fichier dans le dossier historique
      await FileSystem.copyAsync({
        from: tempUri,
        to: finalPath,
      });
      
      console.log('PDF enregistré:', finalPath);
      
      // 5. Proposer de partager le fichier
      Alert.alert(
        '✅ Rapport Enregistré',
        `Le rapport a été enregistré dans :\n📁 historique OffSec/${fileName}\n\nVoulez-vous le partager ?`,
        [
          {
            text: 'Partager',
            onPress: async () => {
              const isAvailable = await Sharing.isAvailableAsync();
              if (isAvailable) {
                await Sharing.shareAsync(finalPath, {
                  mimeType: 'application/pdf',
                  dialogTitle: 'Partager le rapport',
                  UTI: 'com.adobe.pdf',
                });
              }
            },
          },
          { text: 'Fermer', style: 'cancel' },
        ]
      );
      
      // Supprimer le fichier temporaire
      await FileSystem.deleteAsync(tempUri, { idempotent: true });
      
    } catch (error) {
      console.error('Erreur enregistrement PDF:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer le PDF dans l\'historique.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 Synthèse de l'Intervention</Text>
        </View>

        <PhotoCapture type="end" title="Photos de fin d'action" />

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>👤 Informations Générales</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom:</Text>
            <Text style={styles.infoValue}>{data.nom}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Matricule:</Text>
            <Text style={styles.infoValue}>{data.matricule}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° Intervention:</Text>
            <Text style={styles.infoValue}>{data.numeroIntervention}</Text>
          </View>
          {data.adresse && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adresse:</Text>
              <Text style={styles.infoValue}>{data.adresse}</Text>
            </View>
          )}
          {data.latitude && data.longitude && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>GPS:</Text>
              <Text style={styles.infoValue}>
                {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        {/* Météo */}
        {data.weatherData && data.weatherData.temperature !== null && (
          <View style={styles.weatherCard}>
            <Text style={styles.cardTitle}>🌤️ Météo sur place</Text>
            <View style={styles.weatherRow}>
              <Text style={styles.weatherItem}>🌡️ {Math.round(data.weatherData.temperature)}°C</Text>
              <Text style={styles.weatherItem}>💨 {Math.round(data.weatherData.windSpeed || 0)} km/h</Text>
            </View>
          </View>
        )}

        {data.ssoScore > 0 && (
          <View style={styles.ssoCard}>
            <Text style={styles.cardTitle}>🏋️ SSO - Soutien Sanitaire</Text>
            <View style={styles.ssoRow}>
              <Text style={styles.ssoLabel}>Score:</Text>
              <Text style={styles.ssoValue}>{data.ssoScore} points</Text>
            </View>
            <View style={styles.ssoRow}>
              <Text style={styles.ssoLabel}>Niveau:</Text>
              <Text style={styles.ssoValue}>{data.ssoLevel}</Text>
            </View>
            <View style={styles.ssoRow}>
              <Text style={styles.ssoLabel}>Moyens:</Text>
              <Text style={styles.ssoRecommendation}>{data.ssoRecommendation}</Text>
            </View>
          </View>
        )}

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>📊 Statistiques</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Actions:</Text>
            <Text style={styles.statValue}>{completedActions.length}/{ACTIONS.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Risques identifiés:</Text>
            <Text style={styles.statValue}>{identifiedRisks.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Mesures validées:</Text>
            <Text style={styles.statValue}>{validatedOperations.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Photos prises:</Text>
            <Text style={styles.statValue}>{data.photos.length}</Text>
          </View>
        </View>

        {remainingActions.length > 0 && (
          <View style={styles.remainingCard}>
            <Text style={styles.cardTitle}>⚠️ Actions Restantes ({remainingActions.length})</Text>
            <Text style={styles.helpText}>Appuyez pour marquer comme complétée</Text>
            {remainingActions.map((action, index) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.actionItem}
                onPress={() => toggleAction(action.id)}
              >
                <View style={styles.actionBullet}>
                  <Text style={styles.actionNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.actionText}>{action.text}</Text>
                <Text style={styles.tapIcon}>👆</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {completedActions.length > 0 && (
          <View style={styles.completedCard}>
            <Text style={styles.cardTitle}>✅ Actions Complétées ({completedActions.length})</Text>
            {completedActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.completedItem}
                onPress={() => toggleAction(action.id)}
              >
                <Text style={styles.checkmark}>✅</Text>
                <Text style={styles.completedText}>{action.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {remainingActions.length === 0 && (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              👍 Excellent travail! Toutes les actions ont été complétées.
            </Text>
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.pdfButton}
          onPress={generatePdf}
          disabled={generatingPdf}
        >
          {generatingPdf ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.pdfButtonText}>📄 SYNTHÈSE PDF</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modifyButton}
          onPress={() => router.push('/actions')}
        >
          <Text style={styles.modifyButtonText}>MODIFIER LES ACTIONS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>NOUVELLE INTERVENTION</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#262135' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 200 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  infoCard: { backgroundColor: '#3a3450', borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  infoRow: { flexDirection: 'row', marginBottom: 8 },
  infoLabel: { fontSize: 14, color: '#9ca3af', width: 120 },
  infoValue: { fontSize: 14, color: '#fff', flex: 1 },
  weatherCard: { backgroundColor: '#0ea5e9', borderRadius: 12, padding: 16, marginBottom: 16 },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-around' },
  weatherItem: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  ssoCard: { backgroundColor: '#4ade80', borderRadius: 12, padding: 16, marginBottom: 16 },
  ssoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ssoLabel: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  ssoValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  ssoRecommendation: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', flex: 1 },
  statsCard: { backgroundColor: '#5a4fcf', borderRadius: 12, padding: 16, marginBottom: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { fontSize: 14, color: '#fff' },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  remainingCard: { backgroundColor: '#dc2626', borderRadius: 12, padding: 16, marginBottom: 16 },
  helpText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 12, fontStyle: 'italic' },
  actionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 8 },
  actionBullet: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  actionNumber: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
  actionText: { fontSize: 14, color: '#fff', flex: 1 },
  tapIcon: { fontSize: 16, marginLeft: 8 },
  completedCard: { backgroundColor: '#3a3450', borderRadius: 12, padding: 16, marginBottom: 16 },
  completedItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 8, backgroundColor: 'rgba(74, 222, 128, 0.1)', borderRadius: 8 },
  checkmark: { fontSize: 20, marginRight: 8 },
  completedText: { fontSize: 14, color: '#9ca3af', flex: 1, textDecorationLine: 'line-through' },
  messageCard: { backgroundColor: '#3a3450', borderRadius: 12, padding: 16, marginBottom: 16 },
  messageText: { fontSize: 16, color: '#4ade80', textAlign: 'center', lineHeight: 24 },
  spacer: { height: 100 },
  footer: { padding: 16, paddingBottom: 80, borderTopWidth: 1, borderTopColor: '#4b5563', backgroundColor: '#3a3450' },
  pdfButton: { backgroundColor: '#059669', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  pdfButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modifyButton: { backgroundColor: '#5a4fcf', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  modifyButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  resetButton: { backgroundColor: '#dc2626', padding: 14, borderRadius: 8, alignItems: 'center' },
  resetButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
