const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Please enter a custom username',
            trim: true
        },
        email: {
            type: String,
            required: 'Please enter a valid email address',
            unique: true,
            trim: true,
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

UserSchema.post('findOneAndDelete', async function (thought) {
    console.log('These are your thoughts: ' + thought)
    if (thought) {
        const data = await Thought.deleteMany({ _id: { $in: [thought.thoughts] } } );
        console.log('This is data: ' + data);
    }
});

UserSchema.virtual('friendCount').get(function() {
    if (this.friends.length > 0) {
        return this.friends.length;
    } else {
        return 0;
    }
});

const User = model('User', UserSchema);

module.exports = User;