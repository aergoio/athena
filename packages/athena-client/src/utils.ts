/**
 * Check an argument is empty or not.
 *
 * @param o a target to check whether is empty
 * @return an empty check result
 */
export const isEmpty = (o: string | undefined | any): boolean => {
  if (typeof o === "undefined" || null == o) {
    return true;
  }
  if (typeof o === "string" && "" === o) {
    return true;
  }
  if (typeof o === "object" && "" === o) {
    return true;
  }
  return false;
}

/**
 * Assert target is empty.
 *
 * @param o a target
 * @param message a message to throw when target is empty
 */
export const assertNotEmpty = (o: string | undefined | any, message?: string): void => {
  if (isEmpty(o)) {
    throw new Error(typeof message === "undefined" ? (o + " should not empty") : message);
  }
}