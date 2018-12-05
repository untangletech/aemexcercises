/*!
 * supportFeedback.js

 * This file contians some most feedback rating functions
 *
 * @project   SapientNitro Roche Multichannel
 * @date      2018-08-08
 * @author    Shubham
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
(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};
  let _cache = {};
  let feedbackTemplate = require('./supportFeedback.hbs'), caseDetailsSupport = require('../caseDetail/caseDetailCommon.hbs');

  /**
   * It renders the support feedback view
   */
  let _renderView = () => {
    let selectedCase = multichannel.appData.cases.filteredCases.filter(function (serviceCase) {
      return serviceCase.serviceCases.id === multichannel.appData.selectedCaseId;
    });
    let html = feedbackTemplate();
    $('.js-view-container').html(html);
    $('.js-caseDetailsSupport').html(caseDetailsSupport(selectedCase[0]));
    window.scrollTo(0, 0);
  };
  let _cacheRef = () => {
    _cache.ratingContainer = $('.js-rating-container li');
    _cache.ratingSendButton = $('.js-rating-footer .js-send-button');
    _cache.cancelFeedback = $('.js-rating-footer .js-cancel-feedback');
    _cache.feedbackErrDialog = $('#js-feedback-modal');
    _cache.feedbackPost = {
      'survey': {
        'contactId': '',
        'rating': ''
      }
    };
    _cache.dismissDialog = _cache.feedbackErrDialog.find('button');
    try {
      _cache.feedbackPost.survey.contactId = JSON.parse(localStorage.getItem('LoginAccountObj')).contact_id;
    } catch (e) {
      multichannel.commonUtils.log(e);
    }
  };

  /**
   * It is called on clicking of send button to make post request to service api and navigate user to caseListing
   */
  let _sendBtnHandler = () => {
    _cache.ratingSendButton.attr('disabled', 'disabled');
    _cache.cancelFeedback.attr('disabled', 'disabled');
    multichannel.ajaxWrapper.getXhrObj({
      url: multichannel.apiUrls.createCase + '/' + multichannel.appData.selectedCaseId + '/survey',
      // url: 'https://api.myjson.com/bins/yzqn4', , 'https://api.myjson.com/bins/1096g0'(updated json)//remove this
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(_cache.feedbackPost),
      loader: $('.js-loader-container')
    }).done(function () {
      multichannel.appData.pageControlFrSearch = true;
      multichannel.caseListing.loadMyClosedCases(() => { multichannel.router.navigate('/caseListing'); });
    }).fail(function () {
      // multichannel.commonUtils.log(err);
      _cache.dialog = new MDCDialog(document.querySelector('#js-feedback-modal'));
      _cache.dialog.show();
      _cache.ratingSendButton.removeAttr('disabled');
    }).always(function () {
      _cache.cancelFeedback.removeAttr('disabled');
    });
  };
  let _bindEvents = () => {
    _cache.ratingContainer.on('click', function () {
      let onStar = parseInt($(this).data('value')),
        stars = $(this).parent().children('li');
      _cache.feedbackPost.survey.rating = onStar;
      for (let i = 0; i < stars.length; i++) {
        $(stars[i]).find('.js-icon').removeClass('rated').text('star_border');
      }
      for (let i = 0; i < onStar; i++) {
        $(stars[i]).find('.js-icon').addClass('rated').text('star');
      }
      if ($(this).find('.js-icon').hasClass('rated')) {
        _cache.ratingSendButton.removeAttr('disabled');
      }
    });
    _cache.ratingSendButton.on('click', _sendBtnHandler);
    _cache.cancelFeedback.on('click', (e) => {
      multichannel.appData.pageControlFrSearch = true;
      multichannel.commonUtils.backButtonHandler(e, $('.js-view-container'), 'back');
    });
    _cache.dismissDialog.on('click', () => {
      _cache.dialog.close();
      _cache.cancelFeedback.trigger('click');
    });
  };
  multichannel.supportFeedback = {
    init() {
      _renderView();
      _cacheRef();
      _bindEvents();
    }
  };
}(window, window.multichannel));