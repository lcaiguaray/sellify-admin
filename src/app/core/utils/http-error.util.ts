import { HttpErrorResponse } from '@angular/common/http';
import { UiErrorState } from '@core/shared-kernel/models/error.model';

export const DEFAULT_ERROR_MESSAGE =
  'Ocurrió un error en el servidor. Por favor, intenta nuevamente más tarde.';

export function parseHttpError(err: any): string {
  if (err?.error?.message) {
    return err.error.message;
  }

  if (err?.status === 0) {
    return 'No hay conexión con el servidor. Revisa tu internet.';
  }

  return DEFAULT_ERROR_MESSAGE;
}

export function mapHttpErrorToUiState(error: unknown): UiErrorState | null {
  if (!error) return null;

  if (error instanceof HttpErrorResponse) {
    switch (error.status) {
      case 0:
        return {
          title: 'Sin Conexión',
          message: 'No se pudo conectar con el servidor. Revisa tu internet.',
          icon: 'hugeWifiDisconnected01',
          status: error.status,
        };
      case 401:
        return {
          title: 'Sesión Expirada',
          message: 'Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.',
          icon: 'hugeLogOut04',
          status: error.status,
        };
      case 403:
        return {
          title: 'Acceso Denegado',
          message: 'No tienes los permisos necesarios para consultar esta información.',
          icon: 'hugeAlert01',
          status: error.status,
        };
      case 404:
        return {
          title: 'No Encontrado',
          message: 'El recurso que intentas buscar no existe o fue eliminado.',
          icon: 'hugeSearch01',
          status: error.status,
        };
      case 500:
        return {
          title: 'Error del Servidor',
          message: 'Ocurrió un problema inesperado en el servidor. Intenta más tarde.',
          icon: 'hugeServer01',
          status: error.status,
        };
      default:
        return {
          title: 'Error de Red',
          message: error.message || 'Ocurrió un error al comunicarse con el servidor.',
          icon: 'hugeAlert01',
          status: error.status,
        };
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Error de Aplicación',
      message: error.message,
      icon: 'hugeAlert01',
    };
  }

  return {
    title: 'Error Inesperado',
    message: 'Ocurrió un problema desconocido al cargar los datos.',
    icon: 'hugeAlert01',
  };
}
