var Handlebars = require('handlebars/runtime'),
  moment = require('moment');
(function (window, multichannel) {
  multichannel = window.multichannel = multichannel || {};

  let _registerHandlebarHelpers = () => {
    Handlebars.registerHelper('assign', function (element, val1, defaultVal) {
      var context = {};
      context[element] = val1 || defaultVal;
    });

    Handlebars.registerHelper('breaklines', function (text) {
      text = Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new Handlebars.SafeString(text);
    });

    Handlebars.registerHelper('shortDate', function (unFormattedDate, separator) {
      let configObj = JSON.parse(sessionStorage.getItem('configObj')) || {},
        dateFormat = configObj.dateFormat ? configObj.dateFormat : 'MM-DD-YYYY',
        timeFormat = configObj.timeFormat ? configObj.timeFormat : 'hh:mm';
      let date = moment(unFormattedDate).format(dateFormat);
      let time = moment(unFormattedDate).format(timeFormat);
      if (typeof separator === 'string') {
        return new Handlebars.SafeString(date + separator + time);
      } else {
        return new Handlebars.SafeString(date + '<br>' + time);
      }
    });

    Handlebars.registerHelper('i18keyText', function (key) {
      if (key) {
        if (window.Granite && window.Granite.I18n) {
          return window.Granite.I18n.get(key);
        }
      }
      return key;
    });

    Handlebars.registerHelper('caseStatusi18', function (key) {
      return multichannel.commonUtils.getCaseStatus(key);
    });

    Handlebars.registerHelper('formatDate', function (unFormattedDate) {
      let configObj = JSON.parse(sessionStorage.getItem('configObj')) || {},
        dateFormat = configObj.dateFormat ? configObj.dateFormat : 'MM-DD-YYYY';
      return moment(unFormattedDate).format(dateFormat);
    });

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      if (options.hash.ignoreCase && typeof v1 === 'string' && typeof v2 === 'string') {
        v1 = v1.toLowerCase();
        v2 = v2.toLowerCase();
      }
      /*eslint-disable */
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          if (typeof (v1) === 'string' && typeof (v2) === 'string') {
            v1 = v1.toLowerCase();
            v2 = v2.toLowerCase();
          }
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case 'contains':
          return (v1.indexOf(v2) !== -1) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
      /*eslint-enable */
    });
  };
  multichannel.helpers = {
    moduleName: 'helpers',

    init: function () {
      return _registerHandlebarHelpers.apply(this, arguments);
    }
  };
  multichannel.helpers.init();
}(window, window.multichannel));