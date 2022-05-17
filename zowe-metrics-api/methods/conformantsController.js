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
const https = require('https');

let cachedConformantsData;
let cachedConformantsTime;

exports.getConformants = async (req, res) => {
    try {
        if (cachedConformantsTime && cachedConformantsTime > Date.now() - 60 * 1000 * 10) {
            return res.json(cachedConformantsData);
        } else {
            const agent = new https.Agent({  
                rejectUnauthorized: false
            });
            const { data } = await axios.get(`${process.env.CONFORMANTS_URL}`, { httpsAgent: agent });
            const $ = cheerio.load(data);

            let apiml = parseInt($('.items-cont')[0].children[0].data.trim().slice(1,-1));
            let appFrmwrk = parseInt($('.items-cont')[1].children[0].data.trim().slice(1,-1));
            let cli = parseInt($('.items-cont')[2].children[0].data.trim().slice(1,-1));
            let zoweExplorer = parseInt($('.items-cont')[3].children[0].data.trim().slice(1,-1));
    
            cachedConformantsData = {
                url: `https://www.openmainframeproject.org/projects/zowe/conformance`,
                products: apiml + appFrmwrk + cli + zoweExplorer,
                breakdown: {
                    APIML: apiml,
                    AppFramework: appFrmwrk,
                    CLI: cli,
                    ZoweExplorer: zoweExplorer,
                },
            };
            cachedConformantsTime = Date.now();
    
            res.json(cachedConformantsData);
        }
    } catch (err) {
        console.log(err);

        cachedConformantsData = {
            url: `https://www.openmainframeproject.org/projects/zowe/conformance`,
            products: undefined,
            breakdown: {
                APIML: undefined,
                AppFramework: undefined,
                CLI: undefined,
                ZoweExplorer: undefined,
            },
        };
        cachedConformantsTime = Date.now();

        res.json(cachedConformantsData);
    }
    
};
