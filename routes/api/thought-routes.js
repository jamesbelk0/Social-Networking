const router = require('express').Router();
const { getAllThoughts, getThoughtById, addThought, updateThought, removeThought, addReaction, removeReaction } = require('../../controllers/thought-controller');

// /api/thoughts (GET and POST)
router
    .route('/thoughts')
    .get(getAllThoughts)
    .post(addThought);

// /api/thoughts/:id (GET one, PUT AND DELETE)
router
    .route('/thoughts/:id')
    // .get(getThoughtById)
    // .put(updateThought)
    .delete(removeThought);

router
    .route('/thoughts/thought:id/reactions')
    .post(addReaction)
    .delete(removeReaction);

module.exports = router;    