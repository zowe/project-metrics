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

const express = require('express');
const router = express.Router();

const explorerController = require('../methods/explorerController');
const cliController = require('../methods/cliController');
const serverController = require('../methods/serverController');
const ompController = require('../methods/ompController');
const versionsController = require('../methods/versionsController');
const conformantsController = require('../methods/conformantsController');
const allController = require('../methods/allController');
const checkAuth = require('../methods/authMiddleware');

const { getPDF, availableReports } = require('../methods/pdf.js');

const authRouter = require('./auth');
const cachedRouter = require('./cachedDataRouter');
const communityRouter = require('./communityRouter');
const analyticsRouter = require('./analyticsRouter');

router.get('/', function (req, res, next) {
    allController.getAll(req, res);
});

router.get('/cli', (req, res) => {
    cliController.getCLI(req, res);
});

router.get('/explorer', (req, res) => {
    explorerController.getExplorer(req, res);
});

router.get('/server', (req, res) => {
    serverController.getServer(req, res);
});

router.get('/omp', (req, res) => {
    ompController.getOMP(req, res);
});

router.get('/conformants', (req, res) => {
    conformantsController.getConformants(req, res);
});

router.get('/versions', (req, res) => {
    versionsController.getVersions(req, res);
});

router.get('/pdf', (req, res) => {
    getPDF(req, res);
});

router.get('/available-reports', (req, res) => {
    availableReports(req, res);
});

router.use('/cache', checkAuth, cachedRouter);
router.use('/community', checkAuth, communityRouter);
router.use('/analytics', checkAuth, analyticsRouter);
router.use('/auth', authRouter);

module.exports = router;
