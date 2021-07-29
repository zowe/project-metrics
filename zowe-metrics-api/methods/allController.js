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

exports.getAll = (req, res) => {
    axios
        .all([
            axios.get(`${process.env.EXTERNAL_API_URL}/cli`),
            axios.get(`${process.env.EXTERNAL_API_URL}/explorer`),
            axios.get(`${process.env.EXTERNAL_API_URL}/server`),
            axios.get(`${process.env.EXTERNAL_API_URL}/omp`),
            axios.get(`${process.env.EXTERNAL_API_URL}/conformants`),
        ])
        .then(
            axios.spread(async (...responses) => {
                return res.status(200).json({
                    cli: responses[0].data,
                    explorer: responses[1].data,
                    server: responses[2].data,
                    omp: responses[3].data,
                    conformants: responses[4].data,
                });
            })
        );
};
