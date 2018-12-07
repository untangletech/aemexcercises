/*!
 * common.utils.js

 * This file contians some most common utility functions
 *
 * @project   SapientNitro Roche Diagonostics
 * @date      2017-07-17
 * @author    Shashank
 * @dependencies jQuery
 */

//this will cause the browser to check for errors more aggressively

/* eslint-disable new-cap */

/**
 * @namespace Main
 * @memberof snro
 * @property {null} property - description of property
 */
var moment = require('moment');
(function (window, multichannel) {

  multichannel = window.multichannel = multichannel || {};

  let setConfigurationsForAPI = (data) => {
    sessionStorage.setItem('configObj', JSON.stringify(data.data));
    let localObj = data.data.locale;
    let isLocaleMatch = false;
    let countryLocale = multichannel.commonUtils.getCookie('userCountry').split('/')[1];
    if (window.Granite && localObj) {
      Object.keys(localObj).forEach(function (key) {
        if (key === countryLocale) {
          isLocaleMatch = true;
          window.Granite.I18n.setLocale(localObj[key]);
        }
      });
      if (!isLocaleMatch) {
        window.Granite.I18n.setLocale('en');
      }

    }
    multichannel.router.navigate('caseListing');
  };

  let _getConfigurations = () => {
    let options = {
      url: multichannel.apiUrls.configurations + multichannel.commonUtils.getCookie('userCountry').split('/')[0] + '.json',
      type: 'GET'
    };
    multichannel.ajaxWrapper.getXhrObj(options).done(function (data) {
      multichannel.commonUtils.log(data);
      if (data.responseCode === 200) {
        setConfigurationsForAPI(data);

      }

    }).fail(function (err) {
      multichannel.commonUtils.log(err);
    });
  };

  let _callLoginAPI = () => {
    let options = {
      url: multichannel.apiUrls.loginDetails,
      type: 'GET'
    };
    multichannel.ajaxWrapper.getXhrObj(options).done(function (data) {
      multichannel.commonUtils.log(data);
      if (data.responseCode === 200 && data.data) {
        let pageLanguage = multichannel.commonUtils.getUserCountry();
        let index = pageLanguage.lastIndexOf('/');
        localStorage.setItem('LoginAccountObj', JSON.stringify(data.data));
        $('html').attr('lang', pageLanguage.substr(index));
        _getConfigurations();
      }
    }).fail(function (err) {
      multichannel.commonUtils.log(err);
    });
  };


  multichannel.commonUtils = {

    moduleName: 'commonUtils', // Added for debug logs

    // set local cookie
    setCookie: function (key, value, exp, path, domain) {
      if (!(typeof key === 'string' && key.length)) {
        return; // Key is mandatory
      }
      if (typeof value !== 'string') {
        value = '';
      } //If value is invalid by default empty string will be set
      let dt = new Date();
      if (typeof exp === 'number') {
        if (exp === Infinity) {
          dt = new Date('Thu, 31 Dec 2037 00:00:00 GMT');
        } else {
          dt.setTime(dt.getTime() + (exp * 24 * 60 * 60 * 1000));
        }
      }
      let expires = exp ? '; expires=' + dt.toUTCString() : '',
        cookiePath = '; path=' + ((typeof path === 'string') ? path.trim() : '/'),
        defaultDomain = window.location.hostname,
        cookieDomain = '';
      if (defaultDomain === 'localhost') { // IE does not allow localhost domain
        if (typeof domain === 'string') {
          cookieDomain = '; domain=' + domain.trim();
        }
      } else {
        cookieDomain = '; domain=' + ((typeof domain === 'string') ? domain.trim() : defaultDomain);
      }

      let secureCookieFlag = '';
      if (location.protocol === 'https:') {
        secureCookieFlag = '; secure';
      }
      document.cookie = key + '=' + value + expires + cookieDomain + cookiePath + secureCookieFlag;
    },
    // get cookie
    getCookie: function (key) {
      if (!(typeof key === 'string' && key.length)) {
        return '';
      }
      let cookieString = decodeURIComponent(document.cookie),
        index = 0,
        allCookies = [],
        c = '';
      key += '=';
      if ((allCookies = cookieString.split(';')).length) {
        for (; index < allCookies.length; index++) {
          if (~(c = allCookies[index].trim()).indexOf(key)) {
            return c.substring(key.length, c.length).trim();
          }
        }
      }
      return '';
    },
    // remove cookie
    removeCookie: function (key, path, domain) {
      if (!(typeof key === 'string' && key.length)) {
        return false;
      }
      let cookiePath = (typeof path === 'string') ? path : '/',
        defaultDomain = window.location.hostname,
        cookieDomain = '',
        deletedCookieString = '';
      if (defaultDomain === 'localhost') { // IE does not allow localhost domain
        if (typeof domain === 'string') {
          cookieDomain = '; domain=' + domain.trim();
        }
      } else {
        cookieDomain = '; domain=' + ((typeof domain === 'string') ? domain.trim() : defaultDomain);
      }
      deletedCookieString = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC' + cookieDomain + '; path=' + cookiePath;
      document.cookie = deletedCookieString;
      return !(this.getCookie(key).length); // Ensure if cookie has been deleted
    },
    // reset cookie
    resetCookie: function (key, value, exp, path, domain) {
      this.removeCookie(key, path, domain);
      this.setCookie(key, value, exp, path, domain);
    },

    // set in storage (session / local / cookie) based on fallback
    storage: {
      available: (typeof window.Storage === 'function'), // True only if webstorage is available
      // Method to store key values in any available storages
      set: function (key, value, isSession) {
        if (!(typeof key === 'string' && key.length)) {
          return;
        }
        isSession = (typeof isSession === 'boolean' ? isSession : false); // By default localStorage will be used
        let vl = (typeof value === 'object' && value !== null) ? JSON.stringify(value) : value;
        // Check if storage is defined
        if (this.available) {
          try {
            if (isSession) {
              window.sessionStorage.setItem(key, vl);
            } else {
              window.localStorage.setItem(key, vl);
            }
            return;
          } catch (e) {
            // catch error here
          }
        }
        // If control has reached here, it means storage operation was unsuccessful and we need to set a cookie instead
        if (isSession) {
          // Set a session cookie
          multichannel.commonUtils.setCookie(key, vl);
        } else {
          multichannel.commonUtils.setCookie(key, vl, Infinity);
        }
        return;
      },
      // Method to remove key from all available storages
      remove: function (key) {
        if (!(typeof key === 'string' && key.length)) {
          return false;
        }
        if (this.available) {
          try {
            window.localStorage.removeItem(key);
            window.sessionStorage.removeItem(key);
            return (!window.localStorage.key(key) || !window.sessionStorage.key(key) || multichannel.commonUtils.removeCookie(key));
          } catch (e) {
            //catch error here
          }
        }
        return multichannel.commonUtils.removeCookie(key);
      },
      // Get stored values from all available storages
      getAll: function (key, isSession) {
        let returnValue = [],
          cookieValue = null;
        isSession = (typeof isSession === 'boolean') ? isSession : false;
        if (this.available) {
          try {
            if (Object.prototype.hasOwnProperty.call(window.sessionStorage, key) && !isSession) {
              returnValue.push({ value: window.sessionStorage.getItem(key), storage: 'sessionStorage' });
            }
            if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
              returnValue.push({ value: window.localStorage.getItem(key), storage: 'localStorage' });
            }
          } catch (e) {
            // catch error here
          }
        }
        if ((cookieValue === multichannel.commonUtils.getCookie(key)).length) {
          returnValue.push({ value: cookieValue, storage: 'cookie' });
        }
        return returnValue.map(function (data) {
          try {
            data.value = JSON.parse(data.value);
            return data;
          } catch (e) {
            return data;
          }
        });
      },
      // Get stored value from first match
      get: function (key, isSession) {
        let storedValue = null;
        isSession = (typeof isSession === 'boolean') ? isSession : false;
        if (!isSession) {
          // Check session storage first. Session storage should always have priority over local storage
          storedValue = this.getFromSessionStorage(key);
          if (!storedValue) {
            storedValue = this.getFromLocalStorage(key);
          }
        } else {
          // If isSession is true, then session storage is forced. In means we cannot get value from local storage
          storedValue = this.getFromSessionStorage(key);
        }
        // If neither of the storages have value. It means value could be in cookies
        if (!storedValue && !(storedValue = this.getFromCookies(key))) {
          return; // Return undefined
        }
        // Return the value part if value object has been successfully received
        return storedValue.value;
      },
      // update the value in storage
      update: function (key, callbackOrValue, isSession) {
        let value = this.get(key);
        if (typeof callbackOrValue === 'function') {
          this.set(key, callbackOrValue(value, key), isSession);
        } else {
          this.set(key, callbackOrValue, isSession);
        }
      },
      // Get stored value from local storage only
      getFromLocalStorage: function (key) {
        return this.getAll(key, true).filter(function (valueOb) {
          return valueOb.storage === 'localStorage';
        })[0];
      },
      // Get stored value from session storage only
      getFromSessionStorage: function (key) {
        return this.getAll(key).filter(function (valueOb) {
          return valueOb.storage === 'sessionStorage';
        })[0];
      },
      // Get stored value from cookies only
      getFromCookies: function (key) {
        return this.getAll(key).filter(function (valueOb) {
          return valueOb.storage === 'cookie';
        })[0];
      }
    },

    // log to console if debug mode
    log: function () {
      try {
        // Enable logs if development environment is true or debugClientLibs param is provided
        if (multichannel.commonUtils.queryParams('debugClientLibs')) {
          console.log(arguments[0]);
        }
      } catch (e) {
        // catch error here
      }
    },

    getAccountData: function () {
      let accountData = {};
      try {
        accountData = JSON.parse(localStorage.getItem('LoginAccountObj'));
      } catch (error) {
        return false;
      }
      return accountData;
    },
    // get value of any url query parameter
    queryParams: function () {
      /*if (!url) {
        url = location.href;
      }
      name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
      let regexS = '[\\?&]' + name + '=([^&#]*)',
        regex = new RegExp(regexS),
        results = regex.exec(url);
      return results === null ? null : results[1];*/
    },

    validateEmail(email) {
      /*eslint-disable */
      let regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regExEmail.test(email);
    },
    validatePhoneNumber(num) {
      let regExPhn = /^(?!\+0+$|0+$)(?:00|\+)\d{7,30}$/;
      return regExPhn.test(num);
    },
    //get value of radio button selected in radio group
    getRadioVal(form, name) {
      let val;
      // get list of radio buttons with specified name
      let radios = form.elements[name];
      for (let i = 0, len = radios.length; i < len; i++) {
        if (radios[i].checked) { // radio checked?
          val = radios[i].value; // if so, hold its value in val
          break;
        }
      }
      return val; // return value of checked radio or undefined if none checked
    },

    loader: {
      show: function (elem) {
        let loader = `<div class="x-loader__container js-loader"><div class='x-loader'></div></div>`, $body = $('body');
        if (elem && elem.length) {
          elem.append(loader);
        } else {
          $body.append(loader);
        }
        $body.addClass('loader-open');
      },
      remove: function (elem) {
        $('body').removeClass('loader-open');
        elem.find('.js-loader').remove();
      }
    },
    // addAnimation(container) {
    //   if ($(container).hasClass('js-view-back')) {
    //     $(container).addClass('animate-dissolve');
    //     $(container).removeClass('js-view-back');
    //   } else {
    //     $(container).addClass('animate-dissolve');
    //   }
    // },
    backButtonHandler(targetElement, container, back) {
      if (back) {
        $(container).addClass('js-view-back');
      }
      else {
        // $(container).removeClass('slideInRight');
      }
      let navigateTo = $(targetElement.currentTarget).data('navigateTo');
      //navigateTo = + navigateTo;
      $('.animate-appear').addClass('animate-dissolve');
      let intervalTimer = setTimeout(function () {
        multichannel.router.navigate(navigateTo);
        clearTimeout(intervalTimer);
      }, 200);
    },

    beep() {
      // const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
      // snd.play();
    },
    deleteCookie(cookieName) {
      document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    errorhandler(err) {
      if (err.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        multichannel.commonUtils.deleteCookie('userToken');
        window.location.reload();
      }
      return err;
    },

    /**
     * It searches the matching string in the array and render the list
     * @param {String} inputVal - string to be searched
     * @param {Object[]} sortedData - array of object in which string is to be searched
     */
    searchData: (inputVal, sortedData) => {
      let searchInString = '',
        filteredArray = [],
        found = false,
        tempObj = {},
        stringFound = '',
        expr = new RegExp(inputVal, 'i'),
        expr1 = new RegExp(inputVal, 'gi');
      if (sortedData.length) {
        sortedData.forEach(obj => {
          Object.keys(obj).forEach(prop => {
            searchInString = `${obj[prop]}`;
            if (expr.test(searchInString) && prop !== 'deviceId' && prop !== 'caseId' && prop !== 'crmAccountNo') {
              found = true;
              stringFound = obj[prop].match(expr);
              tempObj[prop] = obj[prop].replace(expr1, '<span class="x-highlight">' + stringFound + '</span>');
            } else {
              tempObj[prop] = obj[prop];
            }
          });
          if (found) {
            filteredArray.push(tempObj);
            found = false;
          }
          tempObj = {};
        });
      }
      return filteredArray;
    },

    /**
     * It formats the date into the configured date format
     * @param {String} inputDate - date to be formatted
     * */
    formatDate: (inputDate) => {
      let configObj = JSON.parse(sessionStorage.getItem('configObj')) || {},
        dateFormat = configObj.dateFormat ? configObj.dateFormat : 'MM-DD-YYYY';
      return moment(inputDate).format(dateFormat);
    },

    /**
     * It matches the case status from API to the corresponding i18n key
     * @param {String} caseStatus - status of the case as from api
     * */
    getCaseStatus: (caseStatus) => {
      if (caseStatus) {
        let statusi18 = caseStatus,
          status = caseStatus.toLowerCase();
        if (window.Granite && window.Granite.I18n) {
          switch (status) {
            case 'open':
              statusi18 = window.Granite.I18n.get('cmms_caselisting.openStatus');
              break;
            case 'dispatched':
              statusi18 = window.Granite.I18n.get('cmms_casestatus.dispatched');
              break;
            case 'closed':
              statusi18 = window.Granite.I18n.get('cmms_casestatus.closed');
              break;
            case 'inprogress':
              statusi18 = window.Granite.I18n.get('cmms_casestatus.inProgress');
              break;
            default:
              break;
          }
          return statusi18;
        }
      }
      return caseStatus;
    },
    /**
     * It reads and returns the user country code from the cookie
     * */
    getUserCountry: () => {
      let countryRegex = new RegExp('[; ]userCountry=([^\\s;]*)');
      let countryMatch = (' ' + document.cookie).match(countryRegex);
      let countrySelectedRegex = new RegExp('[; ]countrySelected=([^\\s;]*)');
      let countrySelectedMatch = (' ' + document.cookie).match(countrySelectedRegex);
      if (countryMatch) {
        return unescape(countryMatch[1]);
      }
      else if (countrySelectedMatch) {
        return unescape(countrySelectedMatch[1]);
      }
    },

    // init method
    init: function () { // Added since init is mandatory for all modules
      let countrySelectorPage = document.getElementById('countrySelector');
      let errorPage = document.getElementById('errorPage');
      if (countrySelectorPage) {
        localStorage.clear();
        sessionStorage.clear();
        multichannel.countrySelector.init();
      }
      else if (errorPage) {
        multichannel.errorPage.init();
      }
      else {
        if ($.isEmptyObject(localStorage.LoginAccountObj) || $.isEmptyObject(sessionStorage.configObj)) {
          _callLoginAPI();
        }
        else {

          try {
            let localObj = JSON.parse(sessionStorage.getItem('configObj')).locale;
            let countryLocale = multichannel.commonUtils.getCookie('userCountry').split('/')[1];
            if (window.Granite && localObj) {
              Object.keys(localObj).forEach(function (key) {
                if (key === countryLocale) {
                  window.Granite.I18n.setLocale(localObj[key]);
                }
              });

            }
          }
          catch (e) {
            multichannel.commonUtils.log(e);
          }
          multichannel.router.navigate('caseListing');
        }
      }
      // Adding commonUtils in global space
      if (!window.commonUtils) { // Unless there is another commonUtils js library available globally, add commonUtils to global namespace
        window.commonUtils = this;
      }
    }
  };

}(window, window.multichannel));