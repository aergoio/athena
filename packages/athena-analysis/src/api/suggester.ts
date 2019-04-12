import { Suggestion } from "../model";

export default interface Suggester {

  /**
   * Make autocomplete suggestion for provided analysis info.
   *
   * @param analysis an analysis info
   * @param prefix a prefix
   * @param index a index of source code
   * 
   * @returns suggestion list
   */
  suggest(analysis: any, prefix: string, index: number): Promise<Suggestion[]>;

}