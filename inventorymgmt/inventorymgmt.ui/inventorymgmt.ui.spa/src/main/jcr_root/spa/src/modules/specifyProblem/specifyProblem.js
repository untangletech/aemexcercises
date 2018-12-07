/*!
 * specify Problem.js

 * This file contians some most creat case functions
 *
 * @project   SapientNitro Roche Multichannel
 * @date      2018-08-3
 * @author    Rohan Mahajan
 * @dependencies jQuery
 */

//this will cause the browser to check for errors more aggressively

/* eslint-disable new-cap */

/**
 * @namespace Main
 * @memberof multichannel
 * @property {null} property - description of property
 */
import { MDCTextField } from '@material/textfield';
import {MDCDialog} from '@material/dialog';

(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};

  let _cache = {}, formData, imageCount, pageData, dialog;
  const template = require('./specifyProblem.hbs');
  let atachment = [], jsonForm={};

  let _cacheRef = () => {
    _cache.viewContainer = $('.js-view-container');
    _cache.backbtn = $('.js-back');
    _cache.subject = document.getElementById('subject');
    _cache.subjectCount = document.querySelector('.subjectCount');
    _cache.description = document.getElementById('description');
    _cache.descriptionCount = document.querySelector('.descriptionCount');
    _cache.caseForm = document.getElementById('caseForm');
    _cache.sendBtn = document.querySelector('.specify-problem-footer__send-btn');
    _cache.userName = document.getElementById('contactName');
    _cache.emailID = document.getElementById('emailID');
    _cache.phnNumber = document.getElementById('contactPhn');
    _cache.imageInput = document.getElementById('images');
    _cache.imageInputLabel = document.querySelector('.custom-file-upload');
    _cache.ImageList = document.getElementById('image-list');
    _cache.checkbox= document.getElementById('tncCheckbox');
    _cache.tncBtn = document.querySelector('.read-tnc-btn');
    _cache.loaderContainer = $('.js-loader-container');
    _cache.allInputFields = $('.mdc-text-field__input');
  };

  let _renderView = () => {
    let response = localStorage.getItem('LoginAccountObj');
    let localObj, data;
    let qrPresent = false;
    try {
      qrPresent = JSON.parse(sessionStorage.getItem('configObj'));
      qrPresent = qrPresent.enableQrcode === 'true' ? true : false;
    } catch (e) {
      console.log(e);
    }
    if (response) {
      try {
        localObj = JSON.parse(response);
        pageData = {
          contact_id: localObj.contact_id
        };
        data = {
          qrCode: qrPresent,
          contactName: localObj.name + ' ' + localObj.familyName,
          contactPhn: localObj.telephone,
          emailID: localObj.email,
          deviceSerialNo: multichannel.appData.clickedInstrument.deviceSerialNo,
          deviceMaterialsName: multichannel.appData.clickedInstrument.deviceMaterialsName,
          accountName: multichannel.appData.clickedInstrument.accountName,
          deviceId: multichannel.appData.clickedInstrument.deviceId,
          assignedCaseId : multichannel.appData.clickedInstrument.assignedCaseId,
          assignedRequest : multichannel.appData.clickedInstrument.assignedRequest
        };
      } catch (e) {
        console.log(e);
      }
    }
    let html = template(data);
    $('.js-view-container').html(html);
    const textFields = document.querySelectorAll('.mdc-text-field');
    [...textFields].forEach((el) => new MDCTextField(el));
    if (window.FormData) {
      formData = new FormData();
    }
    dialog = new MDCDialog(document.querySelector('#tnc-modal'));
  };
  let stripScripts = (s) => {
    let div = document.createElement('div');
    div.innerHTML = s;
    let scripts = div.getElementsByTagName('script');
    let i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
  };
  let _sendCaseData = () => {
    jsonForm = {
      'serviceCases': {
        'accounts': {
          'id': multichannel.appData.clickedInstrument.crmAccountNo
        },
        'devices': {
          id: multichannel.appData.clickedInstrument.deviceId
        },
        'contacts': {
          'id': pageData.contact_id
        },
        'temporaryContactName': stripScripts(_cache.userName.value),
        'temporaryCallbackNo': _cache.phnNumber.value,
        'requestType': multichannel.commonUtils.getRadioVal(_cache.caseForm, 'requestType'),
        'recordType': 'Unqualified',
        'channel': 'Mobile',
        'subject': stripScripts(_cache.subject.value),
        'description': stripScripts(_cache.description.value),
        'deviceStatus': multichannel.commonUtils.getRadioVal(_cache.caseForm, 'systemDownType'),
        'attachments': atachment
      }
    };
    let options = {
      url: multichannel.apiUrls.createCase,
      type: 'POST',
      processData: false,
      dataType : 'json',
      contentType: 'application/json',
      data: JSON.stringify(jsonForm),
      loader: _cache.loaderContainer
    };
    multichannel.ajaxWrapper.getXhrObj(options).done(function (data) {
      if(data.statusCode === 201){
        multichannel.appData.casesResponseMessage = 'cmms_specifyproblem.success';
        multichannel.appData.caseResponseObject.caseId = data.id ? data.id: '';
        multichannel.appData.caseResponseObject.caseIdMessage = data.id ? 'cmms_specifyproblem.caseIdMessage': '';
        multichannel.appData.createCaseFailed = false;
        multichannel.caseListing.clearCasesCache();
        multichannel.router.navigate('/caseListing');
      } 
    }).fail(function () {
      multichannel.appData.casesResponseMessage = 'cmms_specifyproblem.faliure';
      multichannel.appData.createCaseFailed = true;
      multichannel.caseListing.clearCasesCache();
      multichannel.router.navigate('/caseListing');
    });
  };
  let _imageFileUploaded = (e) => {
    let i = 0, reader, file;
    file = e.target.files[i];
    if (window.FileReader) {
      if (imageCount <= 3) {
        reader = new FileReader();
        reader.onloadend = function (e) {
          _cache.ImageList.insertAdjacentHTML('afterbegin', `<li data-imgname='${file.name}'><img src='${e.target.result}' alt=image></li>`);
        };
        reader.readAsDataURL(file);
        let raw;
        reader.onload = function() {
          raw = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
          let atachmentItem = {
            'fileName': file.name,
            'mediaType': file.type,
            'attachment': raw
          };
          atachment[imageCount-1] = atachmentItem;
        };
        if (imageCount === 3) {
          _cache.imageInputLabel.style.display = 'none';
        }
      }
    }
    if (formData) {
      formData.append('images[]', file);
    }
    imageCount++;
  };
  let getTncState = () => {
    if(imageCount === 0){
      return true;
    }else if(imageCount > 0 && document.getElementById('tncCheckbox').checked) {
      return true;
    } else {
      return false;
    }
  };
  //function to sanitize input to prevent XSS
  

  let validateInputs = () => {
    event.stopImmediatePropagation();
    let textFields = document.querySelectorAll('.mdc-text-field__input');
    let fieldsArrVal = [...textFields].map((item) => item.value === '' ? 0 : 1);

    //let emailState = multichannel.commonUtils.validateEmail(_cache.emailID.value);
    let phnState = multichannel.commonUtils.validatePhoneNumber(_cache.phnNumber.value);
    let tncState = getTncState();

    if (!phnState) {
      setTimeout(function() {
        _cache.phnNumber.parentNode.classList.add('mdc-text-field--invalid');
      },100);
    } else {
      _cache.phnNumber.parentNode.classList.remove('mdc-text-field--invalid');
    }
    
    //if all fileds are filled and email and phn number are vaild then remove disabled
    if (fieldsArrVal.indexOf(0) === -1 && phnState && tncState ) {
      _cache.sendBtn.removeAttribute('disabled');
    } else {
      _cache.sendBtn.setAttribute('disabled', true);
    }
  };
  let observe = function (element, event, handler) {
    element.addEventListener(event, handler, false);
  };
  let _bindTextAreaEvent =() => {
    let text = document.getElementById('description');
    function resize () {
      text.style.height = 'auto';
      text.style.height = text.scrollHeight+'px';
      if(text.scrollHeight > 70) {
        $('#description').next().addClass('mdc-floating-label-text-area');
      }
      else {
        $('#description').next().removeClass('mdc-floating-label-text-area');
      }
      if(text.scrollHeight > 250) {
        $('#description').next().addClass('mdc-floating-label-top');
      }
      else {
        $('#description').next().removeClass('mdc-floating-label-top');
      }
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
      window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);
    resize();
  };
  let _bindEvents = () => {
    _cache.backbtn.on('click', (e) => {
      multichannel.commonUtils.backButtonHandler(e, $('.js-view-container'), 'back');
    });

    //keeping track of characters entered in subject field.
    _cache.subject.addEventListener('keyup', (e) => {
      _cache.subjectCount.textContent = e.target.value.length;
    });

    //keeping track of characters entered in description field
    _cache.description.addEventListener('keyup', (e) => {
      _cache.descriptionCount.textContent = e.target.value.length;
    });

    //check for mandatory fields & validation
    _cache.caseForm.addEventListener('change', validateInputs, false);

    //check for mandatory fields & validation
    _cache.allInputFields.on('keyup',() => {
      validateInputs();
    });

    //handle image data in form
    _cache.imageInput.addEventListener('change', _imageFileUploaded, false);

    //submit form data on send button click
    _cache.sendBtn.addEventListener('click', () => {
      _cache.sendBtn.setAttribute('disabled', true);
      _sendCaseData();
    });

    //show tnc modal on read btn
    _cache.tncBtn.addEventListener('click', () => {
      dialog.show();
    });

    _cache.viewContainer.off('click').on('click', '.js-device-open-request', (e) => {
      let target = e.target,
        deviceId = $(target).data('deviceId');
      multichannel.router.navigate('instrumentCases');
      multichannel.instrumentCases.init(deviceId, 'specifyProblem'); 
    });


    _cache.ImageList.addEventListener('click', (e) => {
      let element = $(e.target);
      if (element.is('img')) {
        multichannel.imageView.renderView(element.attr('src'), element, _cache.imageInputLabel);
      }
    });
    let ua = navigator.userAgent.toLowerCase();
    let isAndroid = ua.indexOf('android') > -1; //&& ua.indexOf("mobile");
    if(isAndroid) {
      // Do something!
      // Redirect to Android-site?
      $('#description').attr('maxlength',140);
    }

    _cache.description.addEventListener('keypress',(e) => {
      if ($(e.currentTarget).val().length === 140) {
        e.preventDefault();
      } 
      else if ($(e.currentTarget).val().length > 140) {
        // Maximum exceeded
        this.value = this.value.substring(0, 140);
      }
    });
  };
  multichannel.specifyProblem = {
    init() {
      document.body.scrollTop = 0;
      formData = false;
      atachment = [];
      imageCount = 0;
      _renderView();
      _cacheRef();
      _bindEvents();
      _bindTextAreaEvent();
    },
    updateImageCount(imgName) {
      _cache.imageInputLabel.style.display = 'flex';
      let imgIndex = atachment.findIndex(x => x.fileName === imgName);
      atachment.splice(imgIndex, 1);
      --imageCount;
      if(imageCount===0){
        atachment = [];
        validateInputs();
      }
    }
  };
}(window, window.multichannel));