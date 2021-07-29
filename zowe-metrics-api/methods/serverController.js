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

let cachedServerData;
let cachedServerTime;

exports.getServer = async (req, res) => {
    if (cachedServerTime && cachedServerTime > Date.now() - 60 * 1000 * 10) {
        return res.json(cachedServerData);
    } else {
        const spreadsheet = await getSpreadsheetData();
        let totalBinaryDownloads = 0;
        let totalSMPEDownloads = 0;
        for (let val of Object.values(spreadsheet.downloads.zoweBinary)) {
            totalBinaryDownloads += parseInt(val);
        }
        for (let val of Object.values(spreadsheet.downloads.zoweSMPE)) {
            totalSMPEDownloads += parseInt(val);
        }

        cachedServerData = {
            smpe: totalSMPEDownloads,
            binary: totalBinaryDownloads,
            downloads: totalBinaryDownloads + totalSMPEDownloads,
        };
        cachedServerTime = Date.now();

        res.json(cachedServerData);
    }
};
