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

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DB2 = new Schema({
    date: Date,
    value: Number,
});

module.exports = mongoose.model('DB2', DB2);
