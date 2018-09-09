import * as NRP from 'node-redis-pubsub';

const client = new NRP({
  port: 6379,
  scope: 'message',
});

export = client;
