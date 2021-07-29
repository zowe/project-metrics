/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

let express = require('express');
let router = express.Router();

const pagesController = require('../controllers/pagesController');

router.get('/', (req, res, next) => {
    pagesController.showHome(req, res);
});

router.get('/downloads', (req, res) => {
    pagesController.showDownloads(req, res);
});

router.get('/community', (req, res) => {
    pagesController.showCommunity(req, res);
});

router.get('/analytics', (req, res) => {
    pagesController.showAnalytics(req, res);
});

router.get('/pdf', (req, res) => {
    let { targetReport } = req.query;
    res.redirect(`${process.env.EXTERNAL_API_URL}/pdf?targetReport=${targetReport}`);
});

module.exports = router;
