/*!
 * instrument case Listing.js

 * This file contians some most case requests functions
 *
 * @project   SapientNitro Roche Multichannel
 * @date      2018-08-13
 * @author    Neha
 * @dependencies jQuery
 */

//this will cause the browser to check for errors more aggressively

/* eslint-disable new-cap */

/**
 * @namespace Main
 * @memberof multichannel
 * @property {null} property - description of property
 */

(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};

  let _cache = {},

    _initCache = () => {
      _cache.accountData = multichannel.commonUtils.getAccountData();
      _cache.viewConatiner = $('.js-view-container');
    },
    _updateCache = () => {
      _cache.loaderContainer = $('.js-loader-container');
      _cache.errorContainer = $('.js-cases-error');
      _cache.casesContainer = $('.js-cases-container');
      _cache.backbtn = $('.js-back');
    },

    _renderInstrumentCases = (data) => {
      let casesTemplate = require('../caseListing/casesList.hbs'),
        casesHtml = casesTemplate({ 'serviceCases': data });
      _cache.casesContainer.html(casesHtml);
    },
    _showError = (errMsg) => {
      _cache.casesContainer.html(`<p class='x-error js-cases-error'>${errMsg}</p>`);
    },
    _loadInstrumentCases = (deviceId) => {
      multichannel.appData.cases.filteredCases = multichannel.appData.cases.getCasesByDevice(deviceId);
      if (!multichannel.appData.cases.filteredCases.length) {
        let errMessage = window.Granite ? window.Granite.I18n.get('cmms_caselisting.emptyResultsMsg') : 'No results available';
        _showError(errMessage);
        return;
      }
      _renderInstrumentCases(multichannel.appData.cases.filteredCases);
    },
    _renderView = () => {
      window.scrollTo(0, 0);
      let instrumentCasesTemplate = require('./instrumentCases.hbs'),
        instrumentCasesHtml = instrumentCasesTemplate();
      _cache.viewConatiner.html(instrumentCasesHtml);
    },

    _bindEvents = () => {
      _cache.backbtn.on('click', (e) => {
        multichannel.commonUtils.backButtonHandler(e, $('.js-view-container'), 'back');
      });
      multichannel.caseListing.bindCaseDetail();
    };

  multichannel.instrumentCases = {
    init(deviceId, naviatedFrom) {
      if (deviceId) {
        _initCache();
        _renderView();
        _updateCache();
        _cache.backbtn.attr('data-navigate-to', naviatedFrom);
        _loadInstrumentCases(deviceId);
        _bindEvents();
      }
    }
  };
}(window, window.multichannel));