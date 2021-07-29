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

const { pageLayoutPicture } = require('./styles');

exports.titlePage = (data) => {
    let content = {
        table: {
            widths: ['*'],
            heights: 750,
            body: [
                [
                    {
                        stack: [
                            {
                                image: 'methods/pdfGeneration/logo.png',
                                width: 360,
                                alignment: 'center',
                                margin: [0, 60, 0, 20],
                            },
                            {
                                text: 'Zowe Community Metrics',
                                alignment: 'center',
                                style: {
                                    fontSize: 42,
                                    bold: true,
                                },
                                margin: [0, 80, 0, 20],
                            },
                            {
                                text: data.dateString,
                                alignment: 'center',
                                style: {
                                    fontSize: 22,
                                    bold: true,
                                },
                                margin: [0, 20, 0, 0],
                            },
                        ],
                    },
                ],
            ],
        },
        layout: pageLayoutPicture(),
        pageBreak: 'after',
    };

    return content;
};
