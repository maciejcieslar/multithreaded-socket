import * as moduleAlias from 'module-alias';

moduleAlias.addAliases({
  src: __dirname,
});

import * as express from 'express';
import * as http from 'http';
import * as cluster from 'cluster';
import * as socketio from 'socket.io';
import * as killPort from 'kill-port';
import { initSocket } from 'src/common/socket';
import { spawn } from 'src/clusters';

const port = 7999;

if (cluster.isMaster) {
  killPort(port).then(spawn);
} else {
  const app = express();
  const server = http.createServer(app);
  const io = initSocket(socketio(server).of('/socket'));

  server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
}
