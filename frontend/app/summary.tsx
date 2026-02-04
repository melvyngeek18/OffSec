import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';
import PhotoCapture from '../components/PhotoCapture';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function Summary() {
  const router = useRouter();
  const { data, updateActions, resetIntervention, saveIntervention } = useIntervention();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const actionsData = [
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

  const remainingActions = actionsData.filter(action => !data.actions[action.id]);
  const completedActions = actionsData.filter(action => data.actions[action.id]);

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

  // Convertir une image en base64
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

  // Générer le HTML pour le PDF
  const generatePdfHtml = async (): Promise<string> => {
    const currentDate = new Date().toLocaleString('fr-FR');
    
    // Préparer les photos en base64
    const arrivalPhotos = data.photos.filter(p => p.type === 'arrival');
    const progressPhotos = data.photos.filter(p => p.type === 'progress');
    const endPhotos = data.photos.filter(p => p.type === 'end');

    let photosHtml = '';
    
    // Photos à l'arrivée
    if (arrivalPhotos.length > 0) {
      photosHtml += '<div class="section"><h3>📸 Photos à l\'arrivée</h3><div class="photos-grid">';
      for (const photo of arrivalPhotos) {
        try {
          const base64 = await getBase64FromUri(photo.uri);
          if (base64) {
            photosHtml += `<div class="photo-item"><img src="${base64}" /><p>${photo.timestamp}</p></div>`;
          }
        } catch (e) {
          console.log('Photo non accessible');
        }
      }
      photosHtml += '</div></div>';
    }

    // Photos en cours d'action
    if (progressPhotos.length > 0) {
      photosHtml += '<div class="section"><h3>📸 Photos en cours d\'action</h3><div class="photos-grid">';
      for (const photo of progressPhotos) {
        try {
          const base64 = await getBase64FromUri(photo.uri);
          if (base64) {
            photosHtml += `<div class="photo-item"><img src="${base64}" /><p>${photo.timestamp}</p></div>`;
          }
        } catch (e) {
          console.log('Photo non accessible');
        }
      }
      photosHtml += '</div></div>';
    }

    // Photos de fin
    if (endPhotos.length > 0) {
      photosHtml += '<div class="section"><h3>📸 Photos de fin d\'action</h3><div class="photos-grid">';
      for (const photo of endPhotos) {
        try {
          const base64 = await getBase64FromUri(photo.uri);
          if (base64) {
            photosHtml += `<div class="photo-item"><img src="${base64}" /><p>${photo.timestamp}</p></div>`;
          }
        } catch (e) {
          console.log('Photo non accessible');
        }
      }
      photosHtml += '</div></div>';
    }

    // Actions complétées
    let actionsHtml = '';
    if (completedActions.length > 0) {
      actionsHtml = completedActions.map(a => `<li>✅ ${a.text}</li>`).join('');
    }

    // Actions restantes
    let remainingHtml = '';
    if (remainingActions.length > 0) {
      remainingHtml = remainingActions.map(a => `<li>⚠️ ${a.text}</li>`).join('');
    }

    // Mesures opérationnelles
    const operationsCompleted = Object.entries(data.operations)
      .filter(([_, value]) => value)
      .length;

    // Zones à risques
    const risksVerified = Object.entries(data.risks)
      .filter(([_, value]) => value)
      .length;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          background: #262135;
          color: white;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0 0;
          opacity: 0.8;
        }
        .section {
          background: #f5f5f5;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        .section h3 {
          margin-top: 0;
          color: #262135;
          border-bottom: 2px solid #5a4fcf;
          padding-bottom: 8px;
        }
        .info-row {
          display: flex;
          margin-bottom: 8px;
        }
        .info-label {
          font-weight: bold;
          width: 150px;
          color: #666;
        }
        .info-value {
          flex: 1;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .stat-box {
          background: #5a4fcf;
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-box h4 {
          margin: 0;
          font-size: 24px;
        }
        .stat-box p {
          margin: 5px 0 0 0;
          font-size: 12px;
          opacity: 0.9;
        }
        .sso-box {
          background: #4ade80;
          color: #1f2937;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        .photos-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .photo-item {
          width: 200px;
        }
        .photo-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }
        .photo-item p {
          font-size: 10px;
          color: #666;
          text-align: center;
          margin: 5px 0;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        .alert-box {
          background: #dc2626;
          color: white;
          padding: 15px;
          border-radius: 8px;
        }
        .success-box {
          background: #4ade80;
          color: #1f2937;
          padding: 15px;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛡️ RAPPORT D'INTERVENTION</h1>
        <p>Officier Sécurité - ${currentDate}</p>
      </div>

      <div class="section">
        <h3>👤 Informations Générales</h3>
        <div class="info-row">
          <span class="info-label">Officier:</span>
          <span class="info-value">${data.nom || 'Non renseigné'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Matricule:</span>
          <span class="info-value">${data.matricule || 'Non renseigné'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">N° Intervention:</span>
          <span class="info-value">${data.numeroIntervention || 'Non renseigné'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Adresse:</span>
          <span class="info-value">${data.adresse || 'Non renseignée'}</span>
        </div>
        ${data.latitude && data.longitude ? `
        <div class="info-row">
          <span class="info-label">Coordonnées GPS:</span>
          <span class="info-value">${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}</span>
        </div>
        ` : ''}
      </div>

      ${data.ssoScore > 0 ? `
      <div class="sso-box">
        <h3 style="margin-top:0;">🏋️ Soutien Sanitaire Opérationnel (SSO)</h3>
        <div class="info-row">
          <span class="info-label">Score:</span>
          <span class="info-value"><strong>${data.ssoScore} points</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Niveau:</span>
          <span class="info-value"><strong>${data.ssoLevel}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Moyens recommandés:</span>
          <span class="info-value"><strong>${data.ssoRecommendation}</strong></span>
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h3>📊 Statistiques</h3>
        <div class="stats-grid">
          <div class="stat-box">
            <h4>${completedActions.length}/${actionsData.length}</h4>
            <p>Actions principales</p>
          </div>
          <div class="stat-box">
            <h4>${operationsCompleted}</h4>
            <p>Mesures validées</p>
          </div>
          <div class="stat-box">
            <h4>${risksVerified}</h4>
            <p>Risques vérifiés</p>
          </div>
        </div>
      </div>

      ${completedActions.length > 0 ? `
      <div class="section success-box">
        <h3 style="margin-top:0; color:#1f2937;">✅ Actions Complétées (${completedActions.length})</h3>
        <ul>${actionsHtml}</ul>
      </div>
      ` : ''}

      ${remainingActions.length > 0 ? `
      <div class="section alert-box">
        <h3 style="margin-top:0; color:white;">⚠️ Actions Restantes (${remainingActions.length})</h3>
        <ul>${remainingHtml}</ul>
      </div>
      ` : ''}

      ${photosHtml}

      <div class="footer">
        <p>Document généré automatiquement par l'application OffSec</p>
        <p>${currentDate}</p>
      </div>
    </body>
    </html>
    `;
  };

  // Générer et sauvegarder le PDF
  const generatePdf = async () => {
    setGeneratingPdf(true);
    try {
      const html = await generatePdfHtml();
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Renommer le fichier avec un nom plus explicite
      const fileName = `Intervention_${data.numeroIntervention || 'rapport'}_${new Date().toISOString().split('T')[0]}.pdf`;
      const newUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      Alert.alert(
        '✅ PDF Généré',
        `Le rapport a été créé avec succès.\n\nVoulez-vous le partager ?`,
        [
          { text: 'Non', style: 'cancel' },
          {
            text: 'Partager',
            onPress: async () => {
              const isAvailable = await Sharing.isAvailableAsync();
              if (isAvailable) {
                await Sharing.shareAsync(newUri, {
                  mimeType: 'application/pdf',
                  dialogTitle: 'Partager le rapport d\'intervention',
                });
              } else {
                Alert.alert('Info', `Le fichier a été enregistré dans: ${newUri}`);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      Alert.alert('Erreur', 'Impossible de générer le PDF. Veuillez réessayer.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 Synthèse de l'Intervention</Text>
        </View>

        {/* Section Photos de fin */}
        <PhotoCapture type="end" title="Photos de fin d'action" />

        {/* Informations générales */}
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

        {/* SSO */}
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

        {/* Statistiques */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>📊 Statistiques</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Actions principales:</Text>
            <Text style={styles.statValue}>
              {completedActions.length}/{actionsData.length}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Mesures opérationnelles:</Text>
            <Text style={styles.statValue}>
              {Object.values(data.operations).filter(Boolean).length} validées
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Zones à risques:</Text>
            <Text style={styles.statValue}>
              {Object.values(data.risks).filter(Boolean).length} vérifiées
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Photos prises:</Text>
            <Text style={styles.statValue}>
              {data.photos.length} photo(s)
            </Text>
          </View>
        </View>

        {/* Actions restantes avec toggles */}
        {remainingActions.length > 0 && (
          <View style={styles.remainingCard}>
            <Text style={styles.cardTitle}>⚠️ Actions Restantes ({remainingActions.length})</Text>
            <Text style={styles.helpText}>Appuyez sur une action pour la marquer comme complétée</Text>
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

        {/* Actions complétées */}
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
        {/* Bouton Synthèse PDF */}
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
  container: {
    flex: 1,
    backgroundColor: '#262135',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 200,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  ssoCard: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ssoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ssoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  ssoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  ssoRecommendation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#5a4fcf',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  remainingCard: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  helpText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
  },
  actionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  actionText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  tapIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  completedCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 8,
  },
  checkmark: {
    fontSize: 20,
    marginRight: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
    textDecorationLine: 'line-through',
  },
  messageCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    color: '#4ade80',
    textAlign: 'center',
    lineHeight: 24,
  },
  spacer: {
    height: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
    backgroundColor: '#3a3450',
  },
  pdfButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modifyButton: {
    backgroundColor: '#5a4fcf',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
