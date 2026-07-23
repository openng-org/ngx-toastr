<div align="center">
  <img src="https://raw.githubusercontent.com/openng-org/ngx-toastr/master/misc/documentation-assets/ngx-toastr-example.png" width="300" alt="Angular Toastr">
  <br>
  <h1>@openng/ngx-toastr</h1>
  <br>
  <a href="https://www.npmjs.com/package/@openng/ngx-toastr">
    <img src="https://badge.fury.io/js/%40openng%2Fngx-toastr.svg" alt="npm">
  </a>
  <a href="https://codecov.io/github/openng-org/ngx-toastr">
    <img src="https://img.shields.io/codecov/c/github/openng-org/ngx-toastr.svg" alt="codecov">
  </a>
  <br>
  <br>
</div>

DEMO: <https://ngx-toastr.vercel.app>

> [!NOTE]
> `@openng/ngx-toastr` is an OpenNG-maintained fork of the original
> [`ngx-toastr`](https://github.com/scttcper/ngx-toastr) project.

## Features

- Toast Component Injection without being passed `ViewContainerRef`
- No use of `@for`. Fewer dirty checks and higher performance
- No use of `@angular/animations`
- AoT compilation and lazy loading compatible
- Component inheritance for custom toasts
- SystemJS/UMD rollup bundle
- Output toasts to an optional target directive

## Dependencies

Latest version available for each version of Angular:

| `@openng/ngx-toastr` | Angular |
|----------------------|---------|
| 1.x                  | 21.x    |

(For older versions, see the original `ngx-toastr`.)

## Install

```bash
npm install @openng/ngx-toastr --save
```

## Setup

**step 1:** add css

- copy
  [toast css](/projects/ngx-toastr/src/lib/toastr.css)
  to your project.
- If you are using sass you can import the css.

```scss
// regular style toast
@import '@openng/ngx-toastr/toastr';

// bootstrap style toast
// or import a bootstrap 4 alert styled design (SASS ONLY)
// should be after your bootstrap imports, it uses bs4 variables, mixins, functions
@import '@openng/ngx-toastr/toastr-bs4-alert';

// if you'd like to use it without importing all of bootstrap it requires
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';
// bootstrap 4
@import '@openng/ngx-toastr/toastr-bs4-alert';
// boostrap 5
@import '@openng/ngx-toastr/toastr-bs5-alert';
```

- If you are using angular-cli you can add it to your angular.json

```ts
"styles": [
  "styles.scss",
  "node_modules/@openng/ngx-toastr/toastr.css"
]
```

**step 2:** add `ToastrModule` to app `NgModule`, or `provideToastr` to providers.

- Module based

```typescript
import { ToastrModule } from '@openng/ngx-toastr';

@NgModule({
  imports: [
    ToastrModule.forRoot(), // ToastrModule added
  ],
  bootstrap: [App],
  declarations: [App],
})
class MainModule {}
```

- Standalone

```typescript
import { AppComponent } from './src/app.component';
import { provideToastr } from '@openng/ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr(), // Toastr providers
  ]
});
```

## Use

```typescript
import { ToastrService } from '@openng/ngx-toastr';
import { inject } from '@angular/core';

@Component({...})
export class YourComponent {
  toastr = inject(ToastrService);

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
```

## Options

There are **individual options** and **global options**.

### Individual Options

Passed to `ToastrService.success/error/warning/info/show()`

| Option            | Type                           | Default                        | Description                                       |
| ----------------- | ------------------------------ | ------------------------------ | ------------------------------------------------- |
| toastComponent    | Component                      | Toast                          | Angular component that will be used               |
| closeButton       | boolean                        | false                          | Show close button                                 |
| timeOut           | number                         | 5000                           | Time to live in milliseconds                      |
| extendedTimeOut   | number                         | 1000                           | Time to close after a user hovers over toast      |
| disableTimeOut    | `boolean \| 'timeOut' \| 'extendedTimeOut'`  | false              | Disable both timeOut and extendedTimeOut when set to `true`. Allows specifying which timeOut to disable, either: `timeOut` or `extendedTimeOut` |
| easing            | string                         | 'ease-in'                      | Toast component easing                            |
| easeTime          | string \| number               | 300                            | Time spent easing                                 |
| enableHtml        | boolean                        | false                          | Allow html in message                             |
| newestOnTop       | boolean                        | true                           | New toast placement                               |
| progressBar       | boolean                        | false                          | Show progress bar                                 |
| progressAnimation | `'decreasing' \| 'increasing'` | 'decreasing'                   | Changes the animation of the progress bar.        |
| toastClass        | string                         | 'ngx-toastr'                   | CSS class(es) for toast                           |
| positionClass     | string                         | 'toast-top-right'              | CSS class(es) for toast container                 |
| titleClass        | string                         | 'toast-title'                  | CSS class(es) for inside toast on title           |
| messageClass      | string                         | 'toast-message'                | CSS class(es) for inside toast on message         |
| tapToDismiss      | boolean                        | true                           | Close on click                                    |
| onActivateTick    | boolean                        | false                          | Fires `changeDetectorRef.detectChanges()` when activated. Helps show toast from asynchronous events outside of Angular's change detection |

#### Setting Individual Options

success, error, info, warning take `(message, title, ToastConfig)` pass an
options object to replace any default option.

```typescript
this.toastrService.error('everything is broken', 'Major Error', {
  timeOut: 3000,
});
```

### Global Options

All [individual options](#individual-options) can be overridden in the global
options to affect all toasts. In addition, global options include the following
options:

| Option                  | Type    | Default                            | Description                                                        |
| ----------------------- | ------- | ---------------------------------- | ------------------------------------------------------------------ |
| maxOpened               | number  | 0                                  | Max toasts opened. Toasts will be queued. 0 is unlimited           |
| autoDismiss             | boolean | false                              | Dismiss current toast when max is reached                          |
| iconClasses             | object  | [see below](#iconclasses-defaults) | Classes used on toastr service methods                             |
| preventDuplicates       | boolean | false                              | Block duplicate messages                                           |
| countDuplicates         | boolean | false                              | Displays a duplicates counter (preventDuplicates must be true). Toast must have a title and duplicate message |
| resetTimeoutOnDuplicate | boolean | false                              | Reset toast timeout on duplicate (preventDuplicates must be true)  |
| includeTitleDuplicates  | boolean | false                              | Include the title of a toast when checking for duplicates (by default only message is compared) |

##### iconClasses defaults

```typescript
iconClasses = {
  error: 'toast-error',
  info: 'toast-info',
  success: 'toast-success',
  warning: 'toast-warning',
};
```

#### Setting Global Options

Pass values to `ToastrModule.forRoot()` or `provideToastr()` to set global options.

- Module based

```typescript
// root app NgModule
imports: [
  ToastrModule.forRoot({
    timeOut: 10000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
  }),
],
```

- Standalone

```typescript
import { AppComponent } from './src/app.component';
import { provideToastr } from '@openng/ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }), 
  ]
});
```

### Toastr Service methods return

```typescript
export interface ActiveToast {
  /** Your Toast ID. Use this to close it individually */
  toastId: number;
  /** the title of your toast. Stored to prevent duplicates if includeTitleDuplicates set */
  title: string;
  /** the message of your toast. Stored to prevent duplicates */
  message: string;
  /** a reference to the component see portal.ts */
  portal: ComponentRef<any>;
  /** a reference to your toast */
  toastRef: ToastRef<any>;
  /** triggered when toast is active */
  onShown: Observable<any>;
  /** triggered when toast is destroyed */
  onHidden: Observable<any>;
  /** triggered on toast click */
  onTap: Observable<any>;
  /** available for your use in custom toast */
  onAction: Observable<any>;
}
```

### Put toasts in your own container

Put toasts in a specific div inside your application. This should probably be
somewhere that doesn't get deleted. Add `ToastContainerDirective` to the ngModule
where you need the directive available. Make sure that your container has
an `aria-live="polite"` attribute, so that any time a toast is injected into
the container it is announced by screen readers.

```typescript
import { NgModule } from '@angular/core';
import { ToastrModule, ToastContainerDirective } from '@openng/ngx-toastr';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ToastrModule.forRoot({ positionClass: 'inline' }),
    ToastContainerDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Add a div with `toastContainer` directive on it.

```typescript
import { Component, OnInit, viewChild, inject } from '@angular/core';
import { ToastContainerDirective, ToastrService } from '@openng/ngx-toastr';

@Component({
  selector: 'app-root',
  template: `
    <h1><a (click)="onClick()">Click</a></h1>
    <div aria-live="polite" toastContainer></div>
  `,
})
export class AppComponent implements OnInit {
  toastContainer = viewChild(ToastContainerDirective, { static: true });
  toastrService = inject(ToastrService);

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }
  onClick() {
    this.toastrService.success('in div');
  }
}
```

## Functions

##### Clear

Remove all or a single toast by optional id

```ts
toastrService.clear(toastId?: number);
```

##### Remove

Remove and destroy a single toast by id

```ts
toastrService.remove(toastId: number);
```

## Setup Without Animations

If you do not want animations you can override the default
toast component in the global config to use
`ToastNoAnimation` instead of the default one.

In your main module (ex: `app.module.ts`)

```typescript
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule } from '@openng/ngx-toastr';

@NgModule({
  imports: [
    // ...
    ToastNoAnimationModule.forRoot(),
  ],
  // ...
})
class AppModule {}
```

That's it! No animations.

## Using A Custom Toast

Create your toast component extending Toast see the demo's pink toast for an example
<https://github.com/openng-org/ngx-toastr/blob/master/src/app/pink-toast/pink-toast.component.ts>

```typescript
import { ToastrModule } from '@openng/ngx-toastr';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      toastComponent: YourToastComponent, // added custom toast!
    }),
  ],
  bootstrap: [App],
  declarations: [App, YourToastComponent], // add!
})
class AppModule {}
```

## FAQ

1.  ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it
    was checked\
    When opening a toast inside an angular lifecycle wrap it in setTimeout

```typescript
ngOnInit() {
    setTimeout(() => this.toastr.success('sup'))
}
```

2.  Change default icons (check, warning sign, etc)\
    Overwrite the css background-image: <https://github.com/openng-org/ngx-toastr/blob/master/projects/ngx-toastr/src/lib/toastr.css>.
3.  How do I use this in an ErrorHandler?\
    See: <https://github.com/scttcper/ngx-toastr/issues/179>.
4.  How can I translate messages?\
    See: <https://github.com/scttcper/ngx-toastr/issues/201>.
5.  How to handle toastr click/tap action?

    ```ts
    showToaster() {
      this.toastr.success('Hello world!', 'Toastr fun!')
        .onTap
        .pipe(take(1))
        .subscribe(() => this.toasterClickedHandler());
    }

    toasterClickedHandler() {
      console.log('Toastr clicked');
    }
    ```

6. How to customize styling without overridding defaults?\
    Add multiple CSS classes separated by a space:

    ```ts
    toastClass: 'yourclass ngx-toastr'
    ```

    See: <https://github.com/scttcper/ngx-toastr/issues/594>.

## Previous Works

[toastr](https://github.com/CodeSeven/toastr) original toastr\
[angular-toastr](https://github.com/Foxandxss/angular-toastr) AngularJS toastr\
[notyf](https://github.com/caroso1222/notyf) notyf (css)

## License

MIT

---

Maintained by [OpenNG](https://www.openng.org/).

Originally created by GitHub [@scttcper](https://github.com/scttcper) &nbsp;&middot;&nbsp;
Twitter [@scttcper](https://twitter.com/scttcper)
