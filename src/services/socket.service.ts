import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger';

class SocketService {
  private io: SocketIOServer | null = null;

  initialize(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', // In production, restrict to frontend domain
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      logger.info(`User connected to socket: ${socket.id}`);

      socket.on('joinRoom', (room) => {
        socket.join(room);
        logger.info(`Socket ${socket.id} joined room ${room}`);
      });

      socket.on('disconnect', () => {
        logger.info(`User disconnected from socket: ${socket.id}`);
      });
    });
  }

  broadcast(event: string, payload: any) {
    if (this.io) {
      this.io.emit(event, payload);
    }
  }

  emitToRoom(room: string, event: string, payload: any) {
    if (this.io) {
      this.io.to(room).emit(event, payload);
    }
  }
}

export const socketService = new SocketService();
