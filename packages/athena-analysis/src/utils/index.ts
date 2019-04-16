export const buildFuncSnippet = (funcName: string, parameters: any[]): string => {
  const asPlaceholder = (index: number, name: string): string => "${" + (index + 1) + ":" + name + "}";
  return funcName + "(" + parameters.reduce((acc, curr, index): string => {
    if (0 !== index) {
      return  acc + ", " + asPlaceholder(index, curr);
    }
    return asPlaceholder(index, curr);
  }, "") + ")";
}

export const contains = (target: string, prefix: string): boolean => {
  if (null == target || typeof target == "undefined") {
    return false;
  }
  if (null == prefix || typeof prefix == "undefined") {
    return false;
  }
  if (target.length < prefix.length) {
    return false;
  }

  const toLower = (v: number): number => (65 <= v && v <= 90) ? v + 32 : v;
  for (let i = 0; i < prefix.length; ++i) {
    if (toLower(target.charCodeAt(i)) !== toLower(prefix.charCodeAt(i))) {
      return false;
    }
  }

  return true;
}