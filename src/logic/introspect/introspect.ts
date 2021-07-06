/* eslint-disable no-restricted-syntax */
import * as ts from 'typescript';

type DomainObjectMetadata = any;

const nodeIsADomainObjectClass = (node: ts.Node): node is ts.ClassDeclaration & { name: string } => {
  // if this node does not reference a domain-object class, return nothing
  if (!ts.isClassDeclaration(node)) return false; // not a class, not of interest
  if (!node.name) return false; // no name, not of interest
  if (!node.heritageClauses?.some((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword)) return false; // does not extend anything, not of interest
  console.log(node.heritageClauses);
  return true;
};

// const extractDomainObjectMetadataFromSourceFileNode = ({ node, checker }: { node: ts.Node, checker: ts.TypeChecker }) => {
//   // if this is a namespace, visit its children
//   if (!nodeIsADomainObjectClass(node))

//   // if it is a domain object though, grab its deets
//     let symbol = checker.getSymbolAtLocation(node.name);
//     if (symbol) {
//       output.push(serializeClass(symbol));
//     }
//     // No need to walk any further, class expressions/inner declarations
//     // cannot be exported
//   } else if (ts.isModuleDeclaration(node)) {
//     // This is a namespace, visit its children
//     ts.forEachChild(node, visit);
//   }
// };

export const introspect = (filePaths: string | string[]) => {
  // normalize the input
  const filePathsToIntrospect = Array.isArray(filePaths) ? filePaths : [filePaths]; // normalize to array, since its the most general case

  // create a "program" instance: a collection of source files
  const program = ts.createProgram(filePathsToIntrospect, {});

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();
  const output: DomainObjectMetadata[] = [];

  // for each non-node-module file in the program, go through it and find all of the DomainObject definitions

  // visit every node in the files to define the domain object class definition nodes
  const domainObjectClassDefinitionNodes: ts.Node[] = [];
  program.getSourceFiles().forEach((sourceFile) => {
    console.log(Object.keys(sourceFile));
  });
  // for (const sourceFile of program.getSourceFiles()) {
  //   console.log(sourceFile);
  //   if (!sourceFile.isDeclarationFile) {
  //     // walk the tree to search for domain-objects
  //     ts.forEachChild(sourceFile, (node) => {
  //       const metadata = extractDomainObjectMetadataFromSourceFileNode({ node });
  //     });
  //   }
  // }

  // // Visit every sourceFile in the program
  // for (const sourceFile of program.getSourceFiles()) {
  //   if (!sourceFile.isDeclarationFile) {
  //     // walk the tree to search for domain-objects
  //     ts.forEachChild(sourceFile, (node) => {
  //       const metadata = extractDomainObjectMetadataFromSourceFileNode({ node });
  //     });
  //   }
  // }
  // print out the doc
  console.log(JSON.stringify(output, undefined, 2));
};
