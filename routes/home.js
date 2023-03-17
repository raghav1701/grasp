const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: 'Home page',
    });
});

module.exports = router;
