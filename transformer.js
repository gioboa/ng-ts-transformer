'use strict';
exports.__esModule = true;
var ts = require('typescript');
var findDecorator = function(decorators, name) {
  return (
    decorators.find(decorator => {
      let decoratorName = decorator.expression.expression.getText();
      return decoratorName === name;
    }) || null
  );
};
var transformer = function(context) {
  return function(rootNode) {
    var visitor = function(node) {
      if (findDecorator(node.decorators || [], 'Component')) {
        console.log('node', node.decorators.map(d => d.expression.getText()));
      }
      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(rootNode, visitor);
  };
};
exports['default'] = transformer;
