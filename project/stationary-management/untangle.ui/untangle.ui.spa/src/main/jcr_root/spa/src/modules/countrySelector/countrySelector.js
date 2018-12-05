
/*!
 * case Request search.js

 * This file contains logic for redirecting to country specific page
 *
 * @project   SapientNitro Roche Multichannel
 * @date      2018-08-16
 * @author    Manil
 * @dependencies jQuery
 */

//this will cause the browser to check for errors more aggressively

/* eslint-disable new-cap */

import { MDCMenu } from '@material/menu';
/**
 * @namespace Main
 * @memberof multichannel
 * @property {null} property - description of property
 */
(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};

  // let countrySelectorTemplate = require('./countrySelector.hbs');
  let _cache = {};

  let _selectBtnHandler = (e) => {
    e.preventDefault();
    window.location.href = _cache.countrySelectBtn.dataset.loginpath;
  };

  let _countrySelectHandler = (evt) => {
    let detail = evt.detail;
    _cache.menuBtnText.innerText = detail.item.innerText;
    $(_cache.menuBtnText).addClass('x-color-dark');
    _cache.countrySelectBtn.disabled = false;
    document.cookie = 'countrySelected=' + detail.item.dataset.country + ';';
  };

  let _bindEvents = () => {
    _cache.menuButtonEl.addEventListener('click', function () {
      _cache.menu.open = !_cache.menu.open;
    });
    _cache.menuEl.addEventListener('MDCMenu:selected', _countrySelectHandler);
    _cache.countrySelectBtn.addEventListener('click', _selectBtnHandler);
    if (_cache.userCountry && _cache.userCountry.length) {
      $(_cache.menuEl).find('.mdc-list-item[data-country="' + _cache.userCountry + '"]').trigger('click');
    }
    $(document).click(function (e) {
      if ($(e.target).closest('.x-dropdown').length > 0) {
        $(_cache.menuButtonEl).toggleClass('open');
      } else {
        _cache.menuButtonEl.classList.remove('open');
      }
    });
  };

  let _initCache = () => {
    _cache.menuEl = document.querySelector('.js-mdc-menu');
    _cache.menu = new MDCMenu(_cache.menuEl);
    _cache.menuButtonEl = document.querySelector('#menu-button');
    _cache.menuBtnText = document.querySelector('.js-menu-btn-text');
    _cache.countrySelectBtn = document.querySelector('.js-country-select');
    _cache.userCountry = multichannel.commonUtils.getUserCountry();
    let intervalTimerCountry = setTimeout(function () {
      $('#menu-button').find('.js-drop-down-icon').removeClass('x-hide');
      clearTimeout(intervalTimerCountry);
    }, 500);
    
  };

  multichannel.countrySelector = {
    init() {
      // _cache.viewContainer = document.querySelector('.js-view-container');
      // _cache.viewContainer.innerHTML = countrySelectorTemplate();
      _initCache();
      _bindEvents();
    }
  };
}(window, window.multichannel));