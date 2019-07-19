'use strict';
exports.__esModule = true;
var ts = require('typescript');
const findDecorator = (decorators, name) => {
  return decorators.find(decorator => decorator.expression.expression.getText() === name);
};
// const decoratorToMetadata = decorator => {
//   console.log(decorator.args);
//   // // Decorators have a type.
//   // const properties = [ts.createPropertyAssignment('type', ts.getMutableClone(decorator.identifier))];
//   // // Sometimes they have arguments.
//   // if (decorator.args !== null && decorator.args.length > 0) {
//   //   const args = decorator.args.map(arg => ts.getMutableClone(arg));
//   //   properties.push(ts.createPropertyAssignment('args', ts.createArrayLiteral(args)));
//   // }
//   // return ts.createObjectLiteral(properties, true);
// };
const getMetadataProperty = (metadata, propertyName) => {
  if (!metadata) {
    return null;
  }
  const properties = metadata.properties;
  const property = (properties || [])
    .filter(prop => prop.kind === ts.SyntaxKind.PropertyAssignment)
    .filter(prop => {
      const name = prop.name;
      switch (name.kind) {
        case ts.SyntaxKind.Identifier:
          return name.getText() === propertyName;
        case ts.SyntaxKind.StringLiteral:
          return name.text === propertyName;
      }
      return false;
    })[0];
  return property;
};
const isDecorator = node => {
  return node.kind == ts.SyntaxKind.Decorator && node.expression.kind == ts.SyntaxKind.CallExpression;
};
const extractMetadataIfComponent = expression => {
  const identifier = 'Component';
  return [expression]
    .filter(expr => {
      if (expr.expression.kind == ts.SyntaxKind.Identifier) {
        const id = expr.expression;
        return id.text === identifier;
      }
      //  else if (expr.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
      //   // This covers foo.NgModule when importing * as foo.
      //   const paExpr = expr.expression;
      //   // If the left expression is not an identifier, just give up at that point.
      //   if (paExpr.expression.kind !== ts.SyntaxKind.Identifier) {
      //     return false;
      //   }
      //   const id = paExpr.name.text;
      //   const moduleId = paExpr.expression.text;
      //   return id === identifier;
      // }

      return false;
    })
    .filter(expr => expr.arguments[0] && expr.arguments[0].kind == ts.SyntaxKind.ObjectLiteralExpression)
    .map(expr => expr.arguments[0])[0];
};
const updateComponentProperties = (metadata, newSelector) => {
  const newProperties = [];
  metadata.properties.forEach(prop => {
    switch (prop.name.text) {
      case 'selector':
        newProperties.push(ts.updatePropertyAssignment(prop, ts.createIdentifier('selector'), ts.createLiteral(newSelector)));
        break;
      default:
        newProperties.push(prop);
    }
  });
  return newProperties;
};
const transformer = context => {
  return rootNode => {
    var visit = node => {
      if (!!isDecorator(node)) {
        let metadata = extractMetadataIfComponent(node.expression);
        if (!!metadata) {
          const expr = node.expression;
          const newArguments = updateComponentProperties(metadata, 'ciao');

          console.log(ts.updateDecorator(node, ts.updateCall(expr, expr.expression, expr.typeArguments, newArguments)));
          return ts.updateDecorator(node, ts.updateCall(expr, expr.expression, expr.typeArguments, newArguments));
          // const bbbb = extractMetadataIfComponent(node.expression);
          // console.log(getMetadataProperty(bbbb, 'selector').getText());
          // console.log(getMetadataProperty(bbbb, 'templateUrl').getText());
          // console.log(getMetadataProperty(bbbb, 'hello').getText());
        }
      }
      return ts.visitEachChild(node, visit, context);
    };
    return ts.visitNode(rootNode, visit);
  };
};
exports['default'] = transformer;
