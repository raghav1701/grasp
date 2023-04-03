const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema(
    {
        people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
