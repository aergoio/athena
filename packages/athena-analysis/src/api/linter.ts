import { Lint } from "../model";

export default interface Linter {

  /**
   * Make lint list for provided analysis info.
   *
   * @param analysis an analysis info
   * 
   * @returns lint list
   */
  lint(analysis: any): Promise<Lint[]>;

}
