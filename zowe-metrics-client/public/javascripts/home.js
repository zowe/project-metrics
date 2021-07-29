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

document.getElementById('cliItem').addEventListener('click', () => {
    window.location.href = '/downloads#cli';
});

document.getElementById('expItem').addEventListener('click', () => {
    window.location.href = '/downloads#explorer';
});

document.getElementById('serversideItem').addEventListener('click', () => {
    window.location.href = '/downloads#server';
});

document.getElementById('prItem').addEventListener('click', () => {
    window.location.href = '/community#slack';
});

document.getElementById('submitItem').addEventListener('click', () => {
    window.location.href = '/community#github';
});

document.getElementById('conformantsItem').addEventListener('click', () => {
    window.location.href = 'https://www.openmainframeproject.org/projects/zowe/conformance';
});
