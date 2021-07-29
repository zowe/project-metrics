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
const cheerio = require('cheerio');

let cachedOMPData;
let cachedOMPTime;

exports.getOMP = (req, res) => {
    if (cachedOMPTime && cachedOMPTime > Date.now() - 60 * 1000 * 10) {
        return res.json(cachedOMPData);
    } else {
        const startDate = new Date(2019, 1, 1);
        const endDate = new Date();

        axios
            .all([
                axios.get(
                    `${
                        process.env.PR_MANAGEMENT_URL
                    }?from=${startDate.getTime()}&to=${endDate.getTime()}&period=1d&projectType=foundation`
                ),
                axios.get(
                    `${
                        process.env.ISSUE_MANAGEMENT_URL
                    }?from=${startDate.getTime()}&to=${endDate.getTime()}&period=1d&projectType=foundation`
                ),
            ])
            .then(async (response) => {
                let results = {};
                for (let i = 0; i < response.length; i++) {
                    results[response[i].config.url.slice(67, -69)] = response[i].data;
                }

                cachedOMPData = {
                    slackParticipants: parseInt(await getSlack()),
                    githubSubmittors: parseInt(results.issue_management.github_issues.submitters.count),
                    PRs: results.pull_request_management.github_pull_requests.pull_requests.count,
                    issues: results.issue_management.github_issues.issues.count,
                };
                cachedOMPTime = Date.now();

                res.json(cachedOMPData);
            });
    }
};

const getSlack = async () => {
    let url = `https://slack.openmainframeproject.org/`;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $('.total')[0].children[0].data;
};
