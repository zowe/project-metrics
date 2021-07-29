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

const axios = require('axios');
const cheerio = require('cheerio');

let cachedExplorerData;
let cachedExplorerTime;

exports.getExplorer = async (req, res) => {
    if (cachedExplorerTime && cachedExplorerTime > Date.now() - 60 * 1000 * 10) {
        return res.status(200).json(cachedExplorerData);
    } else {
        let val = (await fetchHTML(`${process.env.EXPLORER_URL}`)).substring(10);

        cachedExplorerData = {
            downloads: parseInt(val),
        };
        cachedExplorerTime = Date.now();

        return res.status(200).json(cachedExplorerData);
    }
};

async function fetchHTML(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $('svg').attr('aria-label');
}
