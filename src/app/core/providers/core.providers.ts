import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';

export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Optimización de detección de cambios
    provideZonelessChangeDetection(),

    // Escucha de errores asíncronos globales del navegador
    provideBrowserGlobalErrorListeners(),

    // Aquí podrías agregar en el futuro configuraciones globales de telemetría o internacionalización base
  ]);
}
