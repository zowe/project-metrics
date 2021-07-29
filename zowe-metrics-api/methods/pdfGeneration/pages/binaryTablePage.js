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
const { getBinaryDifferences, getBinaryDifferencesChartConfig } = require('./chartConfigs/binary');

exports.binaryTablePage = async (data) => {
    let cumulativeTableBody = [
        [
            {
                text: `Date`,
                alignment: 'center',
                bold: true,
            },
            {
                text: `Downloads to Date`,
                alignment: 'center',
                bold: true,
            },
        ],
    ];
    let dates = Object.keys(data.cache.server.binary);
    for (let i = dates.length - 0 < 0 ? 0 : dates.length - 8; i < dates.length; i++) {
        cumulativeTableBody.push([
            {
                text: `${dates[i]}`,
                alignment: 'center',
                bold: true,
            },
            {
                text: `${data.cache.server.binary[dates[i]]}`,
                alignment: 'center',
            },
        ]);
    }

    let monthlyTableBody = [
        [
            {
                text: `Month`,
                alignment: 'center',
                bold: true,
            },
            {
                text: `Downloads`,
                alignment: 'center',
                bold: true,
            },
        ],
    ];
    let monthlys = getBinaryDifferences(data.cache.server.binary);
    let dateLabels = Object.keys(monthlys);
    for (let i = 0; i < dateLabels.length; i++) {
        monthlyTableBody.push([
            {
                text: `${dateLabels[i]}`,
                alignment: 'center',
                bold: true,
            },
            {
                text: `${monthlys[dateLabels[i]]}`,
                alignment: 'center',
            },
        ]);
    }
    //   monthlyTableBody.push([` `, ` `]);

    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                text: `The two tables below track Zowe Convenience Build Downloads from the Zowe.org Downloads page. The graph on the left shows cumulative downloads to date, and the graph on the right shows these downloads monthly.`,
                                margin: [15, 25, 15, 10],
                            },
                            {
                                columns: [
                                    {
                                        width: '*',
                                        table: {
                                            widths: ['*', '*'],
                                            body: cumulativeTableBody,
                                        },
                                        layout: 'lightHorizontalLines',
                                    },
                                    {
                                        width: '*',
                                        table: {
                                            widths: ['*', '*'],
                                            body: monthlyTableBody,
                                        },
                                        layout: 'lightHorizontalLines',
                                    },
                                ],
                                columnGap: 20,
                                margin: [0, 0, 0, 20],
                            },
                            {
                                text: `This graph shows the monthly downloads detailed in the table above`,
                                margin: [15, 10, 15, 10],
                            },

                            {
                                image: await mkChart(
                                    getBinaryDifferencesChartConfig(data.cache.server.binary),
                                    900,
                                    350
                                ),
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
