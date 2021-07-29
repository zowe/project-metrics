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

let PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

const { titlePage } = require('./pages/titlePage');
const { explorerPage } = require('./pages/explorerPage');
const { cliPage } = require('./pages/cliPage');
const { cliTablePage } = require('./pages/cliTablePage');
const { pluginsPage } = require('./pages/pluginsPage');
const { smpePage } = require('./pages/smpePage');
const { smpeTablePage } = require('./pages/smpeTablePage');
const { binaryPage } = require('./pages/binaryPage');
const { binaryTablePage } = require('./pages/binaryTablePage');
const { slackPage } = require('./pages/slackPage');
const { githubPage } = require('./pages/githubPage');

exports.generate = async function (data) {
    let printer = new PdfPrinter({
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique',
        },
    });
    console.log('Creating Report Configuration...');
    let docDefinition = await getDocDefinition(data);
    console.log('Report Configuration Generated');
    let options = {};
    let pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc
        .pipe(
            fs.createWriteStream(
                path.resolve(__dirname, `../../PDFStore/Zowe Community Metrics - ${data.dateString}.pdf`)
            )
        )
        .on('finish', function () {
            // success
            console.log('Report Generation Successful');
        });
    pdfDoc.end();
};

const getDocDefinition = async (data) => {
    let titlePageContent = titlePage(data);
    console.log('Generated Title Page');
    let explorerPageContent = await explorerPage(data);
    console.log('Generated Explorer Page');
    let cliPageContent = await cliPage(data);
    console.log('Generated CLI Page 1');
    let cliTablePageContent = await cliTablePage(data);
    console.log('Generated CLI Page 2');
    let smpePageContent = await smpePage(data);
    console.log('Generated SMPE Page 1');
    let smpeTablePageContent = await smpeTablePage(data);
    console.log('Generated SMPE Page 2');
    let binaryPageContent = await binaryPage(data);
    console.log('Generated Convenience Build Page 1');
    let binaryTablePageContent = await binaryTablePage(data);
    console.log('Generated Convenience Build Page 2');
    let pluginsPageContent = await pluginsPage(data);
    console.log('Generated CLI Plugins Page');
    let slackPageContent = await slackPage(data);
    console.log('Generated Slack Page');
    let githubPageContent = await githubPage(data);
    console.log('Generated Github Page');

    let def = {
        defaultStyle: {
            font: 'Helvetica',
            color: '#505050',
            fontSize: 11,
            lineHeight: 1.3,
        },
        pageMargins: [20, 20, 20, 20],
        styles: {
            DownloadTitle: {
                fontSize: 26,
                alignment: 'center',
                decoration: 'underline',
            },
        },
        content: [
            titlePageContent,
            explorerPageContent,
            cliPageContent,
            cliTablePageContent,
            pluginsPageContent,
            smpePageContent,
            smpeTablePageContent,
            binaryPageContent,
            binaryTablePageContent,
            slackPageContent,
            githubPageContent,
        ],
    };

    def.content[def.content.length - 1].pageBreak = '';

    return def;
};
