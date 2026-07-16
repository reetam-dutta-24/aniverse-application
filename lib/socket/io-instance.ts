import type { Server as SocketIOServer } from "socket.io";

let socketServer: SocketIOServer | null = null;

export function setSocketServer(io: SocketIOServer) {
  socketServer = io;
}

export function getSocketServer(): SocketIOServer | null {
  return socketServer;
}
