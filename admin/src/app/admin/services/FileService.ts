import { IGCFileData } from '@gamechangerinteractive/gc-firebase';
import { uuid } from '@gamechangerinteractive/gc-firebase/utils';
import { api } from './api';

class FileService {
  private _input: HTMLInputElement;

  constructor() {
    this._input = document.createElement('input');
    this._input.type = 'file';
    this._input.style.position = 'absolute';
    this._input.style.opacity = '0';
    this._input.style['pointer-events'] = 'none';
    document.body.appendChild(this._input);
  }

  public select(accept = '.png, .jpg, .jpeg, .svg'): Promise<File> {
    if (this._input) {
      this._input.remove();
    }

    this._input = document.createElement('input');
    this._input.type = 'file';
    this._input.style.position = 'absolute';
    this._input.style.opacity = '0';
    this._input.style['pointer-events'] = 'none';
    this._input.accept = accept;

    return new Promise<File>((resolve, reject) => {
      const handler = () => {
        this._input.removeEventListener('change', handler);

        if (this._input.files.length === 0) {
          reject('nothing was selected');
          return;
        }

        resolve(this._input.files[0]);
        this._input.value = null;
      };

      this._input.addEventListener('change', handler);
      this._input.click();
    });
  }

  public selectImage(
    accept: string[] = ['jpg', 'jpeg', 'png', 'svg'],
  ): Promise<File> {
    if (this._input) {
      this._input.remove();
    }

    this._input = document.createElement('input');
    this._input.type = 'file';
    this._input.style.position = 'absolute';
    this._input.style.opacity = '0';
    this._input.style['pointer-events'] = 'none';
    this._input.accept = accept.join(',');

    return new Promise<File>((resolve, reject) => {
      const handler = () => {
        this._input.removeEventListener('change', handler);

        if (this._input.files.length === 0) {
          reject('nothing was selected');
          return;
        }

        resolve(this._input.files[0]);
        this._input.value = null;
      };

      this._input.addEventListener('change', handler);
      this._input.click();
    });
  }

  public async upload(file: File): Promise<IGCFileData> {
    const ref = uuid() + file.name;
    return api.uploadFile(ref, file);
  }

  public async selectAndUploadImage(
    extensions: string[] = ['jpg', 'jpeg', 'png', 'svg'],
    aspectRatio = 0,
  ): Promise<IGCFileData> {
    const file = await this.selectImage(extensions);

    if (aspectRatio > 0) {
      const img = new Image();

      img.src = window.URL.createObjectURL(file);

      return new Promise((resolve, reject) => {
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;

          window.URL.revokeObjectURL(img.src);
          const ratio = width / height;

          if (Math.abs(ratio - aspectRatio) < 0.1) {
            this.upload(file).then(resolve).catch(reject);
          } else {
            reject({
              error: 'Incorrect aspect ratio',
              expected: aspectRatio,
              received: ratio,
            });
          }
        };
      });
    } else {
      return this.upload(file);
    }
  }

  public async removeFile(value: IGCFileData): Promise<void> {
    return api.removeFile(value.path);
  }
}

export const fileService: FileService = new FileService();
