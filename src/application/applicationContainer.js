const findApp = require('../core/findApp');
const { isArray, extend } = require('../mindash');

module.exports = function (React) {
  class ApplicationContainer extends React.Component {
    static childContextTypes = {
      app: React.PropTypes.object
    };
    getChildContext() {
      return { app: findApp(this) };
    }
    render() {
      const { app, children } = this.props;

      if (children) {
        if (isArray(children)) {
          return <span>{React.Children.map(children, cloneWithApp)}</span>;
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
