import { Response } from "express";
import { Logger, createLogger, transports, format } from "winston";

class ResponseHandler {
  private static logger: Logger = createLogger({
    level: "error",
    transports: [
      new transports.Console(),
      new transports.File({ filename: "error.log", level: "error" }),
    ],
    format: format.combine(format.timestamp(), format.json()),
  });

  /**
   * Maneja respuestas safistactorias (200)
   * @param res El objeto de respuesta de Express
   * @param data Los datos relacionados a la respuesta
   * @param message El mensaje de respuesta
   */
  public static successResponse(
    res: Response,
    data: any,
    message: string
  ): void {
    res.status(200).json({
      success: true,
      data,
      message,
    });
  }

  /**
   * Maneja respuestas de creacion (200)
   * @param res El objeto de respuesta de Express
   * @param data Los datos relacionados con la creacion
   * @param message El mensaje de creacion
   */
  public static createdResponse(
    res: Response,
    data: any,
    message: string
  ): void {
    res.status(201).json({
      success: true,
      data,
      message,
    });
  }

  /**
   * Maneja un error interno del servidor (500)
   * @param res El objeto de respuesta de Express
   * @param data Los datos relacionados con el error
   * @param message El mensaje de error
   */
  public static handleInternalError(
    res: Response,
    data: any,
    message: string
  ): void {
    this.logger.error(message, { error: data }); // Registrar el error en los registros de Winston
    res.status(500).json({
      error: true,
      data,
      message,
    });
  }

  /**
   * Maneja un error de recurso no encontrado (404)
   * @param res El objeto de respuesta de Express
   * @param data Los datos relacionados con el error
   * @param message El mensaje de error
   */
  public static handleNotFound(
    res: Response,
    data: any,
    message: string
  ): void {
    res.status(404).json({
      error: true,
      data,
      message,
    });
  }

  /**
   * Maneja un error de solicitud no válida (422)
   * @param res El objeto de respuesta de Express
   * @param data Los datos relacionados con el error
   * @param message El mensaje de error
   */
  public static handleUnprocessableEntity(
    res: Response,
    data: any,
    message: string
  ): void {
    res.status(422).json({
      error: true,
      data,
      message,
    });
  }

  /**
   * Maneja un error de autenticación (401)
   * @param res El objeto de respuesta de Express
   * @param data Los datos relacionados con el error
   * @param message El mensaje de error
   */
  public static handleUnauthorized(
    res: Response,
    data: any,
    message: string
  ): void {
    res.status(401).json({
      error: true,
      data,
      message,
    });
  }

  /**
   * Maneja un error de acceso denegado (403)
   * @param res El objeto de respuesta de Express
   * @param data Los datos relacionados con el error
   * @param message El mensaje de error
   */
  public static handleDenied(res: Response, data: any, message: string): void {
    res.status(403).json({
      error: true,
      data,
      message,
    });
  }
}

export { ResponseHandler };
