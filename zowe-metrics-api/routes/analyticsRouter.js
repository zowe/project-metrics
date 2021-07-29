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

const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const analytics = google.analytics('v3');

router.get('/geo', (req, res) => {
    let authClient = new google.auth.JWT(process.env.GAPI_EMAIL, `./${process.env.CONFIG_DETAILS_FILE}`, null, [
        'https://www.googleapis.com/auth/analytics.readonly',
    ]);

    let dates = getDates(req.headers);

    authClient.authorize((err, tokens) => {
        if (err) {
            return res.status(500).send('Something went wrong...');
        }
        analytics.data.ga.get(
            {
                auth: authClient,
                ids: 'ga:' + process.env.GAPI_ZOWE,
                'start-date': dates.startDate,
                'end-date': dates.endDate,
                metrics: 'ga:users,ga:newUsers',
                dimensions: 'ga:country',
                sort: '-ga:users',
                'max-results': 10,
            },
            (users_err, users_res) => {
                if (!users_err) {
                    analytics.data.ga.get(
                        {
                            auth: authClient,
                            ids: 'ga:' + process.env.GAPI_LF,
                            'start-date': dates.startDate,
                            'end-date': dates.endDate,
                            metrics: 'ga:pageviews',
                        },
                        (lf_pageviews_err, lf_pageviews_res) => {
                            if (!lf_pageviews_err) {
                                analytics.data.ga.get(
                                    {
                                        auth: authClient,
                                        ids: 'ga:' + process.env.GAPI_ZOWE,
                                        'start-date': dates.startDate,
                                        'end-date': dates.endDate,
                                        metrics: 'ga:pageviews',
                                    },
                                    (zowe_pageviews_err, zowe_pageviews_res) => {
                                        if (!zowe_pageviews_err) {
                                            return res.json({
                                                total: users_res.data.totalsForAllResults,
                                                rows: users_res.data.rows,
                                                pageViews:
                                                    parseInt(
                                                        lf_pageviews_res.data.totalsForAllResults['ga:pageviews']
                                                    ) +
                                                    parseInt(
                                                        zowe_pageviews_res.data.totalsForAllResults['ga:pageviews']
                                                    ),
                                            });
                                        } else {
                                            return res.status(500).send('Something went wrong...');
                                        }
                                    }
                                );
                            } else {
                                return res.status(500).send('Something went wrong...');
                            }
                        }
                    );
                } else {
                    return res.status(500).send('Something went wrong...');
                }
            }
        );
    });
});

const getDates = (headers) => {
    let firstOfThisMonth = new Date();
    firstOfThisMonth.setDate(1);

    let startOfNextMonth = new Date();
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
    startOfNextMonth.setDate(1);

    let startDate = headers.startdate ? headers.startdate : firstOfThisMonth.toISOString().slice(0, 10);
    let endDate = headers.enddate ? headers.enddate : startOfNextMonth.toISOString().slice(0, 10);

    return { startDate: startDate, endDate: endDate };
};

module.exports = router;
