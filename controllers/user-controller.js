const res = require('express/lib/response');
const { User } = require('../models')

const userController = {
    //get all users
    async getAllUsers(req, res) {
        try {
            const allUsers = await User.find({});
            if (!allUsers.length) {
                res.json({ message: 'No users to find' });
                return;
            }
            res.json(allUsers);
        }
        catch (err) {
            res.json(err);
        }
    },

    // get one user by id
    async getUserById({ params }, res) {
        try {
            const userData = await User.findOne({ _id: params.id })
                .populate('thoughts')
                .populate('friends')
                .select(['-__v', '-_id', '-email']);
            if (!userData) {
                res.json({ message: 'Could not find a user by that Id' });
                return;
            }
            res.json(userData);
        } catch (err) {
            res.json(err)
        }
    },

    // create user
    async createUser({ body }, res) {
        try {
            const createUser = await User.create(body);
            if(!createUser) {
                res.status(400).json({ message: 'A new user could not be created. Please try again.' });
            }
            res.json(createUser);
        } catch(err) {
            res.json(err);
        }
        // console.log(body);
        // User.create(body)
        //     .then(dbUserData => {
        //         if (!dbUserData) {
        //             res.status(404).json({ message: 'No user was created' });
        //             return;
        //         }
        //         res.json(dbUserData);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         res.status(400).json(err);
        //     });
    },

    // update user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // add friend
    addFriend({ params }, res) {
        const dbFriendData = User.findOne({ _id: params.friendId });
        const dbUserData = User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: dbFriendData._id } },
            { new: true }
        )
            .populate('friends');
        res.json(dbUserData);
    },

    // delete friend
    deleteFriend({ params }, res) {
        const userData = User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: { $in: [params.friendId] } } },
            { new: true }
        )
            .populate('friends');
        userData.save();
        res.json(userData);
    }
};

module.exports = userController