const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const upload = require('../config/storageConfig');
const multer = require('multer');

// Get a profile
exports.getProfile = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) return res.json({ error: 'Username invalid!' });
        const user = await User.findOne({ username: username }).select(
            '-password'
        );
        if (!user) return res.json({ error: 'Username invalid!' });
        res.json({ user });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

exports.getRoadmaps = async (req, res) => {
    try {
        if (!req.params.username)
            return res.json({ error: 'Invalid username' });
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.json({ error: 'Invalid username' });
        const roadmaps = await Roadmap.find({ user: user._id });
        res.json(roadmaps);
    } catch (e) {
        res.json(501).json({ error: 'Something went wrong' });
    }
};

// Connect to a profile
exports.connectProfile = async (req, res) => {
    try {
        if (!req.params.username || req.params.username === req.user.username) {
            return res.json({ error: 'Username invalid!' });
        }
        // let otherUser = await User.findOne({
        //     username: req.params.username,
        //     received: req.user.username,
        // });
        // if (otherUser) {
        //     return res.json({ error: 'Requested already' });
        // }
        // otherUser = await User.findOne({
        //     username: req.params.username,
        //     connections: req.user.username,
        // });
        // if (otherUser) {
        //     return res.json({ error: 'Already connected' });
        // }
        // Append to received of other
        otherUser = await User.findOneAndUpdate(
            { username: req.params.username },
            { $push: { received: req.user._id } }
        );
        if (!otherUser) return res.json({ error: 'Username invalid!' });
        // Append to sent of user
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { sent: otherUser._id } }
        );
        return res.json({ success: 'Request sent!' });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

// Search a profile
// Option to search include : username, name, goal
exports.searchProfile = async (req, res) => {
    const option = ['username', 'name', 'goal'];
    try {
        const { type, keyword } = req.query;
        if (option.includes(type)) {
            let query = {};
            query[type] = keyword;
            const profiles = await User.find(query).select('-password');
            res.json({ profiles });
        } else {
            res.status(401).json({ error: 'Invalid type' });
        }
    } catch (e) {}
};

// Accept invite
exports.acceptInvite = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username || req.user.username === username) {
            return res.json({ error: 'Invalid username' });
        }
        // Update other user
        const otherUser = await User.findOneAndUpdate(
            { username: username, pending: req.user._id },
            {
                $pull: { sent: req.user._id },
                $push: { connections: req.user._id },
            }
        );
        // Update my user
        await User.findOneAndUpdate(
            { username: req.user.username, send: otherUser._id },
            {
                $pull: { received: otherUser._id },
                $push: { connections: otherUser._id },
            }
        );
        res.json({ success: 'Accepted invite' });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

// Reject invite
exports.rejectInvite = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username || req.user.username === username) {
            return res.json({ error: 'Invalid username' });
        }
        // Update other user
        const otherUser = await User.findOneAndUpdate(
            { username: username },
            {
                $pull: { sent: req.user._id },
            }
        );
        // Update my user
        await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $pull: { received: otherUser._id },
            }
        );
        res.json({ success: 'Rejected invite' });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

// Get all connections
exports.getAllConnections = async (req, res) => {
    try {
        const connections = await User.findById(req.user._id).select(
            'connections'
        );
        const profiles = await User.find({
            _id: { $in: connections.connections },
        }).select('-password');
        res.json({ profiles });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

exports.getUserConnections = async (req, res) => {
    try {
        const connections = await User.findOne({
            username: req.params.username,
        }).select('connections');
        const profiles = await User.find({
            _id: { $in: connections.connections },
        }).select('-password -sent -received');
        res.json({ profiles });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

// Get pending
exports.getPendingRequests = async (req, res) => {
    try {
        const pending = await User.findById(req.user._id).select('sent');
        const profiles = await User.find({ _id: { $in: pending.sent } }).select(
            '-password'
        );
        res.json({ profiles });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

// Get sent
exports.getReceivedRequests = async (req, res) => {
    try {
        const received = await User.findById(req.user._id).select('received');
        const profiles = await User.find({
            _id: { $in: received.received },
        }).select('-password');
        res.json({ profiles });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const profile = await User.findByIdAndUpdate(req.user._id, {
            name: req.body.name || req.user.name,
            about: req.body.about || req.user.about,
            goals: req.body.goals || req.user.goals,
        });
        if (!profile) {
            return res.status(404).json({ error: 'Profile unavailable' });
        }
        res.json({ success: 'Profile updated successfully' });
    } catch (e) {
        res.json(501).json({ error: e });
    }
};

// Upload avatar
exports.uploadAvatar = (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                throw err;
            }
            let ext;
            try {
                ext = req.file.mimetype.split('/')[1];
            } catch (e) {
                ext = 'jpeg';
            }
            const user = await User.findOneAndUpdate(
                {
                    username: req.user.username,
                },
                {
                    avatar: `/public/uploads/avatars/${req.user.username}.${ext}`,
                }
            );
            if (!user) throw 'User not found';
            res.json({
                link: user.avatar,
            });
        });
    } catch {
        res.json(501).json({ error: e });
    }
};
