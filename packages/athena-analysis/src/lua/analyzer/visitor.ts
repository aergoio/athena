export default interface Visitor {

  onCreateNode(node: any): void;

  onCreateScope(scope: any): void;

  onDestroyScope(scope: any): void;

  onLocalDeclaration(identifierName: string): void;

  onFunctionSignature(signature: any): void;

}