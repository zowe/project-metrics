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

const { GoogleSpreadsheet } = require('google-spreadsheet');

const loadData = async () => {
    let doc = new GoogleSpreadsheet(`${process.env.SPREADSHEET_ID}`);
    await doc.useServiceAccountAuth(require(`../${process.env.CONFIG_DETAILS_FILE}`));
    await doc.loadInfo();
    return doc;
};

exports.getSpreadsheetData = async () => {
    let results = {};
    results.downloads = {};

    let doc = await loadData();

    const overviewSheet = doc.sheetsById[0];
    await overviewSheet.loadCells('A1:A2');
    results.cumulativeDownloads = overviewSheet.getCellByA1('A1').value;
    results.cumulativePageViews = overviewSheet.getCellByA1('A2').value;

    let today = new Date();
    today.setHours(2);

    let startDate = new Date(2018, 07, 01);
    startDate.setHours(2);

    const downloadsSheet = doc.sheetsById[process.env.DOWNLOAD_SHEET_ID];
    await downloadsSheet.loadCells('B5');
    let totalVersions = parseInt(downloadsSheet.getCellByA1('B5').value);
    await downloadsSheet.loadCells(`A16:B${15 + totalVersions}`);

    let zoweCLI = {};
    let zoweBinary = {};
    let zoweHash = {};
    let zowePlugins = {};
    let zoweSMPE = {};

    for (let i = 16; i <= 15 + totalVersions; i++) {
        let name = downloadsSheet.getCellByA1('A' + i.toString()).value;
        let val = downloadsSheet.getCellByA1('B' + i.toString()).value;

        if (name.slice(0, 16) == 'Zowe Binary Hash') {
            if (name.length === 22 || name.length === 23) {
                zoweHash[name] = val;
            }
        } else if (name.slice(0, 21) == 'Zowe Binary Signature') {
        } else if (name.slice(0, 11) == 'Zowe Binary') {
            if (name.length === 17 || name.length === 18) {
                if (name.slice(-1) !== '2') {
                    zoweBinary[name] = val;
                }
            }
        } else if (name.slice(0, 16) == 'Zowe CLI Plugins') {
            zowePlugins[name] = val;
        } else if (name.slice(0, 8) == 'Zowe CLI') {
            if (name.length === 14 || name.length === 15) {
                zoweCLI[name] = val;
            }
        } else if (name.slice(0, 9) == 'Zowe SMPE') {
            zoweSMPE[name] = val;
        }
    }

    results.downloads.zowePlugins = zowePlugins;
    results.downloads.zoweBinary = zoweBinary;
    results.downloads.zoweHash = zoweHash;
    results.downloads.zoweSMPE = zoweSMPE;
    results.downloads.zoweCLI = zoweCLI;

    return results;
};
