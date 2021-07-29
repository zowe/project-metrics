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

exports.getPluginsChartConfig = (data) => {
    return {
        type: 'line',
        data: {
            labels: Object.keys(data.cics),
            datasets: [
                {
                    label: 'CICS',
                    data: Object.values(data.cics),
                    backgroundColor: '#2E86AB',
                    borderColor: '#2E86AB',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'DB2',
                    data: Object.values(data.db2),
                    backgroundColor: '#A23B72',
                    borderColor: '#A23B72',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'IMS',
                    data: Object.values(data.ims),
                    backgroundColor: '#F18F01',
                    borderColor: '#F18F01',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'MQ',
                    data: Object.values(data.mq),
                    backgroundColor: '#C73E1D',
                    borderColor: '#C73E1D',
                    borderWidth: 1,
                    fill: false,
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
                            fontSize: 14,
                            // stepSize: 100,
                            // beginAtZero: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            fontColor: 'Black',
                            fontSize: 14,
                            maxRotation: 30,
                            maxTicksLimit: 12,
                        },
                    },
                ],
            },
        },
    };
};
exports.getPluginsChartConfigTwo = (data) => {
    return {
        type: 'line',
        data: {
            labels: Object.keys(data.ftp),
            datasets: [
                {
                    label: 'FTP',
                    data: Object.values(data.ftp),
                    backgroundColor: '#3B1F2B',
                    borderColor: '#3B1F2B',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'SCS',
                    data: Object.values(data.scs),
                    backgroundColor: '#138A36',
                    borderColor: '#138A36',
                    borderWidth: 1,
                    fill: false,
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
                            fontSize: 14,
                            // stepSize: 100,
                            // beginAtZero: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            fontColor: 'Black',
                            fontSize: 14,
                            maxRotation: 30,
                            maxTicksLimit: 12,
                        },
                    },
                ],
            },
        },
    };
};
