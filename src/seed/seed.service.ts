import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MeasurementsService } from '../measurements/measurements.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly measurementsService: MeasurementsService) {}

  async populate() {
    try {
      this.logger.log('Iniciando proceso de población de datos...');

      // Cargar el archivo JSON desde src en lugar de dist
      let data: any[];
      try {
        // Usar process.cwd() para obtener la raíz del proyecto y luego ir a src/seed
        // TODO: otra opcion podria ser copiar el archivo data.json a dist por medio de configuracion de nestjs para el build
        const filePath = join(process.cwd(), 'src', 'seed', 'data.json');
        this.logger.log(`Intentando cargar archivo desde: ${filePath}`);

        const fileContent = readFileSync(filePath, 'utf8');
        data = JSON.parse(fileContent);

        this.logger.log(`Archivo cargado exitosamente desde: ${filePath}`);
      } catch (fileError) {
        this.logger.error(
          `Error al cargar el archivo data.json: ${fileError.message}`,
        );
        throw fileError;
      }

      // Validar que los datos tengan el formato correcto
      if (!Array.isArray(data)) {
        this.logger.error(
          `Los datos cargados no son un array. Tipo: ${typeof data}`,
        );
        throw new Error(
          'El archivo de datos debe contener un array de mediciones',
        );
      }

      this.logger.log(
        `Datos cargados correctamente. ${data.length} registros encontrados.`,
      );
      const results: any[] = [];

      // Procesar cada medición del archivo JSON
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        try {
          // Crear la medición usando el servicio de mediciones
          const result = await this.measurementsService.create(item);
          results.push(result);

          // muestra el porcentaje de progreso y cuantos hemos cread vs cuantos faltan
          this.logger.log(
            `Progreso: ${((index / data.length) * 100).toFixed(2)}% - ${index} de ${data.length}`,
          );
        } catch (error) {
          this.logger.error(
            `Error al procesar la medición: ${JSON.stringify(item)}`,
            error.stack,
          );
        }
      }

      this.logger.log(
        `Proceso completado. Se han creado ${results.length} mediciones.`,
      );
      return {
        message: `Se han importado ${results.length} mediciones correctamente`,
        totalProcessed: data.length,
        totalSuccess: results.length,
      };
    } catch (error) {
      this.logger.error('Error durante el proceso de población', error.stack);
      throw error;
    }
  }
}
