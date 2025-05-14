# Formulaire de Présence

Une application web simple pour enregistrer les présences et exporter les données au format CSV.

## Fonctionnalités

- Saisie des informations de présence (nom, date, heures d'arrivée/départ, station)
- Stockage local des données dans le navigateur
- Affichage des enregistrements sauvegardés
- Export des données au format CSV
- Interface utilisateur responsive et moderne

## Utilisation

1. Ouvrez le fichier `index.html` dans un navigateur web
2. Remplissez le formulaire avec les informations de présence
3. Cliquez sur "Enregistrer" pour sauvegarder les données
4. Utilisez le bouton "Exporter en CSV" pour télécharger les données au format CSV
5. Le bouton "Effacer les données" permet de supprimer toutes les données stockées

## Structure des fichiers

- `index.html` : Structure de la page et formulaire
- `styles.css` : Styles et mise en page
- `script.js` : Logique de l'application et gestion des données

## Stockage des données

Les données sont stockées localement dans le navigateur en utilisant le Local Storage. Elles persistent même après la fermeture du navigateur, mais peuvent être effacées en utilisant le bouton "Effacer les données" ou en vidant le cache du navigateur.
