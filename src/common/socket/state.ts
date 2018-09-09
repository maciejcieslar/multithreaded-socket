import * as socketio from 'socket.io';

interface SocketsState {
  [id: string]: socketio.Socket[];
}

const socketsState: SocketsState = {};

const add = (id: string, socket: socketio.Socket) => {
  if (!socketsState[id]) {
    socketsState[id] = [];
  }

  socketsState[id] = [...socketsState[id], socket];

  return socketsState[id];
};

const remove = (id: string, socket: socketio.Socket) => {
  if (!socketsState[id]) {
    return null;
  }

  socketsState[id] = socketsState[id].filter((s) => s !== socket);

  if (!socketsState[id].length) {
    socketsState[id] = undefined;
  }

  return null;
};

const emit = ({
  event,
  id,
  args,
}: {
  event: string;
  id: string;
  args: any;
}) => {
  if (!socketsState[id]) {
    return null;
  }

  socketsState[id].forEach((socket) =>
    socket.emit('message', { event, id, args }),
  );

  return null;
};

export { add, remove, emit };
