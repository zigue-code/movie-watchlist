// backend/routes/movies.js
const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// 1. GET - Tous les films (avec filtres optionnels)
router.get('/', async (req, res) => {
  try {
    const { title, genre, year, rating_gte } = req.query;
    let query = {};

    // Filtre par titre (recherche partielle, insensible à la casse)
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Filtre par genre
    if (genre) {
      query.genre = genre;
    }

    // Filtre par année
    if (year) {
      query.year = parseInt(year);
    }

    // Filtre par note minimale
    if (rating_gte) {
      query.rating = { $gte: parseFloat(rating_gte) };
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST - Ajouter un film
router.post('/', async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      year: req.body.year,
      genre: req.body.genre
    });
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2.b GET - Récupérer un film par son id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id); 
    if (!movie) return res.status(404).json({ error: 'Film non trouvé' });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. PUT - Modifier un film
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trouvé' });

    // Mettre à jour seulement les champs envoyés
    if (req.body.title !== undefined) movie.title = req.body.title;
    if (req.body.watched !== undefined) movie.watched = req.body.watched;
    if (req.body.rating !== undefined) movie.rating = req.body.rating;
    if (req.body.notes !== undefined) movie.notes = req.body.notes;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. DELETE - Supprimer un film
router.delete('/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Film supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;