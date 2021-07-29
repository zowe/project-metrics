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
const axios = require('axios');

router.get('/slack', (req, res) => {
    const dates = getDates(req.headers);

    axios
        .get(
            `https://metrics.lfanalytics.io/v1/project/open-mainframe-project-zowe/chat_room?from=${dates.startdate}&to=${dates.enddate}&period=1d&projectType=_`
        )
        .then((returned) => {
            const slackData = returned.data.slack;
            return res.status(200).json({
                channels: parseInt(slackData.channels.count),
                messages: parseInt(slackData.messages.count),
                participants: parseInt(slackData.participants.count),
                reactions: parseInt(slackData.reactions.count),
                replies: parseInt(slackData.replies.count),
            });
        });
});

router.get('/github', (req, res) => {
    const dates = getDates(req.headers);

    axios
        .all([
            axios.get(
                `https://metrics.lfanalytics.io/v1/project/open-mainframe-project-zowe/pull_request_management?from=${dates.startdate}&to=${dates.enddate}&period=1d&projectType=_`
            ),
            axios.get(
                `https://metrics.lfanalytics.io/v1/project/open-mainframe-project-zowe/issue_management?from=${dates.startdate}&to=${dates.enddate}&period=1d&projectType=_`
            ),
            axios.get(
                `https://metrics.lfanalytics.io/v1/project/open-mainframe-project-zowe/commits?from=${dates.startdate}&to=${dates.enddate}&period=1d&projectType=_`
            ),
        ])
        .then(
            axios.spread(async (...responses) => {
                const prData = responses[0].data;
                const issueData = responses[1].data;
                const commitData = responses[2].data;
                return res.status(200).json({
                    issues: parseInt(issueData.github_issues.issues.count),
                    issueSubmitters: parseInt(issueData.github_issues.submitters.count),
                    prs: parseInt(prData.github_pull_requests.pull_requests.count),
                    repos: parseInt(commitData.repositories.count),
                });
            })
        );
});

const getDates = (headers) => {
    let firstOfThisMonth = new Date();
    firstOfThisMonth.setDate(1);

    let firstOfLastMonth = new Date();
    firstOfLastMonth.setMonth(firstOfLastMonth.getMonth() - 1);
    firstOfLastMonth.setDate(1);

    let startDate = headers.startdate ? headers.startdate : firstOfLastMonth.toISOString().slice(0, 10);
    let endDate = headers.enddate ? headers.enddate : firstOfThisMonth.toISOString().slice(0, 10);

    return {
        startdate: new Date(startDate).getTime(),
        enddate: new Date(endDate).getTime(),
    };
};

module.exports = router;
