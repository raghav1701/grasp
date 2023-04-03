const mongoose = require('mongoose');

const RoadmapSchema = mongoose.Schema(
    {
        title: { type: String, require: true },
        description: String,
        start: { type: Date, default: Date.now() },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User',
        },
        parent: { type: mongoose.Schema.Types.ObjectId, default: null }, // if cloned from other roadmap
        children: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Roadmap',
            },
        ],
        path: [
            {
                index: { type: Number, require: true }, //  sort order
                topic: { type: String, require: true },
                subpath: [
                    {
                        index: { type: Number, require: true }, // sort order
                        topic: { type: String, require: true },
                        description: String,
                        materials: [String],
                    },
                ],
            },
        ],
        stars: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        tags: [String],
        private: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Roadmap = mongoose.model('Roadmap', RoadmapSchema);

module.exports = Roadmap;
