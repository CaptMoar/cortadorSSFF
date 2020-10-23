const express = require('express');
const router = express.Router();

const corteService = require('../service/corteService');

router.get('/nombre', async (req, res) => {
    res.send(await corteService.documento(req));
});

module.exports = router;
