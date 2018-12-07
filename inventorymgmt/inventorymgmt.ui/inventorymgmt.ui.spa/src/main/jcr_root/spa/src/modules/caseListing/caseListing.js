
/*!
 * case Listing.js

 * This file contians some most case requests functions
 *
 * @project   SapientNitro Roche Multichannel
 * @date      2018-08-02
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

import { MDCDialog } from '@material/dialog';
import { MDCMenu } from '@material/menu';
var moment = require('moment');
(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};

  let _cache = {},
    messageDialogTemplate = require('../../common/handlebars/messageDialog.hbs'),
    dialog,
    serviceCases = multichannel.appData.cases,
    _initCache = () => {
      _cache.viewConatiner = $('.js-view-container');
      _cache.accountData = null;
      _cache.configObj = JSON.parse(sessionStorage.getItem('configObj'));
      _cache.showFeedback = false;
      multichannel.appData.selectedCaseId = '';
      if (_cache.configObj) {
        if (_cache.configObj.enableFeedback && _cache.configObj.enableFeedback === 'true') {
          _cache.showFeedback = true;
        }
        _cache.openedDateFrom = _cache.configObj.creationDateLimit ? _cache.configObj.creationDateLimit : 30;
        _cache.pageLimit = _cache.configObj.casePageLimit ? _cache.configObj.casePageLimit : 9999;
      }
    },

    _updateCache = () => {
      _cache.createCaseBtn = $('.js-create-case');
      _cache.loaderContainer = $('.js-loader-container');
      _cache.casesContainer = $('.js-cases-container');
      _cache.errorContainer = $('.js-cases-error');
      _cache.casesSelect = $('.js-cases-select');
      _cache.menuEl = document.querySelector('.mdc-menu');
      _cache.menu = new MDCMenu(_cache.menuEl);
      _cache.menuButtonEl = document.querySelector('#menu-button');
      _cache.menuBtnText = document.querySelector('.js-menu-btn-text');
      _cache.menuBtnTextVal = document.querySelector('.js-menu-btn-text').innerText;
      _cache.currentDate = new Date();
      _cache.closedDateFrom = moment(_cache.currentDate.getTime() - (7 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD');
      _cache.currentDateFormatted = moment(_cache.currentDate).format('YYYY-MM-DD');
      _cache.openedDateFrom = moment(_cache.currentDate.getTime() - (_cache.openedDateFrom * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD');
      let intervalTimerListing = setTimeout(function () {
        $('#menu-button').find('.js-drop-down-icon').removeClass('x-hide');
        clearTimeout(intervalTimerListing);
      }, 500);
    },

    _renderView = () => {
      let caseListingTemplate = require('./caseListing.hbs'),
        caseListingHtml = caseListingTemplate();
      _cache.viewConatiner.html(caseListingHtml);
      $('.js-cases-search-btn').off('click').on('click', () => {
        multichannel.router.navigate('/caseRequestSearch');
      });
    },
    _showError = (errMsg) => {
      _cache.casesContainer.html(`<p class='x-error js-cases-error animated slideInUp'>${errMsg}</p>`);
    },
    _renderCasesList = (filteredCases) => {
      window.scrollTo(0, 0);
      multichannel.appData.cases.filteredCases = filteredCases;
      if (filteredCases.length) {
        let casesTemplate = require('./casesList.hbs'),
          casesHtml = casesTemplate({ 'serviceCases': filteredCases, 'selectedCaseType': _cache.showFeedback ? multichannel.appData.filterSelected : '' });
        _cache.casesContainer.html(casesHtml);
        multichannel.caseListing.bindCaseDetail();
        multichannel.caseListing.bindFeedbackBtn();
      } else {
        let errMessage = window.Granite ? window.Granite.I18n.get('cmms_caselisting.emptyResultsMsg') : 'No results available';
        _showError(errMessage);
      }
    },
    _casesDropdownHandler = (evt) => {
      _cache.menuButtonEl.classList.remove('open');
      let detail, selectedCaseType;
      if (evt) {
        detail = evt.detail;
        _cache.menuBtnText.innerText = detail.item.innerText;
        selectedCaseType = detail.item.attributes.value.value;
      }
      else {
        _cache.menuBtnText.innerText = multichannel.appData.innerTextSelected || _cache.menuBtnTextVal;
        selectedCaseType = multichannel.appData.filterSelected || 'openCases';
      }
      multichannel.appData.innerTextSelected = _cache.menuBtnText.innerText;
      multichannel.appData.filterSelected = selectedCaseType;

      /* eslint-disable */
      switch (selectedCaseType) {
        case 'openCases':
          serviceCases.myOpen.length ? _renderCasesList(serviceCases.myOpen) : multichannel.caseListing.loadMyCases();
          break;
        case 'closedCases':
          serviceCases.myClosed.length ? _renderCasesList(serviceCases.myClosed) : multichannel.caseListing.loadMyClosedCases();
          break;
        case 'allOpenCases':
          serviceCases.allOpen.length ? _renderCasesList(serviceCases.allOpen) : multichannel.caseListing.loadCases();
          break;
        case 'allClosedCases':
          serviceCases.allClosed.length ? _renderCasesList(serviceCases.allClosed) : multichannel.caseListing.loadAllClosedCases();
          break;
        default:
          serviceCases.allCases.length ? _renderCasesList(serviceCases.allCases) : multichannel.caseListing.loadCases();
          break;
      }
      /* eslint-enable */
    },
    _apiCallFail = (err) => {
      let errData = multichannel.commonUtils.errorhandler(err),
        errMsg = (errData && errData.msg) ? errData.msg : 'Something went wrong.';
      _showError(errMsg);
    },
    _bindEvents = () => {

      _cache.viewConatiner.on('click', '.js-create-case-btn', () => {
        multichannel.appData.pageControlFrSearch = false;
        multichannel.appData.innerTextSelected = _cache.menuBtnTextVal;
        multichannel.appData.filterSelected = 'openCases';
        if (_cache.configObj.enableQrcode && _cache.configObj.enableQrcode === 'true') {
          multichannel.router.navigate('/qRCodeInstrument');
        } else {
          multichannel.router.navigate('/identifyInstruments');
        }
      });

      _cache.menuButtonEl.addEventListener('click', function () {
        _cache.menu.open = !_cache.menu.open;
      });
      // Listen for selected item
      _cache.menuEl.addEventListener('MDCMenu:selected', _casesDropdownHandler);
      $(document).click(function (e) {
        if ($(e.target).closest('.x-dropdown').length > 0) {
          _cache.menuButtonEl.classList.toggle('open');
        } else {
          _cache.menuButtonEl.classList.remove('open');
        }
      });
    };

  multichannel.caseListing = {
    bindCaseDetail() {
      $('.js-case').on('click', (e) => {
        let data = $(e.currentTarget).data('caseId');
        multichannel.caseDetail.showCaseDetail(data);
      });
    },
    bindFeedbackBtn() {
      $('.js-case-feedback').on('click', (e) => {
        multichannel.appData.selectedCaseId = $(e.currentTarget).data('caseId');
        multichannel.router.navigate('/supportFeedback');
      });
    },
    loadMyCases() {
      multichannel.ajaxWrapper.getXhrObj({
        url: multichannel.apiUrls.myCases,
        type: 'GET',
        data: {
          pageOffset: 0,
          pageLimit: _cache.pageLimit,
          createdDateFrom: _cache.openedDateFrom,
          createdDateTo: _cache.currentDateFormatted,
          sort: '-createdDate'
        },
        loader: _cache.loaderContainer
      }).done(function (data) {
        serviceCases.myOpen = serviceCases.getOpenCases(data);
        _renderCasesList(serviceCases.myOpen);
      }).fail(function (err) {
        _apiCallFail(err);
      });
    },
    loadCases(cb) {
      // let url = 'https://api.myjson.com/bins/yzqn4',
      // let url = 'https://api.myjson.com/bins/113pzc',
      // let url = 'https://api.myjson.com/bins/8r5bg';
      let url = multichannel.apiUrls.serviceCase;
      multichannel.ajaxWrapper.getXhrObj({
        url: url,
        type: 'GET',
        data: {
          pageOffset: 0,
          pageLimit: _cache.pageLimit,
          createdDateFrom: _cache.openedDateFrom,
          createdDateTo: _cache.currentDateFormatted,
          sort: '-createdDate'
        },
        loader: _cache.loaderContainer
      }).done(function (data) {
        serviceCases.allCases = data;
        serviceCases.allOpen = serviceCases.getOpenCases(serviceCases.allCases);
        if (cb && typeof (cb) === 'function') {
          cb();
        } else {
          _renderCasesList(serviceCases.allOpen);
        }
      }).fail(function (err) {
        _apiCallFail(err);
      });
    },
    loadMyClosedCases(cb) {
      multichannel.ajaxWrapper.getXhrObj({
        url: multichannel.apiUrls.myCases,
        type: 'GET',
        data: {
          pageOffset: 0,
          pageLimit: _cache.pageLimit,
          status: 'closed',
          closedDateFrom: _cache.closedDateFrom,
          closedDateTo: _cache.currentDateFormatted,
          sort: '-closedDate'
        },
        loader: _cache.loaderContainer
      }).done(function (data) {
        serviceCases.myClosed = data;
        if (cb && typeof (cb) === 'function') {
          cb();
        } else {
          _renderCasesList(serviceCases.myClosed);
        }
      }).fail(function (err) {
        _apiCallFail(err);
      });
    },
    loadAllClosedCases() {
      multichannel.ajaxWrapper.getXhrObj({
        url: multichannel.apiUrls.serviceCase,
        type: 'GET',
        data: {
          pageOffset: 0,
          pageLimit: _cache.pageLimit,
          status: 'closed',
          closedDateFrom: _cache.closedDateFrom,
          closedDateTo: _cache.currentDateFormatted,
          sort: '-closedDate'
        },
        loader: _cache.loaderContainer
      }).done(function (data) {
        serviceCases.allClosed = data;
        _renderCasesList(serviceCases.allClosed);
      }).fail(function (err) {
        _apiCallFail(err);
      });
    },
    clearCasesCache() {
      serviceCases.myOpen = [];
      serviceCases.myClosed = [];
      serviceCases.allOpen = [];
      serviceCases.allClosed = [];
      serviceCases.allCases = [];
    },
    init() {
      _initCache();
      _renderView();
      _updateCache();
      _cache.accountData = multichannel.commonUtils.getAccountData();
      console.log('Account-Info' + _cache.accountData);
      if (_cache.accountData) {
        multichannel.appData.pageControlFrSearch ? _casesDropdownHandler() : multichannel.caseListing.loadMyCases();
        _bindEvents();
      }
      if (multichannel.appData.casesResponseMessage && multichannel.appData.casesResponseMessage.trim() !== '') {
        let html = messageDialogTemplate({ message: multichannel.appData.casesResponseMessage, caseIdMessage: multichannel.appData.caseResponseObject.caseIdMessage, caseID: multichannel.appData.caseResponseObject.caseId, createCaseFailed: multichannel.appData.createCaseFailed });
        $('.js-case-detail-container').html(html);
        dialog = new MDCDialog(document.querySelector('#js-messageDialog'));
        dialog.show();
        multichannel.appData.casesResponseMessage = '';
        multichannel.appData.caseResponseObject = {};
      }
    }
  };
}(window, window.multichannel));