const multer = require('multer');

const Storage = multer.diskStorage({
    destination: __dirname + '/../public/uploads/avatars/',
    filename: (req, file, callback) => {
        let ext = file.mimetype.split('/')[1];
        if (!ext) ext = file.mimetype.split('\\')[1];
        if (!ext) callback(null, false);
        else callback(null, req.user.username + '.' + ext);
    },
});

const upload = multer({
    storage: Storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/jpeg') {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    limits: { fileSize: 1000000 },
}).single('avatar');

module.exports = upload;
