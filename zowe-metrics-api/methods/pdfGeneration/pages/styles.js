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

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

exports.pageLayoutPicture = () => {
    return {
        hLineWidth: function (i, node) {
            return 3;
        },
        vLineWidth: function (i, node) {
            return 3;
        },
        hLineColor: function (i, node) {
            return '#313131';
        },
        vLineColor: function (i, node) {
            return '#313131';
        },
        paddingLeft: function (i, node) {
            return 25;
        },
        paddingRight: function (i, node) {
            return 25;
        },
        paddingTop: function (i, node) {
            return 25;
        },
        paddingBottom: function (i, node) {
            return 25;
        },
    };
};

exports.mkChart = async (config, w, h) => {
    const canvasRenderService = new ChartJSNodeCanvas({
        width: w,
        height: h,
    });
    return await canvasRenderService.renderToBuffer(config);
};
