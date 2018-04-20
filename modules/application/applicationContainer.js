'use strict';

const findApp = require('../core/findApp');

const _require = require('../mindash');

const isArray = _require.isArray;
const extend = _require.extend;

module.exports = function (React) {
  class ApplicationContainer extends React.Component {
    static displayName = 'ApplicationContainer';

    static childContextTypes = {
      app: React.PropTypes.object
    };

    getChildContext() {
      return { app: findApp(this) };
    }

    render() {
      const _props = this.props;
      const app = _props.app;
      const children = _props.children;

      if (children) {
        if (isArray(children)) {
          return React.createElement(
            'span',
            null,
            React.Children.map(children, cloneWithApp)
          );
        }
        return cloneWithApp(children);
      }

      function cloneWithApp(element) {
        return React.createElement(
          element.type,
          extend(
            {
              app
            },
            element.props
          )
        );
      }
    }
  }

  return ApplicationContainer;
};
