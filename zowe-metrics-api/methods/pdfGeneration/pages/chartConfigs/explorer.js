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

exports.getExplorerTableBody = (monthly) => {
    let k = Object.keys(monthly);
    let v = Object.values(monthly);
    let res = {};
    for (let i = k.length > 8 ? k.length - 8 : 0; i < k.length; i++) {
        res[k[i]] = v[i];
    }
    return [Object.keys(res), Object.values(res)];
};

exports.getExplorerChartConfig = (monthly) => {
    return {
        type: 'line',
        data: {
            labels: Object.keys(monthly),
            datasets: [
                {
                    label: 'Explorer Cumulative Downloads',
                    data: Object.values(monthly),
                    backgroundColor: '#f74a3ea1',
                    borderColor: '#f74a3ea1',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            legend: {
                labels: {
                    fontColor: 'Black',
                    fontSize: 14,
                },
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            fontColor: 'Black',
                            fontSize: 12,
                            stepSize: 5000,
                            //   beginAtZero: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            fontColor: 'Black',
                            fontSize: 12,
                        },
                    },
                ],
            },
        },
    };
};

const getExplorerDifferences = (monthly) => {
    let keys = Object.keys(monthly);
    let vals = Object.values(monthly);
    let toReturn = {};
    for (let i = 0; i < keys.length - 1; i++) {
        toReturn[keys[i].slice(4)] = parseInt(vals[i + 1]) - parseInt(vals[i]);
    }
    return toReturn;
};

exports.getExplorerDifferencesTableBody = (monthly) => {
    let diffs = getExplorerDifferences(monthly);
    return [Object.keys(diffs), Object.values(diffs)];
};

exports.getExplorerDifferencesChartConfig = (monthly) => {
    let diffs = getExplorerDifferences(monthly);
    return {
        type: 'bar',
        data: {
            labels: Object.keys(diffs),
            datasets: [
                {
                    label: 'Explorer Downloads Per Month',
                    data: Object.values(diffs),
                    backgroundColor: '#f74a3ea1',
                    borderColor: '#f74a3ea1',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            legend: {
                labels: {
                    fontColor: 'Black',
                    fontSize: 14,
                },
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            fontColor: 'Black',
                            fontSize: 12,
                            stepSize: 1000,
                            beginAtZero: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            fontColor: 'Black',
                            fontSize: 12,
                        },
                    },
                ],
            },
        },
    };
};
