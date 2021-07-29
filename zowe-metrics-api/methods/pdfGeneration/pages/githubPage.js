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
const { getGitTableBody, getGitGraphConfig, getGitGraphConfigTwo } = require('./chartConfigs/github');

exports.githubPage = async (data) => {
    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                text: 'Github Metrics',
                                style: 'DownloadTitle',
                                margin: [0, 0, 0, 10],
                            },
                            {
                                table: {
                                    widths: '*',
                                    body: getGitTableBody(data.cache.github, data.commDate),
                                },
                                layout: 'lightHorizontalLines',
                                style: { alignment: 'center' },
                            },
                            {
                                image: await mkChart(getGitGraphConfig(data.cache.github), 900, 350),
                                // width: 450,
                                fit: [500, 220],
                                alignment: 'center',
                                margin: [0, 20, 0, 20],
                            },
                            {
                                image: await mkChart(getGitGraphConfigTwo(data.cache.github), 900, 350),
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
