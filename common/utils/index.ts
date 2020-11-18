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
