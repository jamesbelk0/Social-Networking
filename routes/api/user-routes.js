const router = require('express').Router();
const { getAllUsers, createUser, getUserById, updateUser, deleteUser, newFriend, deleteFriend} = require('../../controllers/user-controller');

// /api/users (GET, POST)
router
    .route('/')
    .get(getAllUsers)
    .post(createUser)
// /api/users/:id (GET, PUT, DELETE)    
router
    .route('/:id')
    .get(getUserById) 
    .put(updateUser)
    .delete(deleteUser)
// remove a users associateds thoughts when deleted       

router
    .route('/:id/friends/:friendId')
    // .post(newFriend)
    // .delete(deleteFriend)

module.exports = router;    