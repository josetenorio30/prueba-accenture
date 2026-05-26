import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// 1. Importar Storage
import { IonicStorageModule } from '@ionic/storage-angular';

// 2. Importar Firebase Moderno (Modular)
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Proveedor de Ionic Storage
    importProvidersFrom(IonicStorageModule.forRoot()),

    // Proveedores de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => {
      const remoteConfig = getRemoteConfig();
      // En desarrollo, bajamos el tiempo de caché a 1 hora (3600000 ms) para poder probar
      remoteConfig.settings.minimumFetchIntervalMillis = 0; 
      return remoteConfig;
    }),
  ],
});