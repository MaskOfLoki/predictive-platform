/**
 * Created by Nikolay Glushchenko (nick@nickalie.com) on 06.03.2018.
 */

import * as NProgress from 'nprogress';

class LoadingService {
  private _count = 0;
  private _overlay: HTMLElement;

  public show(): void {
    if (this._count === 0) {
      NProgress.start();

      if (this._overlay == null) {
        this._overlay = document.createElement('div');
        this._overlay.classList.add('loading-overlay');
        document.body.appendChild(this._overlay);
      }
    }

    this._count++;
  }

  public hide(): void {
    if (this._count === 0) {
      return;
    }

    this._count--;

    if (this._count === 0) {
      setTimeout(this.innerHide.bind(this), 100);
    }
  }

  public wrap(promise: Promise<any>): Promise<any> {
    this.show();
    return promise.then(result => {
      this.hide();
      return result;
    }, error => {
      this.hide();
      throw error;
    });
  }

  private innerHide(): void {
    if (this._count === 0) {
      NProgress.done();

      if (this._overlay) {
        this._overlay.remove();
        this._overlay = null;
      }
    }
  }
}

export const loading: LoadingService = new LoadingService();
