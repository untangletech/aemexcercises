
/*!
 * image Full View.js

 * This file contians some most case requests functions
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

import {MDCDialog} from '@material/dialog';
(function (window, multichannel) {
    
  multichannel = window.multichannel = window.multichannel || {}; 

  let imageViewTemplate = require('./imageView.hbs'), dialog;

  multichannel.imageView = {
    renderView: (data, element) => {
      let html = imageViewTemplate(data);
      $('#js-image-container').html(html);
      dialog = new MDCDialog(document.querySelector('#js-image-viewer-dialog'));
      document.querySelector('.js-delete-image-btn').addEventListener('click', () => {
        dialog.close();
        let imgName = element.parent().data('imgname');
        element.parent().remove();
        multichannel.specifyProblem.updateImageCount(imgName);
      });
      dialog.listen('MDCDialog:cancel', function() {
        dialog.close();
      });
      dialog.show();
    }
  };
}(window, window.multichannel));