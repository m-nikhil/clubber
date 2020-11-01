require('dotenv').config()
const Docker = require('dockerode');

const isWin = process.platform === 'win32';
let docker;
if(isWin) {
docker = new Docker({socketPath: '//./pipe/docker_engine'});
} else {
docker = new Docker({socketPath: '/var/run/docker.sock'});
}

// Postgres image must be made available before the script
docker.createContainer({
    Image: "postgres",
    Env: [`POSTGRES_PASSWORD=` + process.env.DATABASE_PASSWORD,`POSTGRES_DB=` + process.env.DATABASE_NAME],
    HostConfig: {
        PortBindings: {
        "5432/tcp": [{ HostPort: process.env.DATABASE_PORT }]
        }
    },
    ExposedPorts: {
        "5432/tcp": {}
    },
    name: process.env.APP_NAME + "-dev"
    }).then(function(container) {
      return container.start();
    })