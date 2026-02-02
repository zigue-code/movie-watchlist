/ Appercu
MovieWatchList est une application full-stack simple qui vous permet de :

    ✅ Ajouter des films à votre liste

    👁️ Marquer comme "vu" ou "à voir"

    ⭐ Noter vos films (1-5 étoiles)

    🏷️ Catégoriser par genre

    📝 Ajouter des notes personnelles

    🗑️ Supprimer des films
       recherche et filtrage avances
   🎥 Intégration API TMDB (affiche, synopsis, réalisateur)

2. Installation
    # 1. Téléchargez le projet
    git clone https://github.com/votre-nom/moviewatchlist.git
    cd moviewatchlist
    
    # 2. Configurez le backend
    cd backend
    npm install
    
    # 3. Créez le fichier .env
    echo "MONGODB_URI=mongodb://localhost:27017/moviedb" > .env
    echo "PORT=5000" >> .env
    echo "TMDB_API_KEY=votre_clé_api_tmdb" >> .env
    
    # Pour obtenir une clé TMDB gratuite : https://www.themoviedb.org/settings/api
    
    # 4. Démarrez le serveur backend
    npm run dev
    
    # 5. Dans un nouveau terminal, lancez le frontend
    cd ../frontend
    
    # OU avec Node.js :
    npx serve . -p 8000
    
    # 6. Ouvrez votre navigateur
    # Rendez-vous sur : http://localhost:8000

🎨 Fonctionnalités
   Interface Utilisateur
   
    Ajout rapide de films
    Cartes visuelles pour chaque film avec affiche TMDB
    recherche de film
    Filtres dynamiques (Tous / Vus / À voir)
    Système de notation par étoiles
    Design responsive (mobile & desktop)
    Modal d'édition en un clic
    Affichage automatique du synopsis et réalisateur via TMDB
  Gestion des Films
    // Exemple de film dans la base
      {
        "title": "Inception",
        "year": 2010,
        "genre": "Science-Fiction",
        "watched": false,
        "rating": 4.5,
        "notes": "À revoir !",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
📁 Structure du Projet
      moviewatchlist/
      ├── backend/              # Serveur Node.js
      │   ├── server.js        # Point d'entrée
      │   ├── models/          # Modèles MongoDB
      │   │   └── Movie.js     # Schéma des films
      │   └── routes/          # Routes API
      │       └── movies.js    # Gestion des films
      ├── frontend/            # Interface utilisateur
      │   ├── index.html       # Page principale
      │   └── script.js        # Logique frontend
      └── README.md            # Ce fichier
        
