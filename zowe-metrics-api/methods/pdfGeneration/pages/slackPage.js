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

const { pageLayoutPicture, mkChart } = require('./styles');
const { getSlackTableBody, getSlackGraphConfig, getSlackGraphConfigTwo } = require('./chartConfigs/slack');

exports.slackPage = async (data) => {
    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                text: 'OMP Slack Workspace Community Metrics',
                                style: 'DownloadTitle',
                                margin: [0, 0, 0, 20],
                            },
                            {
                                table: {
                                    widths: '*',
                                    body: getSlackTableBody(data.cache.slack, data.commDate),
                                },
                                layout: 'lightHorizontalLines',
                                style: { alignment: 'center' },
                            },
                            {
                                image: await mkChart(getSlackGraphConfig(data.cache.slack), 900, 350),
                                // width: 450,
                                fit: [500, 220],
                                alignment: 'center',
                                margin: [0, 20, 0, 20],
                            },
                            {
                                image: await mkChart(getSlackGraphConfigTwo(data.cache.slack), 900, 350),
                                // width: 450,
                                fit: [500, 220],
                                alignment: 'center',
                                margin: [0, 20, 0, 0],
                            },
                        ],
                    },
                ],
            ],
        },
        layout: pageLayoutPicture(),
        pageBreak: 'after',
    };

    return content;
};
