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
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    let pword = req.headers.jwtkey;
    if (pword === process.env.JWT_KEY) {
        const token = jwt.sign({ user: 'metrics' }, pword, { expiresIn: '1h' });
        return res.status(200).json({
            message: 'Successful Auth',
            token: token,
        });
    } else {
        return res.status(401).json({
            message: 'Auth Failed',
        });
    }
});

module.exports = router;
