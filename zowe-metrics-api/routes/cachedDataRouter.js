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

/**
 * Require all Models used
 */
const CLI = require('../models/clis');
const Explorer = require('../models/explorers');
const Binary = require('../models/binarys');
const SMPE = require('../models/smpes');

const CICS = require('../models/plugins/plugin_cics');
const SCS = require('../models/plugins/plugin_scs');
const MQ = require('../models/plugins/plugin_mq');
const IMS = require('../models/plugins/plugin_ims');
const FTP = require('../models/plugins/plugin_ftp');
const DB2 = require('../models/plugins/plugin_db2');

const github_issues = require('../models/github/issues');
const github_prs = require('../models/github/prs');
const github_repos = require('../models/github/repos');
const github_submitters = require('../models/github/submitters');

const slack_channels = require('../models/slack/channels');
const slack_messages = require('../models/slack/messages');
const slack_participants = require('../models/slack/participants');
const slack_replies = require('../models/slack/replies');

// CLI
router.get('/cli', async (req, res) => {
    let CLI_Data = await CLI.find({}).sort('date');
    let data = {};
    for (let rec of CLI_Data) {
        data[rec.date.toISOString().slice(0, 10)] = rec.value;
    }
    return res.status(200).json({
        data: data,
    });
});

// CLI Plugins
router.get('/plugins', async (req, res) => {
    let cics_data = await CICS.find({}).sort('date');
    let db2_data = await DB2.find({}).sort('date');
    let mq_data = await MQ.find({}).sort('date');
    let ims_data = await IMS.find({}).sort('date');
    let ftp_data = await FTP.find({}).sort('date');
    let scs_data = await SCS.find({}).sort('date');

    let cics = {};
    for (const data of cics_data) {
        cics[data.date.toISOString().slice(0, 10)] = data.value;
    }
    let db2 = {};
    for (const data of db2_data) {
        db2[data.date.toISOString().slice(0, 10)] = data.value;
    }
    let mq = {};
    for (const data of mq_data) {
        mq[data.date.toISOString().slice(0, 10)] = data.value;
    }
    let ims = {};
    for (const data of ims_data) {
        ims[data.date.toISOString().slice(0, 10)] = data.value;
    }
    let ftp = {};
    for (const data of ftp_data) {
        ftp[data.date.toISOString().slice(0, 10)] = data.value;
    }
    let scs = {};
    for (const data of scs_data) {
        scs[data.date.toISOString().slice(0, 10)] = data.value;
    }

    let pluginData = {
        cics: cics,
        db2: db2,
        ims: ims,
        mq: mq,
        ftp: ftp,
        scs: scs,
    };

    return res.status(200).json(pluginData);
});

// Explorer
router.get('/explorer', async (req, res) => {
    let explorer_data = await Explorer.find({}).sort('date');
    let data = {};
    for (let rec of explorer_data) {
        data[rec.date.toISOString().slice(0, 10)] = rec.value;
    }

    return res.status(200).json({
        data: data,
    });
});

// Server
router.get('/server', async (req, res) => {
    let SMPE_Data = await SMPE.find({}).sort('date');
    let Binary_Data = await Binary.find({}).sort('date');

    let smpe = {};
    let binary = {};
    let server = {};

    for (let i = 0; i < SMPE_Data.length; i++) {
        smpe[SMPE_Data[i].date.toISOString().slice(0, 10)] = SMPE_Data[i].value;
        binary[Binary_Data[i].date.toISOString().slice(0, 10)] = Binary_Data[i].value;
        server[SMPE_Data[i].date.toISOString().slice(0, 10)] =
            parseInt(SMPE_Data[i].value) + parseInt(Binary_Data[i].value);
    }

    return res.status(200).json({
        smpe: smpe,
        binary: binary,
        downloads: server,
    });
});

// Slack
router.get('/slack', async (req, res) => {
    let slackChannels = await slack_channels.find({}).sort('date');
    let slackMessages = await slack_messages.find({}).sort('date');
    let slackParticipants = await slack_participants.find({}).sort('date');
    let slackReplies = await slack_replies.find({}).sort('date');

    let messages = {};
    for (const data of slackMessages) {
        messages[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }
    let channels = {};
    for (const data of slackChannels) {
        channels[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }
    let participants = {};
    for (const data of slackParticipants) {
        participants[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }
    let replies = {};
    for (const data of slackReplies) {
        replies[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }

    let slackData = {
        messages: messages,
        channels: channels,
        participants: participants,
        replies: replies,
    };

    return res.status(200).json(slackData);
});

// Github
router.get('/github', async (req, res) => {
    let gh_prs = await github_prs.find({}).sort('date');
    let gh_issues = await github_issues.find({}).sort('date');
    let gh_repos = await github_repos.find({}).sort('date');
    let gh_submits = await github_submitters.find({}).sort('date');

    let prs = {};
    for (const data of gh_prs) {
        prs[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }
    let issues = {};
    for (const data of gh_issues) {
        issues[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }
    let repos = {};
    for (const data of gh_repos) {
        repos[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }
    let submitters = {};
    for (const data of gh_submits) {
        submitters[dateToString(data.date.toISOString().slice(0, 10)).slice(4)] = data.value;
    }

    let githubData = {
        prs: prs,
        repos: repos,
        issues: issues,
        submitters: submitters,
    };

    return res.status(200).json(githubData);
});

router.get('/', (req, res) => {
    res.send('Endpoints to get Cached Data');
});

const dateToString = (dt) => {
    if (dt.toUpperCase() === `TODAY`) {
        return `Today`;
    }

    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let date = new Date(dt);
    return `${date.getDate()}${
        date.getDate() % 10 == 1 && date.getDate() != 11
            ? 'st'
            : date.getDate() % 10 == 2 && date.getDate() != 12
            ? 'nd'
            : date.getDate() % 10 == 3 && date.getDate() != 13
            ? 'rd'
            : 'th'
    } ${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
};

module.exports = router;
