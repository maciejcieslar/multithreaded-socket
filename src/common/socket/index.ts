import * as socketio from 'socket.io';
import * as socketsState from 'src/common/socket/state';
import * as handlers from 'src/common/socket/handlers';
import * as pubsub from 'src/common/pubsub';

pubsub.on('outgoing_socket_message', ({ event, id, args }) =>
  socketsState.emit({ event, id, args }),
);

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface AuthorizedSocket extends socketio.Socket {
  user: User;
}

const checkToken = (token: string, id: string) => ({
  token,
  id,
  firstName: 'Maciej',
  lastName: 'Cieslar',
});

type SocketMiddleware = (
  socket: AuthorizedSocket,
  next: (err?: Error) => void,
) => any;

const onAuth: SocketMiddleware = (socket, next) => {
  const { token, id }: { token: string; id: string } =
    socket.request._query || socket.request.headers;

  if (!token) {
    return next(new Error('Authorization failed, no token has been provided!'));
  }

  // mock
  const user = checkToken(token, id);

  socket.user = user;

  return next();
};

const onConnection: SocketMiddleware = (socket, next) => {
  if (!socket.user) {
    return null;
  }

  const { id } = socket.user;

  socketsState.add(id, socket);

  socket.on('message', ({ event, args }) => {
    const handler = handlers[event];

    if (!handler) {
      return null;
    }

    return handler && handler({ id, args });
  });

  socket.on('disconnect', () => {
    return socketsState.remove(id, socket);
  });

  next();
};

const initSocket = (instance: socketio.Namespace): socketio.Namespace =>
  instance.use(onAuth).use(onConnection);

export { initSocket };
