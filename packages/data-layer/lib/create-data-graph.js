"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createDataGraph;

var _createDataNode = require("./create-data-node");

var _createDataNode2 = _interopRequireDefault(_createDataNode);

var _createParser = require("./parser/create-parser");

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a data graph instance. Must pass in a connector object that implements a query method.
 * @see {@link Graph} for further information.
 * @memberof API
 */
function createDataGraph(connector) {
  (0, _invariant2.default)(typeof connector.query === "function", "invalid connector");

  var context = {
    connector: connector,
    parser: (0, _createParser.createParser)()
  };

  var childNodes = [];

  /**
   * An instance of a data graph. A data graph is basically a tree, where each
   * node represents a
   * @namespace Graph
   */
  var graphAPI = {
    registerParser: registerParser,
    children: children,
    data: data
  };

  /**
   * Registers a custom expression or transform parser. The `typeDef` argument
   * must be a valid type definition and the `typeParser` argument must be a
   * function that matches the type of an ExpressionParser or TransformParser
   * @see {@link https://github.com/mapd/mapd-data-layer/tree/master/src/parser/createParser.js|createParser.js}
   * @memberof Graph
   * @inner
   */
  function registerParser(typeDef, typeParser) {
    context.parser.registerParser(typeDef, typeParser);
  }

  /**
   * Returns all child data node instances of the graph.
   * @memberof Graph
   * @inner
   */
  function children() {
    return childNodes;
  }

  /**
   * Creates a root data node instance. The source must be specific in the
   * initial state. An example of a source, is a string pointing to a tables
   * or an array of source transformations.
   * @memberof Graph
   * @inner
   */
  function data(state) {
    var dataNode = (0, _createDataNode2.default)(context, typeof state === "string" || Array.isArray(state) ? { source: state, type: "root" } : _extends({}, state, { type: "root" }));
    childNodes.push(dataNode);
    return dataNode;
  }

  return graphAPI;
}