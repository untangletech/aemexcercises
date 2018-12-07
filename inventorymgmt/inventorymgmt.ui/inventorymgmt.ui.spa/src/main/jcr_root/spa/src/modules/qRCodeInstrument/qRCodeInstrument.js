/*!
 * QR code instruments.js

 * This file contians some most QR code functionality functions
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
import {
  MDCDialog
} from '@material/dialog';
import QRReader from '../../scripts/vendor/qrscan.js';
import {
  MDCSnackbar
} from '@material/snackbar';

(function(window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};
  let qRCodeInstrumentTemplate = require('./qRCodeInstrument.hbs'),
    dialog, _cache = {};
  window.userMediaSupported = false;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (navigator.userAgent.indexOf(' UCBrowser/') < 0)) {
    window.userMediaSupported = true;
  }

  let _renderView = () => {
    let html = qRCodeInstrumentTemplate();
    $('.js-view-container').html(html);
  };

  //fetch Instruments data from API
  let fetchInstrumentData = () => {
    try {
      let accountData = JSON.parse(localStorage.getItem('LoginAccountObj'));
      _cache.crmAccountNo = accountData.crmAccountNo;
      _cache.countryCode = accountData.countryCode;
    } catch (error) {
      const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
      const dataObj = {
        message: 'Invalid user credentials!',
        multiline: true,
        timeout: 10000
      };
      snackbar.show(dataObj);
      return;
    }

    multichannel.ajaxWrapper.getXhrObj({
      url: multichannel.apiUrls.devices,
      method: 'GET',
      timeout: 10000,
      loader: _cache.loaderContainer
    }).done(function(data) {
      multichannel.commonUtils.log(data);
      multichannel.appData.instruments = [];
      multichannel.appData.instruments = data;
      multichannel.router.navigate('/identifyInstruments');
    }).fail(function(err) {
      let data = multichannel.commonUtils.errorhandler(err);
      const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
      const dataObj = {
        message: data.statusText,
        multiline: true,
        timeout: 10000
      };
      snackbar.show(dataObj);
    });
  };

  let stopMedia = () => {
    window.mediaStream.getTracks().forEach(function(track) {
      track.stop();
    });
    window.mediaStream = null;
    //window.mediaStream.getTracks()[0].stop();
  };

  //Scan
  let scan = () => {
    if (window.userMediaSupported) {
      _cache.scanningEle.style.display = 'block';
      _cache.selectPhotoBtn.style.display = 'none';
      
    }
    QRReader.scan((result) => {
      multichannel.commonUtils.beep();
      if (window.mediaStream) {
        stopMedia();
      }
      multichannel.appData.fromQRScanner = true;
      result = result.match('Serialnumber:(.*)\n');
      if (result) {
        _cache.serialNo = result[1];
        _cache.copiedText = result[0];
        _cache.textBoxEle.innerHTML = _cache.copiedText;
        multichannel.appData.selectedInstrument = _cache.serialNo.trim();
        fetchInstrumentData();
      } else {
        //_cache.copiedText = 'invalid QR Code';
        multichannel.appData.selectedInstrument = 'error';
        multichannel.router.navigate('/identifyInstruments');
        //dialog.show();
        //_cache.textBoxEle.innerHTML = _cache.copiedText;
      }

    });
  };

  //Hide dialog
  let hideDialog = () => {
    _cache.copiedText = null;
    _cache.textBoxEle.innerHTML = '';
    if (!window.userMediaSupported) {
      _cache.frame.src = '';
      _cache.frame.className = '';
    }
    scan();
  };

  let _setCameraOverlay = () => {
    _cache.pageContentElement.classList.remove('x-hidden');
    window.appOverlay.classList.remove('x-hidden');
    window.appOverlay.style.borderStyle = 'solid';
    _cache.helpText.style.display = 'block';
  };

  let _createFrame = () => {
    _cache.frame = document.createElement('img');
    _cache.frame.src = '';
    _cache.frame.id = 'frame';
  };

  let _selectFromPhoto = () => {
    if (_cache.videoElement) {
      _cache.videoElement.remove(); //removing the video element
    }
    //Creating the camera element
    if ($('#camera').length === 0) {
      let camera = document.createElement('input');
      camera.setAttribute('type', 'file');
      camera.setAttribute('capture', 'camera');
      camera.id = 'camera';
      _cache.helpText.textContent = '';
      window.appOverlay.style.borderStyle = '';
      _createFrame();

      //Add the camera and img element to DOM
      _cache.pageContentElement.appendChild(camera);
      _cache.pageContentElement.appendChild(_cache.frame);
      _cache.scanningEle.style.display = 'none';
      //On camera change
      camera.addEventListener('change', (event) => {
        if (event.target && event.target.files.length > 0) {
          _cache.frame.className = 'app__overlay';
          _cache.frame.src = URL.createObjectURL(event.target.files[0]);
          _cache.scanningEle.style.display = 'block';
          _cache.selectPhotoBtn.style.display = 'none';
          scan();
        }
      });
    }
    document.querySelector('#camera').click();
  };

  let _initializeQRCodeScanner = () => {
    if (!window.userMediaSupported) {
      //for iOS support
      _selectFromPhoto();
    }
    QRReader.init(); //To initialize QR Scanner
    // Set camera overlay size
    setTimeout(() => {
      _setCameraOverlay();
      if (window.userMediaSupported) {
        scan();
      }
    }, 1000);
  };

  let _bindDialogEvents = () => {
    dialog.listen('MDCDialog:cancel', function() {
      hideDialog();
    });
  };

  let _bindEvents = () => {
    _cache.selectPhotoBtn.addEventListener('click', () => {
      _initializeQRCodeScanner();
    });
    _cache.btnInstrumentList.on('click', () => {
      if (window.mediaStream) {
        stopMedia();
      }
      fetchInstrumentData();
    });
    _cache.backbtn.on('click', function(e) {
      multichannel.commonUtils.backButtonHandler(e, $('.js-view-container'), 'back');
      if (window.mediaStream) {
        stopMedia();
      }
    });
    _cache.videoElement.addEventListener('webkitendfullscreen', function() {
      _cache.scanningEle.style.display = 'none';
      _cache.selectPhotoBtn.style.display = 'flex';
      //window.mediaStream.getTracks()[0].stop();
      window.mediaStream.getTracks().forEach(function(track) {
        track.stop();
      });
      window.mediaStream = null;
    });
  };

  let _initCache = () => {
    _cache.copiedText = null;
    _cache.frame = null;
    _cache.selectPhotoBtn = document.querySelector('.app__select-photos');
    _cache.dialogElement = document.querySelector('#js-mdc-dialog');
    _cache.dialogOverlayElement = document.querySelector('.app__dialog-overlay');
    _cache.scanningEle = document.querySelector('.custom-scanner');
    _cache.textBoxEle = document.querySelector('#js-result');
    _cache.helpText = document.querySelector('.app__help-text');
    _cache.videoElement = document.querySelector('video');
    window.appOverlay = document.querySelector('.app__overlay');
    _cache.pageContentElement = document.querySelector('.app__layout-content');
    _cache.btnInstrumentList = $('.js-instrumentList');
    _cache.loaderContainer = $('.js-loader-container');
    _cache.backbtn = $('.js-back');
  };

  multichannel.qRCodeInstrument = {
    init() {
      _renderView();
      _initCache();
      dialog = new MDCDialog(document.querySelector('#js-mdc-dialog'));
      _bindDialogEvents();
      _bindEvents();

    }
  };
}(window, window.multichannel));