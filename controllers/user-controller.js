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
            const dbuserData = await User.findOne({ _id: params.id })
                .populate('thoughts')
                .populate('friends')
                .select(['-__v', '-_id', '-email']);
            if (!dbuserData) {
                res.json({ message: 'Could not find a user by that Id' });
                return;
            }
            res.json(dbuserData);
        } catch (err) {
            res.json(err)
        }
    },

    // create user
    async createUser({ body }, res) {
        try {
            const createUser = await User.create(body);
            if (!createUser) {
                res.status(400).json({ message: 'A new user could not be created. Please try again.' });
            }
            res.json(createUser);
        } catch (err) {
            res.json(err);
        }
    },

    // update user
    async updateUser({ params, body }, res) {
        try {
            const dbuserData = await User.findOneAndUpdate({ _id: params.id }, body, { new: true });
            res.json(dbuserData);
        }
        catch (err) {
            res.json(err);
        }
    },

    // delete user
    async deleteUser({ params }, res) {
        try {
            const dbuserData = await User.findOneAndDelete({ _id: params.id }, { new: true });
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
            }
            res.json(dbuserData);
        }
        catch (err) {
            res.json(err);
        }
    },

    // add friend
    async addFriend({ params }, res) {
        try {
            const dbFriendData = await User.findOne({ _id: params.userId });
            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { friends: dbFriendData._id } },
                { new: true }
            ).populate('friends');
            res.json(dbUserData);
        }
        catch (err) {
            res.json(err);
        }
    },

    // delete friend
    async deleteFriend({ params }, res) {
        try {
            const dbuserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { friends: { $in: [params.friendId] } } },
                { new: true }
            ).populate('friends');
            await dbuserData.save();
            res.json(dbuserData);
        }
        catch (err) {
            res.json(err);
        }
    },
};

module.exports = userController