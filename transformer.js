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
      const decorator = findDecorator(node.decorators || [], 'Component');
      if (!!decorator) {
        let oldSelector = '';
        let newSelector = '';
        if (rootNode.fileName.indexOf(`standard.component.ts`) !== -1) {
          oldSelector = `selector: 'app-standard'`;
          newSelector = `selector: 'exclude-app-standard'`;
        } else if (rootNode.fileName.indexOf(`custom.component.ts`) !== -1) {
          oldSelector = `selector: 'app-custom'`;
          newSelector = `selector: 'app-standard'`;
        }
        // angular doesn't care about this replace :-(
        rootNode.text = rootNode.text.replace(oldSelector, newSelector);
        // console.log(rootNode.text); // debug
      }
      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(rootNode, visitor);
  };
};
exports['default'] = transformer;
