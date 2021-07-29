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
const { getBinaryChartConfig, getVersionsTable } = require('./chartConfigs/binary');

exports.binaryPage = async (data) => {
    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                text: `Zowe Convenience Build`,
                                style: 'DownloadTitle',
                            },
                            {
                                text: `These are the download figures for the Zowe Convenience Build.`,
                                margin: [15, 10, 15, 0],
                            },
                            {
                                text: [
                                    `Cumulative Downloads: `,
                                    {
                                        text: `${data.cumulative.server.binary}`,
                                        style: {
                                            bold: true,
                                            fontSize: 13,
                                        },
                                    },
                                ],
                                margin: [15, 10, 15, 10],
                            },
                            {
                                text: `This table shows the number of downloads for the specific versions of Zowe Convenience Build from the Zowe.org Downloads page.`,
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
                                text: `This graph demonstrates the cumulative downloads of Zowe Convenience Build from the Zowe.org downloads page. The table showing these values can be seen on the next page`,
                                margin: [15, 10, 15, 10],
                            },
                            {
                                image: await mkChart(getBinaryChartConfig(data.cache.server.binary), 900, 350),
                                fit: [500, 220],
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
