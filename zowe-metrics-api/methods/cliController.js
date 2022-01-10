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
const { cumulativeNpmStats } = require('../methods/npmStatsData');

let cachedCLIData;
let cachedCLITime;

exports.getCLI = async (_, res) => {
    if (cachedCLITime && cachedCLITime > Date.now() - 60 * 1000 * 10) {
        return res.status(200).json(cachedCLIData);
    } else {
        let today = new Date();
        try {
            const totalDownloadsFromNPM = await cumulativeNpmStats('@zowe/cli', '2019-01-01', today.toISOString().slice(0, 10));
            let spreadsheet = await getSpreadsheetData();
            let totalDownloadsFromZowe = 0;
            for (let val of Object.values(spreadsheet.downloads.zoweCLI)) {
                totalDownloadsFromZowe += parseInt(val);
            }

            cachedCLIData = {
                zowe: totalDownloadsFromZowe,
                npm: totalDownloadsFromNPM,
                downloads: totalDownloadsFromZowe + totalDownloadsFromNPM,
            };
            cachedCLITime = Date.now();

            return res.status(200).json(cachedCLIData);
        } catch (err) {
            return res.status(500).json({
                err: err,
            });
        }
    }
};
