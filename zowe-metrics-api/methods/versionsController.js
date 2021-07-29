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

const { getSpreadsheetData } = require('../methods/getSpreadsheetData');

let cachedVersionData;
let cachedVersionTime;

exports.getVersions = async (req, res) => {
    if (cachedVersionTime && cachedVersionTime > Date.now() - 60 * 1000 * 10) {
        return res.json(cachedVersionData);
    } else {
        let spreadsheet = await getSpreadsheetData();
        cachedVersionData = spreadsheet.downloads;
        cachedVersionTime = Date.now();

        let obj = {
            zoweBinary: getSortedObject('zoweBinary'),
            zoweSMPE: getSortedObject('zoweSMPE'),
            zoweCLI: getSortedObject('zoweCLI'),
        };

        cachedVersionData.sorted = obj;

        res.json(cachedVersionData);
    }
};

const getSortedObject = (product) => {
    let labels = Object.keys(cachedVersionData[product]);
    let cliVersionNumbers = [];
    for (lbl of labels) {
        cliVersionNumbers.push({
            version: `${lbl.split(' ')[2].split('.')[0]}.${lbl.split(' ')[2].split('.')[1]}.${lbl
                .split(' ')[2]
                .split('.')[2]
                .slice(0, 1)}`,
            value: cachedVersionData[product][lbl],
        });
    }

    let sortedArr = cliVersionNumbers.sort((a, b) => {
        let aVersion = a.version.split('.')[1];
        let bVersion = b.version.split('.')[1];
        if (aVersion === bVersion) {
            return b.version.split('.')[2] - a.version.split('.')[2];
        }
        return bVersion - aVersion;
    });

    let finalObj = {};
    for (ver of sortedArr) {
        finalObj[ver.version] = ver.value;
    }

    return finalObj;
};
