const exec = require('child_process').exec;
const log = require('../lib/log');

// TODO might be important to sanitise input to `exec()` to prevent injection
// attacks by devious tech leads.

module.exports = (args, logLevel=log.level) => new Promise((resolve, reject) => {

    // Include stdout at log.LEVEL_WARN because xls2xform outputs warnings on stdout

    const stdio = logLevel >= log.LEVEL_WARN  ? [ 'ignore',  'pipe',   'pipe'  ] :
                  logLevel >= log.LEVEL_ERROR ? [ 'ignore', 'ignore',  'pipe'  ] :
                                                [ 'ignore', 'ignore', 'ignore' ];

    const sub = exec(
      args.join(' '),
      { stdio:stdio },
      (err, stdout, stderr) => {
        if(err) reject(stderr);
        else resolve(stdout);
      });

    if(logLevel >= log.LEVEL_WARN)  sub.stdout.pipe(process.stdout);
    if(logLevel >= log.LEVEL_ERROR) sub.stderr.pipe(process.stderr);

  });
