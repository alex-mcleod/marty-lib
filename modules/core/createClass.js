'use strict';

var _ = require('../mindash');

function createClass(properties, defaultOptions, BaseType) {
  function Class(options) {
    classCallCheck(this, Class);
    this.id = properties.id;
    this.displayName = properties.displayName;

    var base = get(Object.getPrototypeOf(Class.prototype), 'constructor', this);
    var baseOptions = _.extend({}, defaultOptions, options, properties);

    if (defaultOptions.dispatcher) {
      baseOptions.dispatcher = defaultOptions.dispatcher;
    }

    base.call(this, baseOptions);
  }

  if (BaseType) {
    inherits(Class, BaseType);
  }

  _.extend(Class.prototype, properties);

  Class.id = properties.id;
  Class.displayName = properties.displayName;

  return Class;
}

function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    _again = false;

    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var _parent = Object.getPrototypeOf(object);
      if (_parent === null) {
        return undefined;
      } else {
        _x = _parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        desc = _parent = undefined;
        continue _function;
      }
    } else if ('value' in desc && desc.writable) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  }
}

function inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (superClass) {
    subClass.__proto__ = superClass;
  }
}

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

module.exports = createClass;