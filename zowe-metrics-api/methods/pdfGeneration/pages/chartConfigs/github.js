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

exports.getGitTableBody = (data, date) => {
    let d = [
        [{ text: `Statistic from ${date.slice(4)}` }, { text: ' ' }],
        [`Pull Requests`, `${data.prs[date]}`],
        [`Repositories`, `${data.repos[date]}`],
        [`Issues`, `${data.issues[date]}`],
        [`Submitters`, `${data.submitters[date]}`],
    ];
    return d;
};

exports.getGitGraphConfig = (data) => {
    let lbls = [];
    for (let date of Object.keys(data.prs)) {
        lbls.push(date.slice(4));
    }

    return {
        type: 'line',
        data: {
            labels: lbls,
            datasets: [
                {
                    label: 'Pull Requests',
                    data: Object.values(data.prs),
                    backgroundColor: '#FF6B6B',
                    borderColor: '#FF6B6B',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'Issues',
                    data: Object.values(data.issues),
                    backgroundColor: '#4ECDC4',
                    borderColor: '#4ECDC4',
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

exports.getGitGraphConfigTwo = (data) => {
    let lbls = [];
    for (let date of Object.keys(data.prs)) {
        lbls.push(date.slice(4));
    }

    return {
        type: 'line',
        data: {
            labels: lbls,
            datasets: [
                {
                    label: 'Repositories',
                    data: Object.values(data.repos),
                    backgroundColor: '#561F37',
                    borderColor: '#561F37',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'Submitters',
                    data: Object.values(data.submitters),
                    backgroundColor: '#FBB13C',
                    borderColor: '#FBB13C',
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
