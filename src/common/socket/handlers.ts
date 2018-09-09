import * as pubsub from 'src/common/pubsub';

const dispatch = ({
  event,
  id,
  args,
}: {
  event: string;
  id: string;
  args: any;
}) => pubsub.emit('outgoing_socket_message', { event, id, args });

const dispatchTypes = {
  MESSAGE_SENT: 'message_sent',
  POST_UPDATED_NOTIFICATION: 'post_updated_notification',
};

interface Handlers {
  [key: string]: ({ id, args }: { id: string; args: any }) => any;
}

const handlers: Handlers = {
  sendMessage: async ({ id, args }) => {
    // await sendMessageToUser();

    dispatch({
      id,
      event: dispatchTypes.MESSAGE_SENT,
      args: {
        message: `A message from user with id: ${id} has been send`,
      },
    });
  },
  postUpdated: async ({ id, args }) => {
    dispatch({
      id,
      event: dispatchTypes.POST_UPDATED_NOTIFICATION,
      args: {
        message: 'A post you have been mentioned in has been updated',
      },
    });
  },
};

export = handlers;
