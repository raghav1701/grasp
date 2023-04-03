const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema(
    {
        title: { type: String, require: true },
        content: { type: String, require: true }, // can be markdown and what not
        roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
