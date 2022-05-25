const router = require('express').Router();
const { getAllUsers, createUser, getUserById, updateUser, deleteUser} = require('../../controllers/user-controller');

// /api/users (GET, POST)
router
    .route('/users')
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
    .route('/userId/friends/:friendId')
    .post(newFriend)
    .delete(deleteFriend)

module.exports = router;    