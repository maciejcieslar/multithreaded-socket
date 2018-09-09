import * as os from 'os';
import * as cluster from 'cluster';

const spawn = () => {
  const numWorkes = os.cpus().length;

  for (let i = 0; i < numWorkes; i += 1) {
    cluster.fork();
  }

  cluster.on('online', () => {
    console.log('Worker spawned');
  });

  cluster.on('exit', (worker, code, status) => {
    if (code === 0 || worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} finished his job.`);
      return null;
    }

    console.log(
      `Worker ${
        worker.process.pid
      } crashed with code ${code} and status ${status}.`,
    );
    return cluster.fork();
  });
};

export { spawn };
