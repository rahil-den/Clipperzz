
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
const outputPath = 'd:/sem-8/AML/clipperz/storage/uploads/test_node_download.mp4';
const cookiesPath = 'd:/sem-8/AML/clipperz/cookies.txt';

const args = [
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
    '--merge-output-format', 'mp4',
    '--remux-video', 'mp4',
    '-o', outputPath,
    '--no-playlist',
    '--no-warnings',
    '--no-check-certificates',
    '--cookies', cookiesPath,
    '--extractor-args', 'youtube:player_client=android,web,ios',
    url
];

console.log(`Running: yt-dlp ${args.join(' ')}`);

const proc = spawn('yt-dlp', args, { shell: false });

proc.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
});

proc.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
});

proc.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
    if (code === 0 && fs.existsSync(outputPath)) {
        console.log('SUCCESS: File downloaded!');
    } else {
        console.error('FAILED: No file found or error code returned.');
    }
});
