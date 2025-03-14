import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class MeasurementsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MeasurementsGateway.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.eventEmitter.on('new.measurement', (measurement: CreateMeasurementDto) => {
      this.emitNewMeasurement(measurement);
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('subscribe:measurements')
  handleMeasurementSubscription(client: Socket, payload: { workCenterId?: string; areaId?: string; sensorId?: string }) {
    this.logger.log(`Cliente ${client.id} se suscribió a mediciones con filtros:`, payload);
  }

  // Método para emitir nuevas mediciones a todos los clientes conectados
  emitNewMeasurement(measurement: CreateMeasurementDto) {
    this.server.emit('new:measurement', measurement);
  }
} 