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

let colours = ['rgb(66, 135, 245)', 'rgb(242, 65, 118)', 'rgb(217, 191, 0)', 'rgb(2, 173, 30)'];

const displayGit = (gitData) => {
    let githubGraphContainerOne = document.getElementById('githubGraph1').getContext('2d');
    let githubGraphContainerTwo = document.getElementById('githubGraph2').getContext('2d');

    let githubGraphConfig1 = {
        type: 'line',
        data: {
            labels: Object.keys(gitData.prs),
            datasets: [
                {
                    label: 'Pull Requests',
                    backgroundColor: colours[0],
                    borderColor: colours[0],
                    data: Object.values(gitData.prs),
                    fill: false,
                },
                {
                    label: 'Issues',
                    backgroundColor: colours[2],
                    borderColor: colours[2],
                    data: Object.values(gitData.issues),
                    fill: false,
                },
            ],
        },
        options: {},
    };

    let githubGraphConfig2 = {
        type: 'line',
        data: {
            labels: Object.keys(gitData.issues),
            datasets: [
                {
                    label: 'Repositories',
                    backgroundColor: colours[1],
                    borderColor: colours[1],
                    data: Object.values(gitData.repos),
                    fill: false,
                },
                {
                    label: 'Submitters',
                    backgroundColor: colours[3],
                    borderColor: colours[3],
                    data: Object.values(gitData.submitters),
                    fill: false,
                },
            ],
        },
        options: {},
    };
    let githubChart1 = new Chart(githubGraphContainerOne, githubGraphConfig1);
    let githubChart2 = new Chart(githubGraphContainerTwo, githubGraphConfig2);

    let githubMonths = Object.keys(gitData.prs);
    let gitTopCorner = document.createElement('th');
    gitTopCorner.innerText = 'Month';
    document.getElementById('githubTH').appendChild(gitTopCorner);

    let prHeader = document.createElement('th');
    prHeader.innerText = 'PRs';
    document.getElementById('githubTDPRs').appendChild(prHeader);

    let issuesHeader = document.createElement('th');
    issuesHeader.innerText = 'Issues';
    document.getElementById('githubTDIssues').appendChild(issuesHeader);

    let reposHeader = document.createElement('th');
    reposHeader.innerText = 'Repos';
    document.getElementById('githubTDRepos').appendChild(reposHeader);

    let submittersHeader = document.createElement('th');
    submittersHeader.innerText = 'Submitters';
    document.getElementById('githubTDSubmitters').appendChild(submittersHeader);

    for (let i = githubMonths.length - 8 >= 0 ? githubMonths.length - 8 : 0; i < githubMonths.length; i++) {
        let th = document.createElement('th');
        th.innerText =
            githubMonths[i] === `today`
                ? `Today`
                : `${githubMonths[i].split(' ')[0].slice(0, 3)} ${githubMonths[i].split(' ')[1]}`;
        document.getElementById('githubTH').appendChild(th);

        let gittd1 = document.createElement('td');
        gittd1.innerText = gitData.prs[githubMonths[i]];
        document.getElementById('githubTDPRs').appendChild(gittd1);

        let gittd2 = document.createElement('td');
        gittd2.innerText = gitData.issues[githubMonths[i]];
        document.getElementById('githubTDIssues').appendChild(gittd2);

        let gittd3 = document.createElement('td');
        gittd3.innerText = gitData.repos[githubMonths[i]];
        document.getElementById('githubTDRepos').appendChild(gittd3);

        let gittd4 = document.createElement('td');
        gittd4.innerText = gitData.submitters[githubMonths[i]];
        document.getElementById('githubTDSubmitters').appendChild(gittd4);
    }
};

const displaySlack = (slackData) => {
    let slackGraphContainerOne = document.getElementById('slackGraph1').getContext('2d');
    let slackGraphContainerTwo = document.getElementById('slackGraph2').getContext('2d');

    let slackGraphConfig1 = {
        type: 'line',
        data: {
            labels: Object.keys(slackData.channels),
            datasets: [
                {
                    label: 'Channels',
                    backgroundColor: colours[0],
                    borderColor: colours[0],
                    data: Object.values(slackData.channels),
                    fill: false,
                },
                {
                    label: 'Participants',
                    backgroundColor: colours[1],
                    borderColor: colours[1],
                    data: Object.values(slackData.participants),
                    fill: false,
                },
            ],
        },
        options: {},
    };

    let slackGraphConfig2 = {
        type: 'line',
        data: {
            labels: Object.keys(slackData.messages),
            datasets: [
                {
                    label: 'Messages',
                    backgroundColor: colours[2],
                    borderColor: colours[2],
                    data: Object.values(slackData.messages),
                    fill: false,
                },
                {
                    label: 'Replies',
                    backgroundColor: colours[3],
                    borderColor: colours[3],
                    data: Object.values(slackData.replies),
                    fill: false,
                },
            ],
        },
        options: {},
    };
    let slackChart1 = new Chart(slackGraphContainerOne, slackGraphConfig1);
    let slackChart2 = new Chart(slackGraphContainerTwo, slackGraphConfig2);

    let slackMonths = Object.keys(slackData.channels);
    let topCorner = document.createElement('th');
    topCorner.innerText = 'Month';
    document.getElementById('slackTH').appendChild(topCorner);

    let channelHeader = document.createElement('th');
    channelHeader.innerText = 'Channels';
    document.getElementById('slackTDChannels').appendChild(channelHeader);

    let participantsHeader = document.createElement('th');
    participantsHeader.innerText = 'Participants';
    document.getElementById('slackTDParticipants').appendChild(participantsHeader);

    let messagesHeader = document.createElement('th');
    messagesHeader.innerText = 'Messages';
    document.getElementById('slackTDMessages').appendChild(messagesHeader);

    let repliesHeader = document.createElement('th');
    repliesHeader.innerText = 'Replies';
    document.getElementById('slackTDReplies').appendChild(repliesHeader);

    for (let i = slackMonths.length - 8 >= 0 ? slackMonths.length - 8 : 0; i < slackMonths.length; i++) {
        let th = document.createElement('th');
        th.innerText =
            slackMonths[i] === `today`
                ? `Today`
                : `${slackMonths[i].split(' ')[0].slice(0, 3)} ${slackMonths[i].split(' ')[1]}`;
        document.getElementById('slackTH').appendChild(th);

        let td1 = document.createElement('td');
        td1.innerText = slackData.channels[slackMonths[i]];
        document.getElementById('slackTDChannels').appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerText = slackData.participants[slackMonths[i]];
        document.getElementById('slackTDParticipants').appendChild(td2);

        let td3 = document.createElement('td');
        td3.innerText = slackData.messages[slackMonths[i]];
        document.getElementById('slackTDMessages').appendChild(td3);

        let td4 = document.createElement('td');
        td4.innerText = slackData.replies[slackMonths[i]];
        document.getElementById('slackTDReplies').appendChild(td4);
    }
};

const hash = document.location.hash;
if (hash && hash.length > 0 && hash === `#slack`) {
    document.getElementById('slack').classList.add('show', 'active');
    document.getElementById('slack-tab').classList.add('active');

    document.getElementById('github').classList.remove('show', 'active');
    document.getElementById('github-tab').classList.remove('active');
} else if (hash && hash.length > 0 && hash === `#github`) {
    document.getElementById('github').classList.add('show', 'active');
    document.getElementById('github-tab').classList.add('active');

    document.getElementById('slack').classList.remove('show', 'active');
    document.getElementById('slack-tab').classList.remove('active');
}
