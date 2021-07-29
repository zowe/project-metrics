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
const {
    getCLITableBody,
    getCLIChartConfig,
    getCLIDifferencesTableBody,
    getCLIDifferencesChartConfig,
    getVersionsTable,
} = require('./chartConfigs/cli');

exports.cliPage = async (data) => {
    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                text: `Zowe CLI`,
                                style: 'DownloadTitle',
                            },
                            {
                                text: `These are the download figures for the Zowe CLI from the NPM Registry and Zowe.org Downloads page.`,
                                margin: [15, 10, 15, 0],
                            },
                            {
                                text: [
                                    `Cumulative Downloads: `,
                                    {
                                        text: `${data.cumulative.cli.downloads}`,
                                        style: {
                                            bold: true,
                                            fontSize: 13,
                                        },
                                    },
                                ],
                                margin: [15, 10, 15, 20],
                            },
                            {
                                text: `This table shows the number of downloads for the specific versions of Zowe CLI from Zowe.org Downloads page only. The majority of downloads are from the NPM Registry`,
                                margin: [15, 0, 15, 20],
                            },
                            {
                                table: {
                                    widths: ['*', '*', 40, '*', '*'],
                                    body: getVersionsTable(data),
                                },
                                layout: 'lightHorizontalLines',
                                margin: [0, 0, 0, 30],
                            },
                            {
                                text: `This graph demonstrates the cumulative downloads of Zowe CLI collectively from the Zowe.org downloads page and the NPM Registry. The table showing these values can be seen on the next page`,
                                margin: [15, 10, 15, 10],
                            },
                            {
                                image: await mkChart(getCLIChartConfig(data.cache.cli.downloads), 900, 350),
                                fit: [500, 250],
                                alignment: 'center',
                                margin: [0, 10, 0, 0],
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
