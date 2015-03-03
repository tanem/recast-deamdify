var through = require('through');
var recast = require('recast');
var zip = require('lodash.zip');
var compose = require('lodash.compose');

module.exports = function(){

  var data = '';

  return through(write, end);

  function write(buf) {
    data += buf;
  }

  function end() {

    var source = data.toString();
    var ast = recast.parse(source);
    var body = ast.program.body[0];
    var factoryBody = getFactoryBody(body);
    var transform;

    if (isAMD(body)) {
      transform = compose(
        scrubVariableLoc,
        createModuleExport
      );

      if (!isSimplifiedCommonJs(body)) {
        var names = getFactoryParams(body);
        var values = getDependencies(body);
        transform = compose(
          transform,
          injectNewVariableDeclarations(
            createNewVariableDeclarations(names, values)
          )
        );
      }

      ast.program.body = transform(factoryBody);
      this.queue(recast.print(ast, { quote: 'single' }).code);

    } else {
      this.queue(source);
    }

    this.queue(null);

  }

};

function isAMD(body) {
  return body.type === 'ExpressionStatement' &&
    body.expression.type === 'CallExpression' &&
    body.expression.callee.name === 'define';
}

function isSimplifiedCommonJs(body) {
  return body.expression.arguments
    .filter(function(argument){
      return argument.type === 'FunctionExpression';
    })
    .map(function(argument){
      return argument.params;
    })
    .reduce(function(prev){
      return prev;
    })
    .some(function(param){
      return param.name === 'require';
    });
}

// This gives the outputted var declaration format we want.
function scrubVariableLoc(factoryBody) {
  return factoryBody
    .map(function(node){
      if (node.type === 'VariableDeclaration' && node.loc) {
        delete node.loc;
      }
      return node;
    });
}

function getDependencies(body) {
  return body.expression.arguments
  .filter(function(argument){
    return argument.type === 'ArrayExpression';
  })
  .map(function(argument){
    return argument.elements;
  })
  .reduce(function(prev, curr){
    return curr || prev;
  }, [])
  .map(function(element){
    return element.value;
  });
}

function getFactoryParams(body) {
  return body.expression.arguments
  .filter(function(argument){
    return argument.type === 'FunctionExpression';
  })
  .map(function(argument){
    return argument.params;
  })
  .reduce(function(prev){
    return prev;
  })
  .map(function(param){
    return param.name;
  });
}

function getFactoryBody(body) {
  return body.expression.arguments
  .filter(function(argument){
    return argument.type === 'FunctionExpression';
  })
  .map(function(argument){
    return argument.body.body;
  })
  .reduce(function(prev){
    return prev;
  });
}

function injectNewVariableDeclarations(newVariableDeclarations) {
  return function(factoryBody){
    var result = factoryBody.slice();
    var variableDeclarationIndex;
    result.some(function(node, index){
      if (node.type === 'VariableDeclaration') {
        variableDeclarationIndex = index;
        return true;
      }
    });
    result.splice.apply(result, [variableDeclarationIndex, 0].concat(newVariableDeclarations));
    return result;
  };
}

function createModuleExport(factoryBody) {
  return factoryBody
  .map(function(node){
    if (node.type === 'ReturnStatement') {
      return {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: 'module'
            },
            property: {
              type: 'Identifier',
              name: 'exports'
            }
          },
          right: node.argument
        }
      };
    } else {
      return node;
    }
  });
}

function getFactoryReturnArgument(factoryBody) {
  return factoryBody
  .filter(function(node){
    return node.type === 'ReturnStatement';
  })
  .map(function(returnStatement){
    return returnStatement.argument;
  })
  .reduce(function(prev){
    return prev;
  });
}

function createNewVariableDeclarations(names, values) {
  return zip(names, values)
    .map(function(pair){
      return createNewVariableDeclaration(pair[0], pair[1]);
    });
}

function createNewVariableDeclaration(name, value) {
  return {
    type: 'VariableDeclaration',
    kind: 'var',
    declarations: [{
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
        name: name
      },
      init: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require'
        },
        arguments: [{
          type: 'Literal',
          value: value
        }]
      }
    }]
  };
}