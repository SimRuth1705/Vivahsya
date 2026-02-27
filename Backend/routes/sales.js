const express = require('express');
const router = express.Router();

// Placeholder route
router.get('/', (req, res) => {
    res.json({ message: "Sales route is working, but no data yet!" });
});

module.exports = router;