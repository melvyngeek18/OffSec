import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';

const ROUTES = [
  '/',
  '/weather',
  '/ri',
  '/actions',
  '/operations',
  '/risks',
  '/sso',
  '/summary',
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { saveIntervention, resetIntervention } = useIntervention();

  // Ne pas afficher sur la page d'accueil
  if (pathname === '/') {
    return null;
  }

  const currentIndex = ROUTES.indexOf(pathname);
  const hasPrevious = currentIndex > 1; // Commence après l'index
  const hasNext = currentIndex >= 0 && currentIndex < ROUTES.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      router.push(ROUTES[currentIndex - 1] as any);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(ROUTES[currentIndex + 1] as any);
    }
  };

  const handleMenu = () => {
    router.push('/menu');
  };

  const exitApp = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      // Sur iOS, on ne peut pas fermer l'app programmatiquement
      // On retourne à la page d'accueil
      router.replace('/');
    }
  };

  const handleQuit = () => {
    Alert.alert(
      '🚪 Quitter l\'application',
      'Voulez-vous sauvegarder les données de l\'intervention avant de quitter ?\n\n✅ OUI = Les données seront restaurées au prochain lancement\n❌ NON = Les données seront effacées définitivement',
      [
        {
          text: '✅ OUI - Sauvegarder',
          onPress: async () => {
            // Sauvegarder et quitter
            try {
              await saveIntervention();
              Alert.alert(
                '✅ Données Sauvegardées',
                'Vos données d\'intervention ont été sauvegardées.\n\nElles seront automatiquement restaurées à la prochaine ouverture de l\'application.',
                [
                  {
                    text: 'Quitter',
                    onPress: () => exitApp(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de sauvegarder les données.');
            }
          },
        },
        {
          text: '❌ NON - Effacer',
          style: 'destructive',
          onPress: async () => {
            // Ne pas sauvegarder, réinitialiser et quitter
            resetIntervention();
            Alert.alert(
              '🗑️ Données Effacées',
              'Les données de l\'intervention ont été supprimées.\n\nL\'application démarrera vierge au prochain lancement.',
              [
                {
                  text: 'Quitter',
                  onPress: () => exitApp(),
                },
              ]
            );
          },
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={handleMenu}
      >
        <Text style={styles.navIcon}>📋</Text>
        <Text style={styles.navText}>Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]}
        onPress={handlePrevious}
        disabled={!hasPrevious}
      >
        <Text style={styles.navIcon}>←</Text>
        <Text style={styles.navText}>Précédent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
        onPress={handleNext}
        disabled={!hasNext}
      >
        <Text style={styles.navIcon}>→</Text>
        <Text style={styles.navText}>Suivant</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, styles.quitButton]}
        onPress={handleQuit}
      >
        <Text style={styles.navIcon}>🚪</Text>
        <Text style={styles.navText}>Quitter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1625',
    borderTopWidth: 2,
    borderTopColor: '#3a3450',
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#3a3450',
    borderRadius: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  quitButton: {
    backgroundColor: '#dc2626',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
});
