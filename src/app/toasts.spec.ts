import { TestBed } from '@angular/core/testing';
import {
  Toast,
  ActiveToast,
  ToastrModule,
  type ToastNoAnimation,
  ToastrService,
} from '@openng/ngx-toastr';
import { NotyfToast } from './notyf-toast/notyf-toast.component';
import { PinkToast } from './pink-toast/pink-toast.component';
import { firstValueFrom } from 'rxjs';
import type { BootstrapToast } from './bootstrap-toast/bootstrap-toast.component';
import { ToastManagerService } from './toast-manager.service';

describe('Toasts', () => {
  let toastManager!: ToastManagerService;
  let toastrService!: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          timeOut: 800,
          progressBar: true,
          onActivateTick: true,
          enableHtml: true,
        }),
      ],
      providers: [ToastManagerService, ToastrService],
    });

    toastManager = TestBed.inject(ToastManagerService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should trigger onShown', async () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened).toBeDefined();
    await firstValueFrom(opened.onShown);
  });

  it('should trigger onHidden', async () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened.portal).toBeDefined();
    await firstValueFrom(opened.onHidden);
  });

  it('should trigger onTap', async () => {
    const opened: ActiveToast<Toast> = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened.portal).toBeDefined();
    const onTap = firstValueFrom(opened.onTap);
    opened.portal.instance.tapToast();
    await onTap;
  });

  it('should extend life on mouseover and exit', () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options().timeOut).toBe(1000);
  });

  it('should keep on mouse exit with extended timeout 0', () => {
    toastrService.toastrConfig.extendedTimeOut = 0;
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options().timeOut).toBe(0);
  });

  it('should trigger onShown for openPinkToast', async () => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    await firstValueFrom(opened.onShown);
  });

  it('should trigger onAction for openPinkToast', async () => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    const onAction = firstValueFrom(opened.onAction);
    opened.portal.instance.action(new Event('click'));
    await onAction;
  });

  it('should trigger onHidden for openPinkToast', async () => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    await firstValueFrom(opened.onHidden);
  });

  it('should trigger onShown for openNotyf', async () => {
    const opened = toastManager.openNotyf() as ActiveToast<NotyfToast>;

    expect(opened.portal).toBeDefined();
    await firstValueFrom(opened.onShown);
  });

  it('should trigger onHidden for openNotyf', async () => {
    const opened = toastManager.openNotyf() as ActiveToast<NotyfToast>;

    expect(opened.portal).toBeDefined();
    await firstValueFrom(opened.onHidden);
  });

  it('should have defined componentInstance', () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should have defined componentInstance BootstrapToast', () => {
    const opened = toastManager.openBootstrapToast() as ActiveToast<BootstrapToast>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should have defined componentInstance ToastNoAnim', () => {
    const opened = toastManager.openToastNoAnimation() as ActiveToast<ToastNoAnimation>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should close all toasts', () => {
    vi.useFakeTimers();

    toastManager.openToastNoAnimation();
    toastManager.openToastNoAnimation();
    toastManager.openToastNoAnimation();

    expect(toastrService.currentlyActive).toBe(3);

    toastManager.clearToasts();
    vi.advanceTimersByTime(1);
    expect(toastrService.currentlyActive).toBe(0);

    vi.useRealTimers();
  });

  it('Should close last toast', async () => {
    toastManager.openToastNoAnimation();
    const lastToast = toastManager.openToastNoAnimation();
    expect(toastrService.currentlyActive).toBe(2);

    const onHidden = firstValueFrom(lastToast!.onHidden);
    toastManager.clearLastToast();
    await onHidden;
  });
});
