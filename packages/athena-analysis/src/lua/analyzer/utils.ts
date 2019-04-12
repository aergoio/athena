export const buildFuncSnippet = (funcName: string, parameters: any[]) => {
  const asPlaceholder = (index: number, name: string) => "${" + (index + 1) + ":" + name + "}";
  return funcName + "(" + parameters.reduce((acc, curr, index) => {
    if (0 !== index) {
      return  acc + ", " + asPlaceholder(index, curr.name);
    }
    return asPlaceholder(index, curr.name);
  }, "") + ")";
}