import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getBoolean } from '@angular/fire/remote-config';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private injector = inject(Injector); // Necesario para el contexto
  private remoteConfig = inject(RemoteConfig);
  private premiumUiSubject = new BehaviorSubject<boolean>(false);
  public isPremiumUiEnabled$: Observable<boolean> = this.premiumUiSubject.asObservable();

  constructor() {
    // Usamos runInInjectionContext para asegurar que las APIs de Firebase 
    // se ejecuten correctamente bajo la inyección de dependencias de Angular
    runInInjectionContext(this.injector, () => {
      this.initRemoteConfig();
    });
  }

  // En tu feature-flag.service.ts, asegúrate de esto:
private async initRemoteConfig() {
  try {
    await fetchAndActivate(this.remoteConfig);
    const isEnabled = getBoolean(this.remoteConfig, 'enable_premium_categories');
    
    // ESTO ES LO QUE HACE QUE LA UI CAMBIE:
    this.premiumUiSubject.next(isEnabled); 
    console.log('Firebase Remote Config actualizado a:', isEnabled);
  } catch (error) {
    console.error('Error:', error);
    this.premiumUiSubject.next(false);
  }
}
}