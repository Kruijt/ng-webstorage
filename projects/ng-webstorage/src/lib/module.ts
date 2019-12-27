import {
  APP_INITIALIZER,
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional
} from '@angular/core';
import { LocalStorageProvider, SessionStorageProvider } from './core/nativeStorage';
import { Services } from './services/index';
import { Strategies } from './strategies/index';
import { StrategyIndex } from './services/strategyIndex';
import { NgWebstorageConfiguration } from './config';
import { StorageKeyManager } from './helpers/storageKeyManager';

export const LIB_CONFIG: InjectionToken<NgWebstorageConfiguration> = new InjectionToken<
  NgWebstorageConfiguration
>('ng_webstorage_config');

export function appInit(index: StrategyIndex) {
  index.indexStrategies();
  return () => StrategyIndex.index;
}

@NgModule({})
export class NgWebstorageModule {
  constructor(
    index: StrategyIndex,
    @Optional() @Inject(LIB_CONFIG) config: NgWebstorageConfiguration
  ) {
    if (config) StorageKeyManager.consumeConfiguration(config);
    else
      console.error(
        'NgWebstorage : Possible misconfiguration (The forRoot method usage is mandatory since the 3.0.0)'
      );
  }

  static forRoot(config: NgWebstorageConfiguration = {}): ModuleWithProviders<NgWebstorageModule> {
    return {
      ngModule: NgWebstorageModule,
      providers: [
        {
          provide: LIB_CONFIG,
          useValue: config
        },
        LocalStorageProvider,
        SessionStorageProvider,
        ...Services,
        ...Strategies,
        {
          provide: APP_INITIALIZER,
          useFactory: appInit,
          deps: [StrategyIndex],
          multi: true
        }
      ]
    };
  }
}
