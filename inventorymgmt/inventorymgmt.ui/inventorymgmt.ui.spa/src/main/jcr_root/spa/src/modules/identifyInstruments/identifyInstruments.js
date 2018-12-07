
/*!
 * identify Instruments.js

 * This file contians some most case requests functions
 *
 * @project   SapientNitro Roche Multichannel
 * @date      2018-07-30
 * @author    Manil
 * @dependencies jQuery
 */

/* eslint-disable new-cap */

/**
 * @namespace Main
 * @memberof multichannel
 * @property {null} property - description of property
 */
(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};
  let _cache = {};
  let identifyInstrumentTemplate = require('./identifyInstruments.hbs');
  let instrumentListTemp = require('./instrumentListing.hbs');

  /**
   * It's purpose is to render the instrument list, be it filtered or raw.
   * @param {Object[]} data
   */
  let _renderList = (data) => {
    window.scrollTo(0, 0);
    if (data && data.length) {
      _cache.listingView.html(instrumentListTemp({ 'instruments': data }));
    } else {
      _cache.listingView.html(instrumentListTemp({ 'message': _cache.errMessage }));
    }
    $('.js-instrument').on('click', function (e) {
      let clickedInstrument = e.currentTarget,
        deviceId = clickedInstrument.id;
      if ($(e.target).hasClass('js-open-requests')) {
        return;
      }
      let selectedInstrument = _cache.sortedData.filter(function (obj) {
        return obj.deviceId === deviceId;
      });
      multichannel.appData.clickedInstrument = selectedInstrument[0];
      multichannel.appData.callServiceAllCases = false;
      multichannel.router.navigate('/specifyProblem');
    });
  };

  let _getAssinedRequest = (openRequests) => {

    let assignedRequest = {};
    if (openRequests.length) {
      openRequests.sort(function (obj1, obj2) {
        return new Date(obj2.serviceCases.createdDate).getTime() - new Date(obj1.serviceCases.createdDate).getTime();
      });
      assignedRequest = openRequests[0];
    }
    return assignedRequest;
  };

  /**
   * It is called to shorten the data array fetched from API so as to reduce search time
   * @param {Object[]} apiData
   */
  let _sortData = (apiData) => {
    _cache.sortedData = [];

    apiData.forEach(devices => {
      //IB-0000315507, devices.device.id
      let openRequests = multichannel.appData.cases.getCasesByDevice(devices.device.id),
        assignedRequest = _getAssinedRequest(openRequests),
        assignedCaseId = openRequests.length ? assignedRequest.serviceCases.id : null;
      _cache.sortedData.push({
        deviceSerialNo: devices.device.serialNo,
        deviceMaterialsName: devices.device.materials.name,
        accountName: devices.device.installedBase.account.name,
        crmAccountNo:devices.device.installedBase.account.crmAccountNo,
        deviceId: devices.device.id,
        assignedCaseId: assignedCaseId,
        assignedRequest: assignedRequest
      });
    });
    return _cache.sortedData;
  };

  /**
   * It is called on entering data in search field.
   */
  let _onSearchInput = () => {
    _cache.searchInputVal = _cache.searchInput.val().trim();
    if (_cache.searchInputVal.length > 2) {
      _cache.refreshList = true;
      _renderList(multichannel.commonUtils.searchData(_cache.searchInputVal, _cache.sortedData));
    }
    if (_cache.refreshList && _cache.searchInputVal.length <= 2) {
      _renderList(_cache.sortedData);
      _cache.refreshList = false;
    }
  };

  /**
   * It checks if serial number has been scanned properly or not and then populates the list accordingly.
   */
  let _checkQRScanned = () => {
    if (multichannel.appData.selectedInstrument.length) {
      if (multichannel.appData.selectedInstrument === 'error') {
        _renderList([]);
        _sortData(_cache.instruments);
      }
      else {
        _sortData(_cache.instruments);
        _cache.searchInputVal = multichannel.appData.selectedInstrument;
        _cache.searchInput.val(_cache.searchInputVal).trigger('paste');
      }
      multichannel.appData.selectedInstrument = '';
    } else {
      _renderList(_sortData(_cache.instruments));
    }
  };

  /**
   * It checks whether the device data is already present in appdata or not.
   */
  let _getListingData = () => {
    _cache.countryCode = 'CN';
    _cache.crmAccountNo = 'ACC-0002020753';
    // _cache.accountName = 'Luzerner hospital';
    _cache.errMessage = window.Granite ? window.Granite.I18n.get('cmms_identifyInstruments.noInstrument') : 'No instruments found';
    let response = localStorage.getItem('LoginAccountObj');
    if (!multichannel.localhostUrl) {
      try {
        _cache.crmAccountNo = JSON.parse(response).crmAccountNo;
        _cache.countryCode = JSON.parse(response).countryCode;
        // _cache.accountName = JSON.parse(response).accountName;
      } catch (e) {
        console.log(e);
      }
    }
    if (multichannel.appData.instruments.length) {
      _cache.instruments = multichannel.appData.instruments;
      _checkQRScanned();
    } else {
      multichannel.ajaxWrapper.getXhrObj({
        // url: 'https://api.myjson.com/bins/6f83k',
        url: multichannel.apiUrls.devices,
        // url: 'https://mocksvc-proxy.anypoint.mulesoft.com/exchange/47ccee59-b632-4662-93ee-a43312ba5067/devices/1.0.10/devices?countryCode=CN&accountId=1222',
        method: 'GET',
        // headers: { client_id: '1234' },
        loader: _cache.listingView
      }).done(function (data) {
        _cache.instruments = data;
        _checkQRScanned();
      }).fail(function (err) {
        let data = multichannel.commonUtils.errorhandler(err);
        _cache.listingView.html(instrumentListTemp(data));
      });
    }
  };

  /**
   * It is called to render the search bar and bind the search events whenever routing to identifyInstruments view.
   */
  let _renderView = () => {
      let qrPresent = false;
      try {
        qrPresent = JSON.parse(sessionStorage.getItem('configObj'));
        qrPresent = qrPresent.enableQrcode === 'true' ? true : false;
      } catch (e) {
        console.log(e);
      }
      _cache.viewContainer = $('.js-view-container');
      _cache.viewContainer.html(identifyInstrumentTemplate({ qrPresent: qrPresent }));
      _cache.listingView = $('.js-instrument-listing');
      _cache.searchInput = $('#searchInput');
      _cache.backbtn = $('.js-back');
      _cache.backbtn.on('click', (e) => {
        multichannel.appData.callServiceAllCases = false;
        multichannel.commonUtils.backButtonHandler(e, $('.js-view-container'), 'back');
      });
      _cache.searchInput.off('keyup paste').on('keyup paste', _onSearchInput);
      _cache.refreshList = false;
    },
    _bindEvents = () => {
      _cache.viewContainer.off('click').on('click', '.js-open-requests', (e) => {
        e.stopPropagation();
        let target = e.target,
          deviceId = $(target).data('deviceId');
        multichannel.appData.callServiceAllCases = false;
        multichannel.router.navigate('instrumentCases');
        multichannel.instrumentCases.init(deviceId, 'identifyInstruments'); 
      });
    }; 

  multichannel.identifyInstruments = {
    init() {
      _renderView();
      _bindEvents();
      multichannel.appData.callServiceAllCases = true;
      multichannel.caseListing.loadCases(function () {
        _getListingData();
      });
    }
  };
}(window, window.multichannel));