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
