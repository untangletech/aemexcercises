
/*!
 * case Request search.js

 * This file contians some most case requests search functions
 *
 * @project   SapientNitro Roche Multichannel
 * @date      2018-07-30
 * @author    Bindhyachal
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

  let casesSearchTemplate = require('./caseRequestSearch.hbs');
  let casesListTemp = require('./caseSearchList.hbs');
  let _cache = {};

  /**
   * It is called to shorten the data array fetched from API so as to reduce search time
   * @param {Object[]} apiData
   */
  let _sortData = (apiData) => {
    _cache.sortedData = [];
    _cache.configObj = JSON.parse(sessionStorage.getItem('configObj'));
    let feedbackBtn = '';
    if (_cache.configObj.enableFeedback && _cache.configObj.enableFeedback === 'true' && multichannel.appData.filterSelected === 'closedCases') {
      feedbackBtn = window.Granite ? window.Granite.I18n.get('cmms_caselisting.feedbackBtn') : 'Support Feedback';
    }
    apiData.forEach(cases => {
      _cache.sortedData.push({
        caseCreatedDate: multichannel.commonUtils.formatDate(cases.serviceCases.createdDate),
        deviceSerialNo: cases.serviceCases.devices.serialNo,
        deviceMaterialsName: cases.serviceCases.devices.materials.name,
        accountName: cases.serviceCases.accounts.name,
        caseId: cases.serviceCases.id,
        caseStatus: (cases.serviceCases.status.toLowerCase() === 'open' && (cases.serviceCases.recordType.toLowerCase() === 'complaint' || cases.serviceCases.recordType.toLowerCase() === 'inquiry')) ? multichannel.commonUtils.getCaseStatus('inProgress') : multichannel.commonUtils.getCaseStatus(cases.serviceCases.status),
        caseSubject: cases.serviceCases.subject,
        caseIdDisplayed: cases.serviceCases.id,
        feedbackBtn: (cases.serviceCases.survey && cases.serviceCases.survey !== 'null' && typeof (cases.serviceCases.survey.rating) === 'number') ? '' : feedbackBtn
      });
    });
    return _cache.sortedData;
  };
  /**
   * It displays error if search results empty.
   */
  let _showError = () => {
    let errMessage = window.Granite ? window.Granite.I18n.get('cmms_caselisting.emptyResultsMsg') : 'No results available';
    _cache.listingView.html(`<p class='x-error js-cases-error animated slideInUp'>${errMessage}</p>`);
  };
  /**
   * It's purpose is to render the cases list, be it filtered or raw.
   * @param {Object[]} data
   */
  let _renderList = (data) => {
    window.scrollTo(0, 0);
    if (data && data.length) {
      _cache.listingView.html(casesListTemp({ 'serviceCases': data }));
    } else {
      _showError();
    }
    multichannel.caseListing.bindCaseDetail();
    multichannel.caseListing.bindFeedbackBtn();
  };
  /**
   * It is called on entering data in search field.
   */
  let _onSearchInput = () => {
    _cache.searchCaseInputVal = _cache.searchCaseInput.val().trim();
    if (_cache.searchCaseInputVal.length > 2) {
      if (multichannel.appData.cases.filteredCases) {
        _renderList(multichannel.commonUtils.searchData(_cache.searchCaseInputVal, _cache.sortedData));
      } else {
        _showError();
      }
    } else {
      _cache.listingView.html('');
    }
  };
  let _bindEvents = () => {
    _cache.searchCaseInput.off('keyup paste').on('keyup paste', _onSearchInput);
    _cache.backbtn.on('click', (e) => {
      multichannel.appData.pageControlFrSearch = true;
      multichannel.commonUtils.backButtonHandler(e, $('.js-view-container'), 'back');
    });
    _cache.searchCaseInput.trigger('focus');
    window.scrollTo(0, 0);
  };
  let _initCache = () => {
    _cache.searchCaseInput = $('#searchCasesInput');
    _cache.listingView = $('.js-cases-search-listing');
    _cache.backbtn = $('.js-back');
    if (multichannel.appData.cases.filteredCases) {
      _sortData(multichannel.appData.cases.filteredCases);
    }
  };
  multichannel.caseRequestSearch = {
    init() {
      _cache.viewContainer = $('.js-view-container');
      _cache.viewContainer.html(casesSearchTemplate());
      _initCache();
      _bindEvents();
    }
  };
}(window, window.multichannel));