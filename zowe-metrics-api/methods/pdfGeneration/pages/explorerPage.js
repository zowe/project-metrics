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
    getExplorerTableBody,
    getExplorerChartConfig,
    getExplorerDifferencesTableBody,
    getExplorerDifferencesChartConfig,
} = require('./chartConfigs/explorer');

exports.explorerPage = async (data) => {
    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                text: `Zowe Explorer`,
                                style: 'DownloadTitle',
                            },
                            {
                                text: `These are the download figures for the Zowe Explorer, available on the VSCode Marketplace.`,
                                margin: [0, 10, 0, 0],
                            },
                            {
                                text: [
                                    `Cumulative Downloads: `,
                                    {
                                        text: `${data.cumulative.explorer.downloads}`,
                                        style: {
                                            bold: true,
                                            fontSize: 13,
                                        },
                                    },
                                ],
                                margin: [0, 10, 0, 10],
                            },
                            {
                                text: `This table and graph shows the cumulative figures up to the date specified.`,
                                margin: [0, 0, 0, 20],
                            },
                            {
                                table: {
                                    widths: '*',
                                    body: getExplorerTableBody(data.cache.explorer.downloads),
                                },
                                layout: 'lightHorizontalLines',
                                style: { fontSize: 8, alignment: 'center', bold: true },
                            },
                            {
                                image: await mkChart(getExplorerChartConfig(data.cache.explorer.downloads), 900, 350),
                                // width: 450,
                                fit: [500, 220],
                                alignment: 'center',
                                margin: [0, 10, 0, 0],
                            },
                            {
                                text: `This table and graph shows the downloads for each month individually.`,
                                margin: [0, 30, 0, 20],
                            },
                            {
                                table: {
                                    widths: '*',
                                    body: getExplorerDifferencesTableBody(data.cache.explorer.downloads),
                                },
                                layout: 'lightHorizontalLines',
                                style: { fontSize: 8, alignment: 'center', bold: true },
                            },
                            {
                                image: await mkChart(
                                    getExplorerDifferencesChartConfig(data.cache.explorer.downloads),
                                    900,
                                    350
                                ),
                                // width: 450,
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
