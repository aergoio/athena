export default class LuaLint {
  type: string;
  file: string;
  index: number;
  message: string;

  constructor(type: string, file: string, index: number, message: string) {
    this.type = type;
    this.file = file;
    this.index = index;
    this.message = message;
  }

}
