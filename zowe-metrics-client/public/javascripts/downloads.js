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

const dateToString = (dt) => {
    if (dt.toUpperCase() === `TODAY`) {
        return `Today`;
    }

    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let date = new Date(dt);
    return `${date.getDate()}${
        date.getDate() % 10 == 1 && date.getDate() != 11
            ? 'st'
            : date.getDate() % 10 == 2 && date.getDate() != 12
            ? 'nd'
            : date.getDate() % 10 == 3 && date.getDate() != 13
            ? 'rd'
            : 'th'
    } ${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
};

const displayExplorerData = (explorerDownloadObject) => {
    let explorerGraphContainer = document.getElementById('explorerGraph').getContext('2d');
    let explorerDifferenceGraph = document.getElementById('explorerDifferenceGraph').getContext('2d');

    let lbls = [];
    for (const dt of Object.keys(explorerDownloadObject)) {
        lbls.push(dateToString(dt));
    }

    let expChart = new Chart(explorerGraphContainer, {
        type: 'line',
        data: {
            labels: lbls,
            datasets: [
                {
                    label: 'Explorer Cumulative Downloads',
                    backgroundColor: 'rgb(218, 0, 0)',
                    borderColor: 'rgb(218, 0, 0)',
                    data: Object.values(explorerDownloadObject),
                    fill: false,
                },
            ],
        },
        options: {},
    });

    let expDiffChart = new Chart(explorerDifferenceGraph, {
        type: 'bar',
        data: {
            labels: Object.keys(getExplorerDifferences(explorerDownloadObject)),
            datasets: [
                {
                    label: 'Explorer Downloads per Month',
                    backgroundColor: 'rgb(218, 0, 0)',
                    borderColor: 'rgb(218, 0, 0)',
                    data: Object.values(getExplorerDifferences(explorerDownloadObject)),
                },
            ],
        },
        options: {},
    });
};

const getExplorerDifferences = (vscode_marketplace_monthly) => {
    let keys = Object.keys(vscode_marketplace_monthly);
    let vals = Object.values(vscode_marketplace_monthly);
    let toReturn = {};
    for (let i = 0; i < keys.length - 1; i++) {
        toReturn[dateToString(keys[i]).slice(4)] = parseInt(vals[i + 1]) - parseInt(vals[i]);
    }
    return toReturn;
};

const displayServerData = (serverDownloadObject) => {
    let serverGraphContainer = document.getElementById('serverGraph').getContext('2d');
    let serverDiffGraphContainer = document.getElementById('serverDiffGraph').getContext('2d');

    let lbls = [];
    for (const dt of Object.keys(serverDownloadObject)) {
        lbls.push(dateToString(dt));
    }

    let expChart = new Chart(serverGraphContainer, {
        type: 'line',
        data: {
            labels: lbls,
            datasets: [
                {
                    label: 'Server-side Cumulative Downloads',
                    backgroundColor: 'rgb(0, 0, 172)',
                    borderColor: 'rgb(0, 0, 172)',
                    data: Object.values(serverDownloadObject),
                    fill: false,
                },
            ],
        },
        options: {},
    });

    let expDiffChart = new Chart(serverDiffGraphContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(getServerDifferences(serverDownloadObject)),
            datasets: [
                {
                    label: 'Server-side Downloads per Month',
                    backgroundColor: 'rgb(0, 0, 172)',
                    borderColor: 'rgb(0, 0, 172)',
                    data: Object.values(getServerDifferences(serverDownloadObject)),
                },
            ],
        },
        options: {},
    });
};

const getServerDifferences = (data) => {
    let keys = Object.keys(data);
    let vals = Object.values(data);
    let toReturn = {};
    for (let i = 0; i < keys.length - 1; i++) {
        toReturn[dateToString(keys[i]).slice(4)] = parseInt(vals[i + 1]) - parseInt(vals[i]);
    }
    return toReturn;
};

const displayCLIData = (cliDownloadObject) => {
    let cliGraphContainer = document.getElementById('cliGraph').getContext('2d');
    let cliDiffGraphContainer = document.getElementById('cliDiffGraph').getContext('2d');

    let lbls = [];
    for (const dt of Object.keys(cliDownloadObject)) {
        lbls.push(dateToString(dt));
    }

    let expChart = new Chart(cliGraphContainer, {
        type: 'line',
        data: {
            labels: lbls,
            datasets: [
                {
                    label: 'CLI Cumulative Downloads',
                    backgroundColor: 'rgb(0, 144, 14)',
                    borderColor: 'rgb(0, 144, 14)',
                    data: Object.values(cliDownloadObject),
                    fill: false,
                },
            ],
        },
        options: {},
    });

    let expDiffChart = new Chart(cliDiffGraphContainer, {
        type: 'bar',
        data: {
            labels: Object.keys(getCLIDifferences(cliDownloadObject)),
            datasets: [
                {
                    label: 'CLI Downloads per Month',
                    backgroundColor: 'rgb(0, 144, 14)',
                    borderColor: 'rgb(0, 144, 14)',
                    data: Object.values(getCLIDifferences(cliDownloadObject)),
                },
            ],
        },
        options: {},
    });
};

const getCLIDifferences = (data) => {
    let keys = Object.keys(data);
    let vals = Object.values(data);
    let toReturn = {};
    for (let i = 0; i < keys.length - 1; i++) {
        toReturn[dateToString(keys[i]).slice(4)] = parseInt(vals[i + 1]) - parseInt(vals[i]);
    }
    return toReturn;
};

const hash = document.location.hash;
if (hash && hash.length > 0 && hash === `#server`) {
    document.getElementById('server').classList.add('show', 'active');
    document.getElementById('server-tab').classList.add('active');

    document.getElementById('cli').classList.remove('show', 'active');
    document.getElementById('explorer').classList.remove('show', 'active');

    document.getElementById('cli-tab').classList.remove('active');
    document.getElementById('explorer-tab').classList.remove('active');
} else if (hash && hash.length > 0 && hash === `#explorer`) {
    document.getElementById('explorer').classList.add('show', 'active');
    document.getElementById('explorer-tab').classList.add('active');

    document.getElementById('server').classList.remove('show', 'active');
    document.getElementById('cli').classList.remove('show', 'active');

    document.getElementById('cli-tab').classList.remove('active');
    document.getElementById('server-tab').classList.remove('active');
} else if (hash && hash.length > 0 && hash === `#cli`) {
    document.getElementById('cli').classList.add('show', 'active');
    document.getElementById('cli-tab').classList.add('active');

    document.getElementById('server').classList.remove('show', 'active');
    document.getElementById('explorer').classList.remove('show', 'active');

    document.getElementById('server-tab').classList.remove('active');
    document.getElementById('explorer-tab').classList.remove('active');
}
