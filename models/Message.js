const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        content: { type: String, require: true },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
