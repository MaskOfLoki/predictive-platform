const shell = require('shelljs');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

const sourceDir = path.join('dist', 'win-unpacked');

shell.mv(path.join(sourceDir, 'predictive-platform-*.exe'), path.join(sourceDir, 'predictive-platform.exe'));
zipDirectory(sourceDir, path.join('dist/predictive-platform.zip'));

function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}
