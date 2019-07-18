'use strict';
exports.__esModule = true;
var ts = require('typescript');
var transformer = function(context) {
  return function(rootNode) {
    var visitor = function(node) {
      if (rootNode.fileName.indexOf('.component.' !== -1) && node.decorators) {
        console.log('node', node.decorators.map(d => d.expression.getText()));
      }
      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(rootNode, visitor);
  };
};
exports['default'] = transformer;
