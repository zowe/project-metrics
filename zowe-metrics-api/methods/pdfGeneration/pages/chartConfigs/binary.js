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

exports.getBinaryTableBody = (monthly) => {
    let k = Object.keys(monthly);
    let v = Object.values(monthly);
    let res = {};
    for (let i = k.length > 8 ? k.length - 8 : 0; i < k.length; i++) {
        res[k[i]] = v[i];
    }
    return [Object.keys(res), Object.values(res)];
};

exports.getBinaryChartConfig = (monthly) => {
    return {
        type: 'line',
        data: {
            labels: Object.keys(monthly),
            datasets: [
                {
                    label: 'Binary Cumulative Downloads',
                    data: Object.values(monthly),
                    backgroundColor: '#170073a1',
                    borderColor: '#170073a1',
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
                            // stepSize: 5000,
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

const getBinaryDifferences = (monthly) => {
    let keys = Object.keys(monthly);
    let vals = Object.values(monthly);
    let toReturn = {};
    for (let i = keys.length > 9 ? keys.length - 8 : 0; i < keys.length - 1; i++) {
        toReturn[keys[i].slice(4)] = parseInt(vals[i + 1]) - parseInt(vals[i]);
    }
    return toReturn;
};

exports.getBinaryDifferencesTableBody = (monthly) => {
    let diffs = getBinaryDifferences(monthly);
    return [Object.keys(diffs), Object.values(diffs)];
};

exports.getBinaryDifferencesChartConfig = (monthly) => {
    let diffs = getBinaryDifferences(monthly);
    return {
        type: 'bar',
        data: {
            labels: Object.keys(diffs),
            datasets: [
                {
                    label: 'Binary Downloads Per Month',
                    data: Object.values(diffs),
                    backgroundColor: '#170073a1',
                    borderColor: '#170073a1',
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
                            // stepSize: 1000,
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

exports.getVersionsTable = (data) => {
    let cliVersions = Object.keys(data.versionDownloads.zoweBinary);
    let versionTableBody = [];
    let endIndex = 14;
    // cliVersions.length % 2 === 0 ? cliVersions.length : cliVersions.length - 1;
    versionTableBody.push([
        { text: `Version`, alignment: 'center', bold: true },
        { text: `Downloads`, alignment: 'center', bold: true },
        ` `,
        { text: `Version`, alignment: 'center', bold: true },
        { text: `Downloads`, alignment: 'center', bold: true },
    ]);

    for (let i = 0; i < endIndex; i += 2) {
        let row = [
            { text: `${cliVersions[i]}`, alignment: 'center', bold: true },
            {
                text: `${data.versionDownloads.zoweBinary[cliVersions[i]]}`,
                alignment: 'center',
            },
            ` `,
            { text: `${cliVersions[i + 1]}`, alignment: 'center', bold: true },
            {
                text: `${data.versionDownloads.zoweBinary[cliVersions[i + 1]]}`,
                alignment: 'center',
            },
        ];
        versionTableBody.push(row);
    }

    if (cliVersions.length % 2 !== 0) {
        versionTableBody.push([
            {
                text: `${cliVersions[cliVersions.length - 1]}`,
                alignment: 'center',
                bold: true,
            },
            {
                text: `${data.versionDownloads.zoweBinary[cliVersions[cliVersions.length - 1]]}`,
                alignment: 'center',
            },
            ` `,
            ` `,
            ` `,
        ]);
    }

    return versionTableBody;
};

exports.getBinaryDifferences = getBinaryDifferences;
