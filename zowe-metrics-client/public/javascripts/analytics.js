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

let colours = ['rgb(29,53,87)', 'rgb(69,123,157)'];

const get_month_string = (dt) => {
    var months = [
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
    return months[dt.getMonth()];
};

const english_ordinal_suffix = (dt) => {
    return (
        dt.getDate() +
        (dt.getDate() % 10 == 1 && dt.getDate() != 11
            ? 'st'
            : dt.getDate() % 10 == 2 && dt.getDate() != 12
            ? 'nd'
            : dt.getDate() % 10 == 3 && dt.getDate() != 13
            ? 'rd'
            : 'th')
    );
};

const displayAnalyticsData = (data) => {
    let geoGraphContainer = document.getElementById('geoGraph').getContext('2d');
    let labelArray = [];
    let usersArray = [];
    let newUsersArray = [];

    let maxIndex = data.rows.length - 1;

    if (maxIndex > 9) {
        maxIndex = 9;
    }

    for (let i = 0; i <= maxIndex; i++) {
        labelArray.push(`${data.rows[i][0]}`);
        usersArray.push(`${data.rows[i][1]}`);
        newUsersArray.push(`${data.rows[i][2]}`);
    }
    let geoConfig = {
        type: 'horizontalBar',
        data: {
            labels: labelArray,
            datasets: [
                {
                    label: 'Users',
                    backgroundColor: colours[0],
                    borderColor: colours[0],
                    data: usersArray,
                    fill: false,
                },
                {
                    label: 'New Users',
                    backgroundColor: colours[1],
                    borderColor: colours[1],
                    data: newUsersArray,
                    fill: false,
                },
            ],
        },
    };
    let geoGraph = new Chart(geoGraphContainer, geoConfig);

    let table = document.getElementById('geoTable');
    table.innerHTML = `<tr>
  <th>Country</th>
  <th>Users</th>
  <th>New Users</th>
</tr>`;

    for (let row of data.rows) {
        let tblRow = document.createElement('tr');
        let country = document.createElement('td');
        country.innerText = row[0];

        let usrs = document.createElement('td');
        usrs.innerText = row[1];

        let nusrs = document.createElement('td');
        nusrs.innerText = row[2];

        tblRow.appendChild(country);
        tblRow.appendChild(usrs);
        tblRow.appendChild(nusrs);

        table.appendChild(tblRow);
    }
};

document.getElementById('refreshBtn').addEventListener('click', () => {
    let sDate = document.getElementById('startDateStore').value;
    let eDate = document.getElementById('endDateStore').value;

    if (eDate > sDate) {
        window.location.href = `https://www.metrics.zowe.org/analytics?s=${sDate}&e=${eDate}`;
    } else {
        alert('Start Date must be before End Date');
    }
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

/**
 * Setup start date picker
 */
const picker1 = new SimplePicker('#date1');
picker1.disableTimeSection();

picker1.on('submit', (dt, dtStr) => {
    document.getElementById('startDateStore').value = dt.toISOString().slice(0, 10);
    document.getElementById('startDate').value = `${english_ordinal_suffix(dt)} ${get_month_string(
        dt
    )} ${dt.getFullYear()}`;
});

let sDate;
if (urlParams.has('s')) {
    sDate = new Date(urlParams.get('s'));
} else {
    sDate = new Date();
    sDate.setDate(1);
}
picker1.reset(sDate);
document.getElementById('startDateStore').value = sDate.toISOString().slice(0, 10);
document.getElementById('startDate').value = `${english_ordinal_suffix(sDate)} ${get_month_string(
    sDate
)} ${sDate.getFullYear()}`;

/**
 * Setup end date picker
 */

const picker2 = new SimplePicker('#date2');
picker2.disableTimeSection();

picker2.on('submit', (dt, dtStr) => {
    document.getElementById('endDateStore').value = dt.toISOString().slice(0, 10);
    document.getElementById('endDate').value = `${english_ordinal_suffix(dt)} ${get_month_string(
        dt
    )} ${dt.getFullYear()}`;
});

let eDate;
if (urlParams.has('e')) {
    eDate = new Date(urlParams.get('e'));
} else {
    eDate = new Date();
}
picker2.reset(eDate);
document.getElementById('endDateStore').value = eDate.toISOString().slice(0, 10);
document.getElementById('endDate').value = `${english_ordinal_suffix(eDate)} ${get_month_string(
    eDate
)} ${eDate.getFullYear()}`;
