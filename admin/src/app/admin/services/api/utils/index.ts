export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r: number = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 *
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function isEmptyString(value: string): boolean {
  return (
    !value ||
    typeof value !== 'string' ||
    value.split(' ').join('').length === 0
  );
}

/**
 *
 *
 * @export
 * @template T
 * @param {() => Promise<T>} fn
 * @param {number} [attempts=5]
 * @param {number} [interval=5000]
 * @returns {Promise<T>}
 */
export function promiseAttempts<T>(
  fn: () => Promise<T>,
  attempts = 5,
  interval = 5000,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let count = 0;

    const timerHandler = (): void => {
      fn().then(resolve, (error) => {
        count++;
        if (count < attempts) {
          setTimeout(timerHandler, interval);
        } else {
          reject(error);
        }
      });
    };

    timerHandler();
  });
}

/**
 * Returns random numeric value from min to max
 * @param {number} min
 * @param {number} max
 */
export function randNumber(min: number, max?: number): number {
  if (max == null) {
    max = min;
    min = 0;
  } else if (max < min) {
    [max, min] = [min, max];
  }

  return min + Math.random() * (max - min);
}

/**
 * Returns random integer value from min to max
 * @param {number} min
 * @param {number} max
 */
export function randInt(min: number, max?: number): number {
  return Math.floor(randNumber(min, max));
}

/**
 *
 *
 * @export
 * @param {number} value
 * @returns {Promise<void>}
 */
export function delay(value: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, value));
}

/**
 * Checks if current device is Android
 *
 *
 * @export
 * @returns {boolean}
 */
export function isAndroid(): boolean {
  if (typeof navigator !== 'undefined') {
    return /(android)/i.test(navigator.userAgent);
  } else {
    return false;
  }
}

/**
 * Checks if current device is iOS
 *
 * @export
 * @returns {boolean}
 */
export function isIOS(): boolean {
  if (typeof navigator !== 'undefined') {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  } else {
    return false;
  }
}

/**
 *
 *
 * @export
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function cloneObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function numberWithCommas(x: number): string {
  if (x == null) {
    return '';
  }

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function removeNulls(value) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] == null) {
        value.splice(i, 1);
        i--;
      }
    }
  }

  if (typeof value !== 'object') {
    return;
  }

  for (const s in value) {
    if (value[s] == null) {
      delete value[s];
    } else {
      removeNulls(value[s]);
    }
  }
}

export function deepMerge(target, source) {
  for (const s in source) {
    const sourceValue = source[s];

    if (sourceValue == null) {
      delete target[s];
    } else if (typeof sourceValue === 'object') {
      if (typeof target[s] === 'object') {
        deepMerge(target[s], sourceValue);
      } else {
        target[s] = sourceValue;
      }
    } else {
      target[s] = sourceValue;
    }
  }
}

export function mergeNulls(target, source) {
  if (typeof target !== 'object' || typeof source !== 'object') {
    return;
  }

  for (const s in target) {
    if (typeof source[s] === 'undefined') {
      target[s] = null;
    } else {
      mergeNulls(target[s], source[s]);
    }
  }
}

export function fixDate(date): Date {
  if (typeof date === 'string') {
    return new Date(date);
  } else if (typeof date.toDate === 'function') {
    return date.toDate();
  }

  return date;
}

export type Unwatch = () => void;

export function getFieldValue<T, S>(target: T, field: string): S {
  const fieldParts = field.split('.');
  let fieldValue: any = target;

  while (fieldParts.length > 0) {
    const fieldPart = fieldParts.shift();

    if (fieldValue[fieldPart] == null) {
      fieldValue = undefined;
      break;
    }

    fieldValue = fieldValue[fieldPart];
  }

  return fieldValue;
}

export function setFieldValue<T, S>(target: T, field: string, value: S) {
  deepMerge(target, buildObjectByFieldValue(field, value));
}

export function buildObjectByFieldValue<T, S>(field: string, value: S) {
  const fieldParts = field.split('.');
  const obj = {};
  let objPart = obj;

  while (fieldParts.length > 1) {
    const fieldPart = fieldParts.shift();
    objPart = objPart[fieldPart] = {};
  }

  objPart[fieldParts.shift()] = value;
  return obj;
}

export function getFileExtension(url: string): string {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

const imageExtensions = ['png', 'jpg', 'jpeg', 'svg'];

export function isImageURL(url: string): boolean {
  return imageExtensions.includes(getFileExtension(url).toLowerCase());
}
