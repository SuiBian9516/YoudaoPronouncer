import ffmpeg from 'fluent-ffmpeg';
import * as path from "path";
import { GeneratorConfig } from "../Types";
import Logger from "../logger/Logger";
import Utils from "../utils/Utils";
import * as fs from 'fs';

const getFfmpegPath = () => {
    const isPkg = 'pkg' in process;
    if (isPkg) {
        const possiblePaths = [
            path.join(path.dirname(process.execPath), 'ffmpeg.exe'),
            path.join(process.cwd(), 'ffmpeg.exe'),
            path.join(path.dirname(process.execPath), 'libs', 'ffmpeg.exe')
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                return p;
            }
        }

        throw new Error(`Could not find ffmpeg.exe. Tried the following paths:\n${possiblePaths.join('\n')}`);
    }
    try {
        const ffmpeg = require('@ffmpeg-installer/ffmpeg');
        return ffmpeg.path;
    } catch (error) {
        Logger.warn('Could not find @ffmpeg-installer/ffmpeg, falling back to system ffmpeg', 'Generator');
        return 'ffmpeg';
    }
};

const getFfprobePath = () => {
    const isPkg = 'pkg' in process;
    if (isPkg) {
        const possiblePaths = [
            path.join(path.dirname(process.execPath), 'ffprobe.exe'),
            path.join(process.cwd(), 'ffprobe.exe'),
            path.join(path.dirname(process.execPath), 'libs', 'ffprobe.exe')
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                return p;
            }
        }

        throw new Error(`Could not find ffprobe.exe. Tried the following paths:\n${possiblePaths.join('\n')}`);
    }
    try {
        const ffprobe = require('@ffprobe-installer/ffprobe');
        return ffprobe.path;
    } catch (error) {
        Logger.warn('Could not find @ffprobe-installer/ffprobe, falling back to system ffprobe', 'Generator');
        return 'ffprobe';
    }
};

const ffmpegExecutable = getFfmpegPath();
const ffprobeExecutable = getFfprobePath();
ffmpeg.setFfmpegPath(ffmpegExecutable);
ffmpeg.setFfprobePath(ffprobeExecutable);

export default class Generator {
    private config: GeneratorConfig;
    private readonly VIDEO_PARAMS = {
        fps: '30',
        codec: 'libx264',
        preset: 'ultrafast',
        size: '1920x1080'
    };
    private readonly AUDIO_PARAMS = {
        codec: 'aac',
        bitrate: '192k',
        sampleRate: '48000',
        channels: '1'
    };

    constructor(config: GeneratorConfig) {
        this.config = config;
    }

    async generate() {
        Logger.info('Video generation is going to start', 'Generator');

        const outputPath = path.join(this.config.outputPath, this.config.outputName + ".mp4");
        const groups = this.config.database.getGroupLists();
        
        this.ensureDirectories();

        const tempDir = this.config.cachePath;
        if (!Utils.exists(tempDir)) {
            Utils.mkdirSync(tempDir, { recursive: true });
        }

        const videoSegments: string[] = [];
        let currentIndex = 0;
        let totalSegments = 0;

        for (const group of groups) {
            const contentList = this.config.database.getContentList(group);
            totalSegments += contentList.length * this.config.database.getTimes();
        }
        const titleSegment = path.join(tempDir, `title.mp4`);
        await this.createTextVideo(titleSegment, this.config.database.getTitle(),this.config.database.getMainDescription(), 2);
        videoSegments.push(titleSegment);

        let bar = Logger.progress('Generating videos: [:bar] :current/:total',totalSegments);
        for (const group of groups) {
            const contentList = this.config.database.getContentList(group);
            for (let j = 0; j < contentList.length; j++) {
                const content = contentList[j];
                const description = this.config.database.getDescription(group, content);
                
                for (let k = 0; k < this.config.database.getTimes(); k++) {
                    currentIndex++;
                    bar.tick();
                    
                    const segmentVideoPath = path.join(tempDir, `segment_${currentIndex}.mp4`);
                    await this.createWordVideoSegmentWithAudio(
                        segmentVideoPath,
                        content,
                        description,
                        `${j + 1}/${contentList.length}`,
                        path.join(this.config.resourcePath, group + j)
                    );
                    videoSegments.push(segmentVideoPath);
                }
            }
        }

        Logger.info('Merging video segments...', 'Generator');
        await this.mergeVideos(videoSegments, outputPath);

        if (this.config.autoClean) {
            Logger.info("Cleaning temporary files", "Generator");
            Utils.removeDir(tempDir);
            Utils.removeDir(this.config.rawResourcePath);
        }
        Logger.info(`Output file name: ${this.config.outputName}`, "Generator");

        if (this.config.taskStack.isEmpty()) {
            Logger.info("Done", "Main");
        } else {
            (this.config.taskStack.get() as Function)();
        }
    }

    private ensureDirectories() {
        if (!Utils.exists(this.config.outputPath)) {
            Utils.mkdirSync(this.config.outputPath, { recursive: true });
        }
        if (!Utils.exists(this.config.cachePath)) {
            Utils.mkdirSync(this.config.cachePath, { recursive: true });
        }
        if (!Utils.exists(this.config.resourcePath)) {
            Utils.mkdirSync(this.config.resourcePath, { recursive: true });
        }
    }

    private createTextVideo(outputPath: string, title: string,description:string, duration: number): Promise<void> {
        const escapedTitle = title
            .replace(/(['])/g, '\\$1')
            .replace(/\n/g, '\\n');
        const escapedDes = description
            .replace(/(['])/g, '\\$1')
            .replace(/\n/g, '\\n');
        
        return new Promise((resolve, reject) => {
            const command = ffmpeg()
                .input('color=c=black:s=1920x1080:d=' + duration)
                .inputFormat('lavfi')
                .input('anullsrc=channel_layout=mono:sample_rate=48000')
                .inputFormat('lavfi')
                .inputOptions(['-t', duration.toString()])
                .addOption('-vf', `drawtext=font='simsun':text='${escapedTitle}':fontsize=100:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-100,` +
                    `drawtext=font='simsun':text='${escapedDes}':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+100`)
                .outputOptions([
                    '-c:v', 'libx264',
                    '-preset', 'ultrafast',
                    '-profile:v', 'high',
                    '-level', '4.0',
                    '-pix_fmt', 'yuv420p',
                    '-c:a', this.AUDIO_PARAMS.codec,
                    '-b:a', this.AUDIO_PARAMS.bitrate,
                    '-ar', this.AUDIO_PARAMS.sampleRate,
                    '-ac', this.AUDIO_PARAMS.channels,
                    '-r', '30',
                    '-vsync', '1'
                ]);

            command.output(outputPath)
                .on('end', () => resolve())
                .on('error', (err) => {
                    Logger.error(`Error in createTextVideo: ${err}`, 'Generator');
                    reject(err);
                })
                .run();
        });
    }

    private async getAudioDuration(audioPath: string): Promise<number> {
        return new Promise((resolve) => {
            ffmpeg.ffprobe(audioPath, (err, metadata) => {
                if (err) {
                    Logger.error(`Error probing audio file ${audioPath}: ${err.message}`, 'Generator');
                    resolve(0);
                    return;
                }

                if (!metadata.format || typeof metadata.format.duration !== 'number') {
                    Logger.error(`No duration information found in audio file ${audioPath}`, 'Generator');
                    resolve(0);
                    return;
                }

                resolve(metadata.format.duration);
            });
        });
    }

    private createWordVideoSegmentWithAudio(
        outputPath: string,
        word: string,
        description: string,
        counter: string,
        audioPath: string
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const audioDuration = await this.getAudioDuration(audioPath);
            const videoDuration = (audioDuration * 1.5).toFixed(3);
            
            const escapedWord = word.replace(/(['])/g, '\\$1');
            const escapedDesc = description.replace(/(['])/g, '\\$1');
            const escapedCounter = counter.replace(/(['])/g, '\\$1');

            const command = ffmpeg()
                .input('color=c=black:s=' + this.VIDEO_PARAMS.size + ':d=' + videoDuration)
                .inputFormat('lavfi')
                .inputOptions(['-r', '30'])
                .input(audioPath)
                .input('anullsrc=channel_layout=mono:sample_rate=48000')
                .inputFormat('lavfi')
                .inputOptions(['-t', videoDuration])
                .addOption('-vf', 
                    `drawtext=font='simsun':text='${escapedWord}':fontsize=100:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-100,` +
                    `drawtext=font='simsun':text='${escapedDesc}':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+100,` +
                    `drawtext=font='simsun':text='${escapedCounter}':fontsize=50:fontcolor=white:x=10:y=10`
                )
                .addOption('-filter_complex', 
                    `[1:a]aresample=async=1,apad[a1];` +
                    `[2:a]volume=0.5[a2];` +
                    `[a1][a2]amix=inputs=2:duration=first[aout]`
                )
                .addOption('-map', '0:v')
                .addOption('-map', '[aout]')
                .outputOptions([
                    '-c:v', 'libx264',
                    '-preset', 'ultrafast',
                    '-profile:v', 'baseline',
                    '-level', '3.0',
                    '-pix_fmt', 'yuv420p',
                    '-c:a', this.AUDIO_PARAMS.codec,
                    '-b:a', this.AUDIO_PARAMS.bitrate,
                    '-ar', this.AUDIO_PARAMS.sampleRate,
                    '-ac', this.AUDIO_PARAMS.channels,
                    '-r', '30',
                    '-vsync', 'cfr',
                    '-t', videoDuration
                ]);

            command.output(outputPath)
                .on('end', () => resolve())
                .on('error', (err, stdout, stderr) => {
                    Logger.error(`Error in createWordVideoSegmentWithAudio: ${stderr}`, 'Generator');
                })
                .run();
        });
    }

    private mergeVideos(videoSegments: string[], outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const listPath = path.join(this.config.cachePath, 'video_list.txt');
            const fileContent = videoSegments.map(file => `file '${file.replace(/\\/g, '/')}'`).join('\n');
            fs.writeFileSync(listPath, fileContent);

            const command = ffmpeg()
                .input(listPath)
                .inputOptions(['-f', 'concat', '-safe', '0'])
                .outputOptions([
                    '-c:v', 'libx264',
                    '-preset', 'ultrafast',
                    '-profile:v', 'baseline',
                    '-level', '3.0',
                    '-pix_fmt', 'yuv420p',
                    '-c:a', this.AUDIO_PARAMS.codec,
                    '-b:a', this.AUDIO_PARAMS.bitrate,
                    '-ar', this.AUDIO_PARAMS.sampleRate,
                    '-ac', this.AUDIO_PARAMS.channels,
                    '-r', '30',
                    '-vsync', 'cfr',
                    '-async', '1',
                    '-af', 'aresample=async=1000',
                    '-max_interleave_delta', '0'
                ])
                .output(outputPath)
                .on('end', () => {
                    fs.unlinkSync(listPath);
                    resolve();
                })
                .on('error', (err) => {
                    fs.unlinkSync(listPath);
                    reject(err);
                })
                .run();
        });
    }
}