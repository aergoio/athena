export default interface Analyzer {

  /**
   * Analyze ast.
   *
   * @param source a source code
   * @param absolutePath an absolute path of source code used to resolve import statements
   *
   * @returns an analysis info
   */
  analyze(source: string, absolutePath?: string): Promise<any>;

}