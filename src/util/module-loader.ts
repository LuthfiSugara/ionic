import { ComponentFactoryResolver, Injectable, Injector, OpaqueToken, Type } from '@angular/core';
import { SystemJsNgModuleLoader, SystemJsLoadedModule } from './system-js-ng-module-loader';

export const LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');


/**
 * @private
 */
@Injectable()
export class ModuleLoader {

  constructor(
    private _systemJsNgModuleLoader: SystemJsNgModuleLoader,
    private _injector: Injector) {}


  loadModule(loadChildren: string): Promise<LoadedModule> {
    const splitString = loadChildren.split(SPLITTER);

    return this._systemJsNgModuleLoader.load({
      modulePath: splitString[0],
      ngModuleExport: splitString[1]
    })
    .then((loadedModule: SystemJsLoadedModule) => {
      const ref = loadedModule.ngModuleFactory.create(this._injector);

      return {
        componentFactoryResolver: ref.componentFactoryResolver,
        component: ref.injector.get(LAZY_LOADED_TOKEN)
      };
    });
  }
}

const SPLITTER = '#';


/**
 * @private
 */
export function provideModuleLoader(systemJsNgModuleLoader: SystemJsNgModuleLoader, injector: Injector) {
  return new ModuleLoader(systemJsNgModuleLoader, injector);
}


export interface LoadedModule {
  componentFactoryResolver: ComponentFactoryResolver;
  component: Type<any>;
};
