const router = require('express').Router();
const authController = require('../controller/AuthController');
const roadmapController = require('../controller/RoadmapController');

// Get all roadmaps of a user
router.get('/all', roadmapController.getAllRoadmaps);

// Search a roadmap
router.get('/all/search', roadmapController.searchRoadmap);

// Create a roadmap
router.post(
    '/create',
    authController.isAuthenticated,
    roadmapController.createRoadmap
);

// Get a note by noteID
router.get(
    '/notes/:noteid',
    authController.isAuthenticated,
    roadmapController.getNote
);

// Update a note by noteID
router.patch(
    '/notes/:noteid',
    authController.isAuthenticated,
    roadmapController.updateNote
);

// Fork a roadmap
router.post(
    '/fork/:id',
    authController.isAuthenticated,
    roadmapController.forkRoadmap
);

// Star a roadmap
router.post(
    '/star/:id',
    authController.isAuthenticated,
    roadmapController.starRoadmap
);

// Get a single roadmap // id of roadmap
router.get('/:id', roadmapController.getRoadmap);

// Update a roadmap
router.patch(
    '/:id',
    authController.isAuthenticated,
    roadmapController.updateRoadmap
);

// Create note for a roadmap
router.post(
    '/:id/notes/create',
    authController.isAuthenticated,
    roadmapController.createNote
);

// Get all notes of a roadmap
router.get(
    '/:id/notes/all',
    authController.isAuthenticated,
    roadmapController.getNotes
);

module.exports = router;
