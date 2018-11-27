const fs = require('fs');
const cp = require('child_process');
const pathm = require('path');
const exec = cp.exec;
const execSync = cp.execSync;

const url = execSync(
    'npm config get sqs_site_url', 
    { stdio: ['ignore', 'pipe', 'pipe']})
        .toString()
        .replace(/\n$/, '');

const clone = `git clone ${url}/template.git build`;
const pull = 'git pull';

const git = (command, opts) =>
    exec(command, opts, (err, stdout, stderr) =>
    {
        if (err)
        {
            console.error(err);
        }
        else
        {
            console.log(stdout);
        }
    });

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
        var curPath = pathm.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
        } else { // delete file
            fs.unlinkSync(curPath);
        }
        });
        fs.rmdirSync(path);
    }
};

if (fs.existsSync('build/.git'))
{
    git(pull, { cwd: 'build' });
}
else
{
    deleteFolderRecursive('build');
    git(clone);
}