# ng-webstorage

### Local and session storage - Angular service

This library provides an easy to use service to manage the web storages (local and session) from your Angular application.
It provides also two decorators to synchronize the component attributes and the web storages.

---

#### Index:

- [Getting Started](#gstart)
- [Services](#services):
  _ [LocalStorageService](#s_localstorage)
  _ [SessionStorageService](#s_sessionstorage)
- [Decorators](#decorators):
  _ [@LocalStorage](#d_localstorage)
  _ [@SessionStorage](#d_sessionStorage)
- [Known issues](#knownissues)
- [Modify and build](#modifBuild)

---

### Migrate from v2.x to the v3

1. Update your project to Angular 7+
2. Rename the module usages by <b>NgWebstorageModule.forRoot()</b>
   > The forRoot is now mandatory in the root module even if you don't need to configure the library

---

### <a name="gstart">Getting Started</a>

1. Download the library using npm `npm i @kruijt/ng-webstorage`
2. Declare the library in your main module

   ```typescript
   import {NgModule} from '@angular/core';
   import {BrowserModule} from '@angular/platform-browser';
   import {NgWebstorageModule} from '@kruijt/ng-webstorage';

   @NgModule({
   	declarations: [...],
   	imports: [
   		BrowserModule,
   		NgWebstorageModule.forRoot(),
   		//NgWebstorageModule.forRoot({ prefix: 'custom', separator: '.', caseSensitive:true })
   		// The forRoot method allows to configure the prefix, the separator and the caseSensitive option used by the library
   		// Default values:
   		// prefix: 'kruijt-ng-webstorage'
   		// separator: '|'
   		// caseSensitive: false
   	],
   	bootstrap: [...]
   })
   export class AppModule {
   }

   ```

3. Inject the services you want in your components and/or use the available decorators

   ```typescript
   import { Component } from '@angular/core';
   import { LocalStorageService, SessionStorageService } from '@kruijt/ng-webstorage';

   @Component({
     selector: 'foo',
     template: `
       foobar
     `
   })
   export class FooComponent {
     constructor(private localSt: LocalStorageService) {}

     ngOnInit() {
       this.localSt.observe('key').subscribe(value => console.log('new value', value));
     }
   }
   ```

   ```typescript
   import { Component } from '@angular/core';
   import { LocalStorage, SessionStorage } from '@kruijt/ng-webstorage';

   @Component({
     selector: 'foo',
     template: `
       {{ boundValue }}
     `
   })
   export class FooComponent {
     @LocalStorage()
     public boundValue;
   }
   ```

### <a name="services">Services</a>

---

### <a name="s_localstorage">`LocalStorageService`</a>

#### Store( key:`string`, value:`any` ):`void`

> create or update an item in the local storage

##### Params:

- **key**: String. localStorage key.
- **value**: Serializable. value to store.

##### Usage:

```typescript
import { Component } from '@angular/core';
import { LocalStorageService } from '@kruijt/ng-webstorage';

@Component({
  selector: 'foo',
  template: `
    <section><input type="text" [(ngModel)]="attribute" /></section>
    <section><button (click)="saveValue()">Save</button></section>
  `
})
export class FooComponent {
  attribute;

  constructor(private storage: LocalStorageService) {}

  saveValue() {
    this.storage.store('boundValue', this.attribute);
  }
}
```

---

#### Retrieve( key:`string` ):`any`

> retrieve a value from the local storage

##### Params:

- **key**: String. localStorage key.

##### Result:

- Any; value

##### Usage:

```typescript
import { Component } from '@angular/core';
import { LocalStorageService } from '@kruijt/ng-webstorage';

@Component({
  selector: 'foo',
  template: `
    <section>{{ attribute }}</section>
    <section><button (click)="retrieveValue()">Retrieve</button></section>
  `
})
export class FooComponent {
  attribute;

  constructor(private storage: LocalStorageService) {}

  retrieveValue() {
    this.attribute = this.storage.retrieve('boundValue');
  }
}
```

---

#### Clear( key?:`string` ):`void`

##### Params:

- **key**: _(Optional)_ String. localStorage key.

##### Usage:

```typescript
import { Component } from '@angular/core';
import { LocalStorageService, LocalStorage } from '@kruijt/ng-webstorage';

@Component({
  selector: 'foo',
  template: `
    <section>{{ boundAttribute }}</section>
    <section><button (click)="clearItem()">Clear</button></section>
  `
})
export class FooComponent {
  @LocalStorage('boundValue')
  boundAttribute;

  constructor(private storage: LocalStorageService) {}

  clearItem() {
    this.storage.clear('boundValue');
    //this.storage.clear(); //clear all the managed storage items
  }
}
```

---

#### IsStorageAvailable():`boolean`

##### Usage:

```typescript
import { Component, OnInit } from '@angular/core';
import { LocalStorageService, LocalStorage } from '@kruijt/ng-webstorage';

@Component({
  selector: 'foo',
  template: `
    ...
  `
})
export class FooComponent implements OnInit {
  @LocalStorage('boundValue')
  boundAttribute;

  constructor(private storage: LocalStorageService) {}

  ngOnInit() {
    let isAvailable = this.storage.isStorageAvailable();
    console.log(isAvailable);
  }
}
```

---

#### Observe( key?:`string` ):`EventEmitter`

##### Params:

- **key**: _(Optional)_ localStorage key.

##### Result:

- Observable; instance of EventEmitter

##### Usage:

```typescript
import { Component } from '@angular/core';
import { LocalStorageService, LocalStorage } from '@kruijt/ng-webstorage';

@Component({
  selector: 'foo',
  template: `
    {{ boundAttribute }}
  `
})
export class FooComponent {
  @LocalStorage('boundValue')
  boundAttribute;

  constructor(private storage: LocalStorageService) {}

  ngOnInit() {
    this.storage.observe('boundValue').subscribe(newValue => {
      console.log(newValue);
    });
  }
}
```

### <a name="s_sessionstorage">`SessionStorageService`</a>

> The api is identical as the LocalStorageService's

### <a name="decorators">Decorators</a>

---

### <a name="d_localstorage">`@LocalStorage`</a>

> Synchronize the decorated attribute with a given value in the localStorage

#### Params:

- **storage key**: _(Optional)_ String. localStorage key, by default the decorator will take the attribute name.
- **default value**: _(Optional)_ Serializable. Default value

#### Usage:

```typescript
import { Component } from '@angular/core';
import { LocalStorage, SessionStorage } from '@kruijt/ng-webstorage';

@Component({
  selector: 'foo',
  template: `
    {{ boundAttribute }}
  `
})
export class FooComponent {
  @LocalStorage()
  public boundAttribute;
}
```

---

### <a name="d_sessionStorage">`@SessionStorage`</a>

> Synchronize the decorated attribute with a given value in the sessionStorage

#### Params:

- **storage key**: _(Optional)_ String. SessionStorage key, by default the decorator will take the attribute name.
- **default value**: _(Optional)_ Serializable. Default value

#### Usage:

```typescript
import { Component } from '@angular/core';
import { LocalStorage, SessionStorage } from '@kruijt/ng-webstorage';

@Component({
  selector: 'foo',
  template: `
    {{ randomName }}
  `
})
export class FooComponent {
  @SessionStorage('AnotherBoundAttribute')
  public randomName;
}
```

### <a name="knownissues">Known issues</a>

---

- _Serialization doesn't work for objects:_

NgWebstorage's decorators are based upon accessors so the update trigger only on assignation.
Consequence, if you change the value of a bound object's property the new model will not be store properly. The same thing will happen with a push into a bound array.
To handle this cases you have to trigger manually the accessor.

```typescript
import { LocalStorage } from '@kruijt/ng-webstorage';

class FooBar {
  @LocalStorage('prop')
  myArray;

  updateValue() {
    this.myArray.push('foobar');
    this.myArray = this.myArray; //does the trick
  }
}
```

### <a name="modifBuild">Modify and build</a>

---

`npm install`

_Start the unit tests:_ `npm run test`

_Start the unit tests:_ `npm run test:watch`

_Start the dev server:_ `npm run dev` then go to _http://localhost:8080/webpack-dev-server/index.html_
