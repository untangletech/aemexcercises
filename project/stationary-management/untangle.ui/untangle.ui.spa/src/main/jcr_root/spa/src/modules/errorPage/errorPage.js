/*!
 * rating Feedback.js

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
(function(window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};
  let _bindEvents = () => {
    $('.back-start-btn').on('click', function() {
      console.log('clicked');
      window.location.href = window.location.origin;
    });
  };

  multichannel.errorPage = {
    init() {
      _bindEvents();
    }
  };


}(window, window.multichannel));