// frontend/script.js
const API_URL = 'http://localhost:5000/api/movies';
let allMovies = []; // Stocke tous les films
let currentFilter = 'all'; // Filtre actuel

// Charger les films au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    setupModalClose();
});

// 1. CHARGER LES FILMS
async function loadMovies() {
    try {
        const response = await fetch(API_URL);
        allMovies = await response.json();
        updateStats();
        displayMovies(allMovies);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('moviesContainer').innerHTML = `
            <div class="col-span-2 text-center py-10 text-red-500">
                <i class="fas fa-exclamation-triangle text-3xl mb-4"></i>
                <p>Impossible de charger les films</p>
                <button onclick="loadMovies()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">
                    Réessayer
                </button>
            </div>
        `;
    }
}

// 2. AFFICHER LES FILMS
function displayMovies(movies) {
    const container = document.getElementById('moviesContainer');
    
    if (movies.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 text-center py-10 text-gray-500">
                <i class="fas fa-film text-4xl mb-4"></i>
                <p class="text-xl mb-2">Aucun film trouvé</p>
                <p>Commence par ajouter ton premier film!</p>
            </div>
        `;
        return;
    }

    let html = '';
    movies.forEach(movie => {
        const watchedClass = movie.watched ? 'watched' : '';
        const stars = getStarRating(movie.rating);
        
        html += `
            <div class="movie-card bg-white rounded-xl shadow p-5 ${watchedClass}">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-lg text-gray-800">${movie.title}</h3>
                        <div class="flex items-center text-gray-600 text-sm mt-1">
                            <span class="bg-gray-100 px-2 py-1 rounded mr-2">
                                ${movie.year || 'N/A'}
                            </span>
                            <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                ${movie.genre}
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="toggleWatched('${movie._id}', ${!movie.watched})" 
                                class="text-sm ${movie.watched ? 'text-green-600' : 'text-gray-400'}">
                            <i class="fas fa-${movie.watched ? 'check-circle' : 'eye'}"></i>
                        </button>
                        <button onclick="showMovieDetails('${movie._id}')" 
                                class="text-purple-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteMovie('${movie._id}')" 
                                class="text-red-400 hover:text-red-600">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Rating -->
                <div class="mb-3">
                    <div class="text-yellow-400">
                        ${stars}
                    </div>
                </div>
                
                <!-- Notes (si existent) -->
                ${movie.notes ? `
                    <p class="text-gray-600 text-sm italic border-l-4 border-purple-300 pl-3 py-1">
                        "${movie.notes}"
                    </p>
                ` : ''}
                
                <!-- Status -->
                <div class="mt-4 pt-3 border-t flex justify-between items-center">
                    <span class="text-xs text-gray-500">
                        Ajouté le ${new Date(movie.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span class="text-xs px-2 py-1 rounded-full ${movie.watched ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                        ${movie.watched ? '✓ Déjà vu' : 'À voir'}
                    </span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 3. AJOUTER UN FILM
async function addMovie() {
    const title = document.getElementById('movieTitle').value.trim();
    const year = document.getElementById('movieYear').value;
    const genre = document.getElementById('movieGenre').value;
    
    if (!title) {
        alert('Le titre est obligatoire!');
        return;
    }
    
    try {
        const response = await fetch(API_URL,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                year: year ? parseInt(year) : null, 
                genre 
            })
        });
        
        if (response.ok) {
            // Réinitialiser le formulaire
            document.getElementById('movieTitle').value = '';
            document.getElementById('movieYear').value = '';
            
            // Recharger les films
            loadMovies();
            
            // Petit effet visuel
            const btn = document.querySelector('button[onclick="addMovie()"]');
            btn.innerHTML = '<i class="fas fa-check mr-2"></i> Ajouté!';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-plus mr-2"></i> Ajouter à ma liste';
            }, 1500);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout');
    }
}

// 4. BASculer "Déjà vu"
async function toggleWatched(id, watchedStatus) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ watched: watchedStatus })
        });
        loadMovies();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// 5. SUPPRIMER UN FILM
async function deleteMovie(id) {
    if (!confirm('Supprimer ce film de ta liste?')) return;
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        loadMovies();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

// 6. FILTRER LES FILMS
function filterMovies(filterType) {
    currentFilter = filterType;
    let filteredMovies = allMovies;
    
    switch(filterType) {
        case 'watched':
            filteredMovies = allMovies.filter(m => m.watched);
            break;
        case 'unwatched':
            filteredMovies = allMovies.filter(m => !m.watched);
            break;
        // 'all' ne filtre pas
    }
    
    displayMovies(filteredMovies);
    
    // Mettre en évidence le bouton actif
    document.querySelectorAll('[onclick^="filterMovies"]').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    event.target.classList.add('bg-purple-600', 'text-white');
    event.target.classList.remove('bg-gray-100', 'text-gray-700');
}

// 7. METTRE À JOUR LES STATISTIQUES
function updateStats() {
    const total = allMovies.length;
    const watched = allMovies.filter(m => m.watched).length;
    
    document.getElementById('totalMovies').textContent = total;
    document.getElementById('watchedMovies').textContent = watched;
}

// 8. FONCTION POUR LES ÉTOILES DE NOTATION
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// 9. MODAL POUR VOIR/ÉDITER LES DÉTAILS
async function showMovieDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const movie = await response.json();
        
        document.getElementById('modalTitle').textContent = movie.title;
        
        const modalContent = `
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-1">Titre</label>
                    <input type="text" id="editTitle" value="${movie.title}" 
                           class="w-full p-2 border rounded">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 mb-1">Année</label>
                        <input type="number" id="editYear" value="${movie.year || ''}" 
                               class="w-full p-2 border rounded">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-1">Genre</label>
                        <select id="editGenre" class="w-full p-2 border rounded">
                            ${['Action', 'Comédie', 'Drame', 'SF', 'Horreur', 'Animation', 'Autre']
                                .map(g => `<option value="${g}" ${g === movie.genre ? 'selected' : ''}>${g}</option>`)
                                .join('')}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-700 mb-1">Notes personnelles</label>
                    <textarea id="editNotes" rows="3" 
                              class="w-full p-2 border rounded">${movie.notes || ''}</textarea>
                </div>
                
                <div class="flex items-center justify-between">
                    <div>
                        <label class="block text-gray-700 mb-1">Noter (0-5)</label>
                        <input type="range" id="editRating" min="0" max="5" step="1" 
                               value="${movie.rating}" class="w-32">
                        <span id="ratingValue" class="ml-2">${movie.rating}/5</span>
                    </div>
                    
                    <div class="flex items-center">
                        <input type="checkbox" id="editWatched" ${movie.watched ? 'checked' : ''} 
                               class="mr-2">
                        <label for="editWatched">Déjà vu</label>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 pt-4 border-t">
                <button onclick="saveMovieChanges('${movie._id}')" 
                        class="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
                    <i class="fas fa-save mr-2"></i> Enregistrer les modifications
                </button>
            </div>
        `;
        
        document.getElementById('modalContent').innerHTML = modalContent;
        
        // Mettre à jour l'affichage de la note en temps réel
        document.getElementById('editRating').addEventListener('input', function() {
            document.getElementById('ratingValue').textContent = this.value + '/5';
        });
        
        // Afficher le modal
        document.getElementById('movieModal').classList.remove('hidden');
        document.getElementById('movieModal').classList.add('flex');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// 10. SAUVEGARDER LES MODIFICATIONS
async function saveMovieChanges(id) {
    const updatedData = {
        title: document.getElementById('editTitle').value,
        year: document.getElementById('editYear').value || null,
        genre: document.getElementById('editGenre').value,
        notes: document.getElementById('editNotes').value,
        rating: parseInt(document.getElementById('editRating').value),
        watched: document.getElementById('editWatched').checked
    };
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        
        closeModal();
        loadMovies();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la sauvegarde');
    }
}

// 11. FERMER LE MODAL
function closeModal() {
    document.getElementById('movieModal').classList.add('hidden');
    document.getElementById('movieModal').classList.remove('flex');
}

function setupModalClose() {
    // Fermer en cliquant en dehors
    document.getElementById('movieModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}