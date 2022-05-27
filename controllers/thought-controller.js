const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoguhts
    getAllThoughts({ params, body }, res) {
        User.findOne({})
        .populate({
            path: 'thoughts',
        })
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // add thought (comment) to user
    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found wit hthis id!' });
                return;
            }
            res.json(dbUserData); 
        })
        .catch(err => res.json(err));
    },

    // add one reaction (reply) to thought
addReaction({ params, body}, res) {
    User.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reaction: body} },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message:'No pizza found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

    // delete thought (comment)
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json ({ message: 'No thought with this id' });
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
    
    //delete reaction (reply)
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },


};

module.exports = thoughtController;