import { Observable, of, Subject } from 'rxjs';
import { StorageStrategy } from '../lib/core/interfaces/storageStrategy';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export const StorageStrategyStubName: string = 'stub_strategy';
export const StorageStrategyStubToken = new InjectionToken('stub_strategy_token');

@Injectable()
export class StorageStrategyStub implements StorageStrategy<any> {
  readonly keyChanges: Subject<string> = new Subject();
  public store: any = {};
  public _available: boolean = true;
  readonly name: string;

  constructor(@Inject(StorageStrategyStubToken) @Optional() name?: string) {
    this.name = name || StorageStrategyStubName;
  }

  get isAvailable(): boolean {
    return this._available;
  }

  get(key: string): Observable<any> {
    return of(this.store[key]);
  }

  set(key: string, value: any): Observable<any> {
    this.store[key] = value;
    this.keyChanges.next(key);
    return of(value);
  }

  del(key: string): Observable<void> {
    delete this.store[key];
    this.keyChanges.next(key);
    return of(null);
  }

  clear(): Observable<void> {
    this.store = {};
    this.keyChanges.next(null);
    return of(null);
  }
}
