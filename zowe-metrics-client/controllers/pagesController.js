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

const axios = require('axios');

exports.showHome = (req, res) => {
    axios
        .all([
            axios.get(`${process.env.INTERNAL_API_URL}/cli`), // 0
            axios.get(`${process.env.INTERNAL_API_URL}/explorer`), // 1
            axios.get(`${process.env.INTERNAL_API_URL}/server`), // 2
            axios.get(`${process.env.INTERNAL_API_URL}/omp`), // 3
            axios.get(`${process.env.INTERNAL_API_URL}/conformants`), // 4
            axios.get(`${process.env.INTERNAL_API_URL}/available-reports`), // 5
        ])
        .then(
            axios.spread(async (...responses) => {
                let cli = responses[0].data.downloads;
                let explorer = responses[1].data.downloads;
                let server = responses[2].data.downloads;
                let slack = responses[3].data.slackParticipants;
                let github = responses[3].data.githubSubmittors;
                let conformants = responses[4].data.products;
                let reports = responses[5].data.reports;

                res.render('index', {
                    reports: reports,
                    cli: convertToK(cli),
                    explorer: convertToK(explorer),
                    server: convertToK(server),
                    slack: convertToK(slack),
                    github: github,
                    conformants: conformants,
                });
            })
        );
};

exports.showDownloads = (req, res) => {
    axios
        .get(`${process.env.INTERNAL_API_URL}/auth`, {
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
                    axios.get(`${process.env.INTERNAL_API_URL}/cache/cli`, options), // 0
                    axios.get(`${process.env.INTERNAL_API_URL}/cache/explorer`, options), // 1
                    axios.get(`${process.env.INTERNAL_API_URL}/cache/server`, options), // 2
                    axios.get(`${process.env.INTERNAL_API_URL}/cli`), // 3
                    axios.get(`${process.env.INTERNAL_API_URL}/explorer`), // 4
                    axios.get(`${process.env.INTERNAL_API_URL}/server`), // 5
                    axios.get(`${process.env.INTERNAL_API_URL}/versions`, options), // 6
                ])
                .then(
                    axios.spread(async (...responses) => {
                        let cli = responses[0].data.data;
                        cli.today = responses[3].data.downloads;

                        let explorer = responses[1].data.data;
                        explorer.today = responses[4].data.downloads;

                        let server = responses[2].data.downloads;
                        server['today'] = responses[5].data.downloads;

                        res.render('downloads', {
                            cli: cli,
                            explorer: explorer,
                            server: server,
                            versions: responses[6].data,
                            dateToString: dateToString,
                        });
                    })
                );
        });
};

exports.showCommunity = (req, res, next) => {
    axios
        .get(`${process.env.INTERNAL_API_URL}/auth`, {
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
            let startOfMonth = new Date();
            startOfMonth.setDate(1);
            let todayDate = new Date();

            if (
                todayDate.getMonth() === startOfMonth.getMonth() &&
                todayDate.getFullYear() === startOfMonth.getFullYear() &&
                todayDate.getDate() === startOfMonth.getDate()
            ) {
                todayDate.setDate(todayDate.getDate() + 1);
            }

            let optionsWithDate = {
                startdate: startOfMonth.toISOString().slice(0, 10),
                enddate: todayDate.toISOString().slice(0, 10),
                authorization: `Bearer ${authResponse.data.token}`,
            };

            axios
                .all([
                    axios.get(`${process.env.INTERNAL_API_URL}/cache/github`, options),
                    axios.get(`${process.env.INTERNAL_API_URL}/cache/slack`, options),
                    axios.get(`${process.env.INTERNAL_API_URL}/community/github`, {
                        headers: optionsWithDate,
                    }),
                    axios.get(`${process.env.INTERNAL_API_URL}/community/slack`, {
                        headers: optionsWithDate,
                    }),
                ])
                .then(
                    axios.spread(async (...responses) => {
                        let slackData = responses[1].data;
                        slackData.participants['today'] = responses[3].data.participants;
                        slackData.channels['today'] = responses[3].data.channels;
                        slackData.messages['today'] = responses[3].data.messages;
                        slackData.replies['today'] = responses[3].data.replies;

                        let gitData = responses[0].data;
                        gitData.prs['today'] = responses[2].data.prs;
                        gitData.repos['today'] = responses[2].data.repos;
                        gitData.issues['today'] = responses[2].data.issues;
                        gitData.submitters['today'] = responses[2].data.issueSubmitters;

                        res.render('community', {
                            slack: slackData,
                            git: gitData,
                        });
                    })
                )
                .catch((err) => {
                    next(err);
                });
        });
};

exports.showAnalytics = (req, res) => {
    axios
        .get(`${process.env.INTERNAL_API_URL}/auth`, {
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
            if (req.query.s) {
                options.headers.startdate = req.query.s;
            }
            if (req.query.e) {
                options.headers.enddate = req.query.e;
            }
            axios.get(`${process.env.INTERNAL_API_URL}/analytics/geo`, options).then((resp) => {
                res.render('analytics', {
                    geo: resp.data,
                });
            });
        });
};

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

const convertToK = (data) => {
    data = parseFloat(data);
    if (data > 1000) {
        data = data / 1000;
    }
    return `${data.toFixed(2)}K`;
};
