'use strict'

exports.__esModule = true

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _lodash = require('lodash.debounce')

var _lodash2 = _interopRequireDefault(_lodash)

var _utils = require('./utils')

var _BreakpointsContext = require('./BreakpointsContext')

var _messages = require('./messages')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass,
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var ReactBreakpoints = (function(_React$Component) {
  _inherits(ReactBreakpoints, _React$Component)

  function ReactBreakpoints(props) {
    _classCallCheck(this, ReactBreakpoints)

    var _this = _possibleConstructorReturn(
      this,
      _React$Component.call(this, props),
    )

    _this.readWidth = function(event) {
      var _this$props = _this.props,
        breakpointUnit = _this$props.breakpointUnit,
        snapMode = _this$props.snapMode

      var width = event
        ? event.target.innerWidth
          ? event.target.innerWidth
          : window.innerWidth
        : window.innerWidth
      var screenWidth =
        breakpointUnit === 'em'
          ? (0, _utils.stripUnit)((0, _utils.em)(width))
          : width
      var current = _this.calculateCurrentBreakpoint(screenWidth)

      _this.setState(function(state) {
        if (state.currentBreakpoint === current) return null
        return {
          currentBreakpoint: snapMode ? current : null,
          screenWidth: snapMode ? null : screenWidth,
        }
      })
    }

    _this.getContextValues = function() {
      return _extends(
        {
          breakpoints: _extends({}, _this.props.breakpoints),
        },
        _this.props.snapMode && {
          currentBreakpoint: _this.state.currentBreakpoint,
        },
        !_this.props.snapMode && {
          screenWidth: _this.state.screenWidth,
        },
      )
    }

    var _this$props2 = _this.props,
      breakpoints = _this$props2.breakpoints,
      defaultBreakpoint = _this$props2.defaultBreakpoint,
      guessedBreakpoint = _this$props2.guessedBreakpoint

    // throw Error if no breakpoints were passed

    if (!breakpoints) throw new Error(_messages.ERRORS.NO_BREAKPOINTS)
    // throw Error if breakpoints is not an object
    if (
      (typeof breakpoints === 'undefined'
        ? 'undefined'
        : _typeof(breakpoints)) !== 'object'
    )
      throw new Error(_messages.ERRORS.NOT_OBJECT)

    var currentBreakpoint = null

    // if we are on the client, we directly compote the breakpoint using window width
    if (global.window) {
      currentBreakpoint = _this.calculateCurrentBreakpoint(
        global.window.innerWidth,
      )
    } else if (guessedBreakpoint) {
      currentBreakpoint = _this.calculateCurrentBreakpoint(guessedBreakpoint)
    } else if (defaultBreakpoint) {
      currentBreakpoint = _this.calculateCurrentBreakpoint(defaultBreakpoint)
    }
    _this.state = {
      breakpoints: breakpoints || {},
      // if we are on the client, we set the screen width to the window width,
      // otherwise, we use the default breakpoint
      screenWidth: global.window ? global.window.innerWidth : defaultBreakpoint,
      currentBreakpoint: currentBreakpoint,
    }
    return _this
  }

  ReactBreakpoints.prototype.componentDidMount = function componentDidMount() {
    if (typeof window !== 'undefined') {
      this.readWidth() // initial width calculation

      if (this.props.debounceResize) {
        window.addEventListener(
          'resize',
          (0, _lodash2.default)(this.readWidth, this.props.debounceDelay),
        )
      } else {
        window.addEventListener('resize', this.readWidth)
      }
      window.addEventListener('orientationchange', this.readWidth)
    }
  }

  ReactBreakpoints.prototype.componentWillUnmount = function componentWillUnmount() {
    if (typeof window !== 'undefined') {
      if (this.props.debounceResize) {
        window.addEventListener(
          'resize',
          (0, _lodash2.default)(this.readWidth, this.props.debounceDelay),
        )
      } else {
        window.addEventListener('resize', this.readWidth)
      }
      window.removeEventListener('orientationchange', this.readWidth)
    }
  }

  ReactBreakpoints.prototype.calculateCurrentBreakpoint = function calculateCurrentBreakpoint(
    screenWidth,
  ) {
    var _this2 = this

    var breakpoints = Object.keys(this.props.breakpoints)
      .map(function(k) {
        return [k, _this2.props.breakpoints[k]]
      })
      .sort(function(a, b) {
        return a[1] < b[1]
      })
    for (
      var _iterator = breakpoints,
        _isArray = Array.isArray(_iterator),
        _i = 0,
        _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
      ;

    ) {
      var _ref

      if (_isArray) {
        if (_i >= _iterator.length) break
        _ref = _iterator[_i++]
      } else {
        _i = _iterator.next()
        if (_i.done) break
        _ref = _i.value
      }

      var b = _ref

      if (screenWidth >= b[1]) {
        return b[0]
      }
    }
    // screenWidth is below lowest breakpoint,
    // so it will still be set to equal lowest breakpoint instead of null
    return breakpoints[breakpoints.length - 1][0]
  }

  ReactBreakpoints.prototype.render = function render() {
    var children = this.props.children

    return _react2.default.createElement(
      _BreakpointsContext.Provider,
      { value: this.getContextValues() },
      children && children,
    )
  }

  return ReactBreakpoints
})(_react2.default.Component)

ReactBreakpoints.defaultProps = {
  breakpointUnit: 'px',
  debounceResize: false,
  debounceDelay: 50,
  snapMode: true,
}
ReactBreakpoints.propTypes = {
  /*
    @breakpoints
    Your breakpoints object.
   */
  breakpoints: _propTypes2.default.objectOf(_propTypes2.default.number),
  /*
    @breakpointUnit
    The type of unit that your breakpoints should use - px or em.
   */
  breakpointUnit: _propTypes2.default.oneOf(['px', 'em']),
  /*
    @guessedBreakpoint
    When rendering on the server, you can do your own magic with for example UA
    to guess which viewport width a user probably has.
   */
  guessedBreakpoint: _propTypes2.default.number, // from server
  /*
    @defaultBreakpoint
    In case you don't want to default to mobile on SSR and no guessedBreakpoint
    is passed, use defaultBreakpoint to set your own value.
   */
  defaultBreakpoint: _propTypes2.default.number,
  /*
    @debounceResize
    If you don't want the resize listener to be debounced, set to false. Defaults to false 
    when snapMode is true.
   */
  debounceResize: _propTypes2.default.bool,
  /*
    @debounceDelay: number
    Set a custom delay for how long the debounce timeout should be.
   */
  debounceDelay: _propTypes2.default.number,
  /*
    @snapMode
    Replaces breakpoints.current with screenWidth, disabling re-render only
    when breakpoint changes, instead potentially re-rendering when 
    calculateCurrentBreakpoint returns a new value. 
   */
  snapMode: _propTypes2.default.bool,
}
exports.default = ReactBreakpoints
