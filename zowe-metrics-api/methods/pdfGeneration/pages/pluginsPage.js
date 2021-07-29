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
const { getPluginsChartConfig, getPluginsChartConfigTwo } = require('./chartConfigs/plugins');

exports.pluginsPage = async (data) => {
    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                text: `Zowe CLI Plugins`,
                                style: 'DownloadTitle',
                            },
                            {
                                text: `These graphs show the monthly downloads for the Core CLI Plugins from the NPM Registry.`,
                                margin: [15, 25, 15, 10],
                            },
                            {
                                text: `Note: The IMS and MQ plugin have very similar download values from February 2020 onwards, therefore the lines lie on top of one another.`,
                                margin: [15, 0, 15, 10],
                            },
                            {
                                image: await mkChart(getPluginsChartConfig(data.cache.plugins), 900, 350),
                                fit: [500, 300],
                                alignment: 'center',
                                margin: [0, 30, 0, 0],
                            },
                            {
                                image: await mkChart(getPluginsChartConfigTwo(data.cache.plugins), 900, 350),
                                fit: [500, 300],
                                alignment: 'center',
                                margin: [0, 40, 0, 0],
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
