const npm = require('npm-stats-api');

const differenceInDays = (startDate, endDate) => {
    const difference = new Date(endDate.getTime() - startDate.getTime());
    const diffInDays = difference.getTime() / (1000 * 3600 * 24);
    return diffInDays;
}

const npmStats = (packageName, start, end) => new Promise((resolve, reject) => {
    npm.stat(packageName, start, end, async (err, response) => {
        if (err) {
            reject(err);
            return;
        } else {
            resolve(parseInt(response.downloads, 10));
        }
    });
});

/**
 * Makes requests to npm-stats-api in date ranges dictated by 'maxDays' to overcome the 18 month limit.
 */
exports.cumulativeNpmStats = async (packageName, start, end) => {
    try {
        let startDate = new Date(start);
        let endDate = new Date(end);
        let diffInDays = differenceInDays(startDate, endDate);
        let totalDownloads = 0;
        const maxDays = 365;
        while (diffInDays > maxDays) {
            let tempEndDate = new Date(startDate);
            tempEndDate.setDate(startDate.getDate() + maxDays);
            totalDownloads += await npmStats(
                packageName,
                startDate.toISOString().slice(0, 10),
                tempEndDate.toISOString().slice(0, 10)
                );
            startDate.setDate(startDate.getDate() + maxDays + 1);
            diffInDays = differenceInDays(startDate, endDate);
        }
        totalDownloads += await npmStats(packageName, startDate.toISOString().slice(0, 10), end);
        return totalDownloads;
    } catch (err) {
        throw err;
    }
}