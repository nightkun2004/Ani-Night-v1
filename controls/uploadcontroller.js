const Acticle = require("../models/acticle")
const User = require("../models/user")
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const crypto = require("crypto")

async function processVideo(filePath) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(__dirname, '..', 'src', 'public', 'videos');
        const resolutions = [
            { resolution: '144p', width: 256, height: 144 },
            { resolution: '240p', width: 426, height: 240 },
            { resolution: '360p', width: 640, height: 360 },
            { resolution: '480p', width: 854, height: 480 },
            { resolution: '720p', width: 1280, height: 720 },
        ];

        let processedFilesCount = 0;
        const outputFiles = {};

        resolutions.forEach(res => {
            const outputFilePath = path.join(outputDir, `${path.basename(filePath, '.mp4')}_${res.resolution}.mp4`);
            outputFiles[res.resolution] = outputFilePath;

            ffmpeg(filePath)
                .size(`${res.width}x${res.height}`)
                .output(outputFilePath)
                .on('end', () => {
                    processedFilesCount++;
                    console.log(`${res.resolution} conversion done.`);
                    if (processedFilesCount === resolutions.length) {
                        resolve(outputFiles);
                    }
                })
                .on('error', (err) => {
                    reject(err);
                })
                .run();
        });
    });
}

module.exports = { processVideo };