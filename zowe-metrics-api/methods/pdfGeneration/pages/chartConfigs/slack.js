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

exports.getSlackTableBody = (data, date) => {
    return [
        [{ text: `Statistic from ${date.slice(4)}` }, { text: ' ' }],
        [
            { text: 'Participants' },
            {
                text: `${data.participants[date]}`,
            },
        ],
        [
            { text: 'Channels' },
            {
                text: `${data.channels[date]}`,
            },
        ],
        [
            { text: 'Messages' },
            {
                text: `${data.messages[date]}`,
            },
        ],
        [
            { text: 'Replies' },
            {
                text: `${data.replies[date]}`,
            },
        ],
    ];
};

exports.getSlackGraphConfig = (data) => {
    let lbls = [];
    for (let date of Object.keys(data.participants)) {
        lbls.push(date.slice(4));
    }
    return {
        type: 'line',
        data: {
            labels: lbls,
            datasets: [
                {
                    label: 'Participants',
                    data: Object.values(data.participants),
                    backgroundColor: '#FF6B6B',
                    borderColor: '#FF6B6B',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'Channels',
                    data: Object.values(data.channels),
                    backgroundColor: '#73D2DE',
                    borderColor: '#73D2DE',
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
                            fontSize: 13,
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

exports.getSlackGraphConfigTwo = (data) => {
    let lbls = [];
    for (let date of Object.keys(data.participants)) {
        lbls.push(date.slice(4));
    }
    return {
        type: 'line',
        data: {
            labels: lbls,
            datasets: [
                {
                    label: 'Messages',
                    data: Object.values(data.messages),
                    backgroundColor: '#D81159',
                    borderColor: '#D81159',
                    fill: false,
                    borderWidth: 1,
                },
                {
                    label: 'Replies',
                    data: Object.values(data.replies),
                    backgroundColor: '#292F36',
                    borderColor: '#292F36',
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
                            fontSize: 13,
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
