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

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const npm = require('npm-stats-api');

const generator = require('./pdfGeneration/generator.js');

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

exports.getPDF = (req, res) => {
    const { targetReport } = req.query;

    if (fs.existsSync(path.resolve(__dirname, `../PDFStore/Zowe Community Metrics - ${targetReport}.pdf`))) {
        const data = fs.readFileSync(
            path.resolve(__dirname, `../PDFStore/Zowe Community Metrics - ${targetReport}.pdf`)
        );
        res.contentType('application/pdf');
        res.status(200).send(data);
    } else {
        res.status(404).json({
            message: 'No report found for that month',
        });
    }
};

exports.availableReports = (req, res) => {
    let files = [];
    fs.readdirSync(path.resolve(__dirname, `../PDFStore`)).forEach((file) => {
        files.push(file.slice(25, -4));
    });
    res.json({
        reports: files,
    });
};

exports.generateReport = () => {
    axios
        .get(`${process.env.EXTERNAL_API_URL}/auth`, {
            headers: {
                jwtkey: process.env.JWT_KEY,
            },
        })
        .then((authResponse) => {
            let options = {
                headers: {
                    authorization: `Bearer ${authResponse.data.token}`,
                },
            };

            axios
                .all([
                    axios.get(`${process.env.EXTERNAL_API_URL}/`), // 0
                    axios.get(`${process.env.EXTERNAL_API_URL}/community/slack`, options), // 1
                    axios.get(`${process.env.EXTERNAL_API_URL}/community/github`, options), // 2
                    axios.get(`${process.env.EXTERNAL_API_URL}/versions`, options), // 3
                ])
                .then(
                    axios.spread(async (...responses) => {
                        let cumulative = responses[0].data;

                        let date = new Date();
                        date.setMonth(date.getMonth() - 1);

                        let dateString = `${get_month_string(date)} ${date.getFullYear()}`;

                        /**
                         * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                         * Add Cumulative to cache !!
                         * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                         */

                        let dt = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12, 0, 0);

                        let new_cli = new CLI({
                            date: dt,
                            value: cumulative.cli.downloads,
                        });
                        let saved_cli = await new_cli.save();

                        let new_explorer = new Explorer({
                            date: dt,
                            value: cumulative.explorer.downloads,
                        });
                        let saved_explorer = await new_explorer.save();

                        let new_smpe = new SMPE({
                            date: dt,
                            value: cumulative.server.smpe,
                        });
                        let saved_smpe = await new_smpe.save();

                        let new_binary = new Binary({
                            date: dt,
                            value: cumulative.server.binary,
                        });
                        let saved_binary = await new_binary.save();

                        // Plugins

                        let pluginNames = [`secure-credential-store`, `zos-ftp`, `cics`, `db2`, `mq`, `ims`];

                        for (const plugin of pluginNames) {
                            let newItem;

                            npm.stat(
                                `@zowe/${plugin}-for-zowe-cli`,
                                '2019-01-01',
                                dt.toISOString().slice(0, 10),
                                async (err, response) => {
                                    switch (plugin) {
                                        case `cics`:
                                            newItem = new CICS({
                                                date: dt,
                                                value: response.downloads,
                                            });
                                            break;
                                        case `db2`:
                                            newItem = new DB2({
                                                date: dt,
                                                value: response.downloads,
                                            });
                                            break;
                                        case `ims`:
                                            newItem = new IMS({
                                                date: dt,
                                                value: response.downloads,
                                            });
                                            break;
                                        case `mq`:
                                            newItem = new MQ({
                                                date: dt,
                                                value: response.downloads,
                                            });
                                            break;
                                        case `zos-ftp`:
                                            newItem = new FTP({
                                                date: dt,
                                                value: response.downloads,
                                            });
                                            break;
                                        case `secure-credential-store`:
                                            newItem = new SCS({
                                                date: dt,
                                                value: response.downloads,
                                            });
                                            break;
                                    }

                                    let savedItem = await newItem.save();
                                }
                            );
                        }

                        // Slack

                        let slackDate = new Date();
                        slackDate.setMonth(slackDate.getMonth() - 1);

                        let date_to_save = new Date(slackDate.getFullYear(), slackDate.getMonth(), 1, 12, 0, 0);

                        let newSlackParticipants = new slack_participants({
                            date: date_to_save,
                            value: responses[1].data.participants,
                        });
                        let savedParts = await newSlackParticipants.save();

                        let newSlackChannels = new slack_channels({
                            date: date_to_save,
                            value: responses[1].data.channels,
                        });
                        let savedChannels = await newSlackChannels.save();

                        let newSlackMessages = new slack_messages({
                            date: date_to_save,
                            value: responses[1].data.messages,
                        });
                        let savedMess = await newSlackMessages.save();

                        let newSlackReplies = new slack_replies({
                            date: date_to_save,
                            value: responses[1].data.replies,
                        });
                        let savedReplies = await newSlackReplies.save();

                        // Github

                        let githubDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 12, 0, 0);

                        let newGitIssues = new github_issues({
                            date: new Date(githubDate.getFullYear(), githubDate.getMonth(), 1, 12, 0, 0),
                            value: responses[2].data.issues,
                        });
                        let savedIssues = await newGitIssues.save();

                        let newGitPRs = new github_prs({
                            date: new Date(githubDate.getFullYear(), githubDate.getMonth(), 1, 12, 0, 0),
                            value: responses[2].data.prs,
                        });
                        let savedPRs = await newGitPRs.save();

                        let newGitRepos = new github_repos({
                            date: new Date(githubDate.getFullYear(), githubDate.getMonth(), 1, 12, 0, 0),
                            value: responses[2].data.repos,
                        });
                        let savedRepos = await newGitRepos.save();

                        let newGitSubmitters = new github_submitters({
                            date: new Date(githubDate.getFullYear(), githubDate.getMonth(), 1, 12, 0, 0),
                            value: responses[2].data.issueSubmitters,
                        });
                        let savedSubmitters = await newGitSubmitters.save();

                        /**
                         * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                         */

                        // Downloads

                        let SMPE_Data = await SMPE.find({}).sort('date');
                        let Binary_Data = await Binary.find({}).sort('date');
                        let CLI_Data = await CLI.find({}).sort('date');
                        let Explorer_Data = await Explorer.find({}).sort('date');

                        let cli = {};
                        for (const rec of CLI_Data) {
                            cli[dateToString(rec.date.toISOString().slice(0, 10))] = rec.value;
                        }
                        let explorer = {};
                        for (const rec of Explorer_Data) {
                            explorer[dateToString(rec.date.toISOString().slice(0, 10))] = rec.value;
                        }

                        let smpe = {};
                        let binary = {};
                        let server = {};

                        for (let i = 0; i < SMPE_Data.length; i++) {
                            smpe[dateToString(SMPE_Data[i].date.toISOString().slice(0, 10))] = SMPE_Data[i].value;
                            binary[dateToString(Binary_Data[i].date.toISOString().slice(0, 10))] = Binary_Data[i].value;
                            server[dateToString(SMPE_Data[i].date.toISOString().slice(0, 10))] =
                                parseInt(SMPE_Data[i].value) + parseInt(Binary_Data[i].value);
                        }

                        // Plugins

                        let cics_data = await CICS.find({}).sort('date');
                        let db2_data = await DB2.find({}).sort('date');
                        let mq_data = await MQ.find({}).sort('date');
                        let ims_data = await IMS.find({}).sort('date');
                        let ftp_data = await FTP.find({}).sort('date');
                        let scs_data = await SCS.find({}).sort('date');

                        let cics = {};
                        for (const data of cics_data) {
                            cics[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let db2 = {};
                        for (const data of db2_data) {
                            db2[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let mq = {};
                        for (const data of mq_data) {
                            mq[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let ims = {};
                        for (const data of ims_data) {
                            ims[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let ftp = {};
                        for (const data of ftp_data) {
                            ftp[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let scs = {};
                        for (const data of scs_data) {
                            scs[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }

                        // Community

                        let github_data_submitters = await github_submitters.find({}).sort('date');
                        let github_data_prs = await github_prs.find({}).sort('date');
                        let github_data_issues = await github_issues.find({}).sort('date');
                        let github_data_repos = await github_repos.find({}).sort('date');

                        let gh_submitters = {};
                        for (const data of github_data_submitters) {
                            gh_submitters[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let gh_prs = {};
                        for (const data of github_data_prs) {
                            gh_prs[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let gh_issues = {};
                        for (const data of github_data_issues) {
                            gh_issues[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let gh_repos = {};
                        for (const data of github_data_repos) {
                            gh_repos[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }

                        let slack_data_participants = await slack_participants.find({}).sort('date');
                        let slack_data_channels = await slack_channels.find({}).sort('date');
                        let slack_data_messages = await slack_messages.find({}).sort('date');
                        let slack_data_replies = await slack_replies.find({}).sort('date');

                        let s_participants = {};
                        for (const data of slack_data_participants) {
                            s_participants[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let s_channels = {};
                        for (const data of slack_data_channels) {
                            s_channels[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let s_messages = {};
                        for (const data of slack_data_messages) {
                            s_messages[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }
                        let s_replies = {};
                        for (const data of slack_data_replies) {
                            s_replies[dateToString(data.date.toISOString().slice(0, 10))] = data.value;
                        }

                        let versionDownloads = responses[3].data.sorted;

                        let cache = {
                            cli: { downloads: cli },
                            explorer: { downloads: explorer },
                            server: {
                                smpe: smpe,
                                binary: binary,
                                downloads: server,
                            },
                            plugins: {
                                cics: cics,
                                db2: db2,
                                mq: mq,
                                ims: ims,
                                ftp: ftp,
                                scs: scs,
                            },
                            slack: {
                                participants: s_participants,
                                channels: s_channels,
                                messages: s_messages,
                                replies: s_replies,
                            },
                            github: {
                                submitters: gh_submitters,
                                prs: gh_prs,
                                issues: gh_issues,
                                repos: gh_repos,
                            },
                        };

                        await generator.generate({
                            cumulative,
                            cache,
                            dateString: dateString,
                            commDate: dateToString(githubDate),
                            versionDownloads: versionDownloads,
                        });
                    })
                );
        });
};

const dateToString = (dt) => {
    try {
        if (dt.toUpperCase() === `TODAY`) {
            return `Today`;
        }
    } catch (ex) {
        console.log(ex);
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

const get_month_string = (dt) => {
    var months = [
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
    return months[dt.getMonth()];
};
