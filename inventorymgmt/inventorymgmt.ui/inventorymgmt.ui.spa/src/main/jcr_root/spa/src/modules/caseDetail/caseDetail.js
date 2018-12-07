
import { MDCDialog } from '@material/dialog';

(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};

  let casesDetailTemplate = require('./caseDetail.hbs'), caseDetailCommon = require('./caseDetailCommon.hbs'), dialog;
  multichannel.caseDetail = {
    init() {
      multichannel.commonUtils.log('initialize case detail');
    },
    showCaseDetail(caseId) {
      let selectedCase = multichannel.appData.cases.filteredCases.filter(function (serviceCase) {
        return serviceCase.serviceCases.id === caseId;
      });
      let configObj = JSON.parse(sessionStorage.getItem('configObj')), detFeedbackBtn = '';
      if (configObj.enableFeedback && configObj.enableFeedback === 'true' && multichannel.appData.filterSelected === 'closedCases' && !(selectedCase[0].serviceCases.survey)) {
        detFeedbackBtn = window.Granite ? window.Granite.I18n.get('cmms_caselisting.feedbackBtn') : 'Support Feedback';
      }
      let html = casesDetailTemplate();
      $('.js-case-detail-container').html(html);
      $('.js-caseDetailCommon').html(caseDetailCommon({ 'serviceCases': selectedCase[0].serviceCases, 'detFeedbackBtn': detFeedbackBtn }));
      dialog = new MDCDialog(document.querySelector('#js-case-detail-dialog'));
      dialog.show();
      $('.js-caseDet-feedback').on('click', (e) => {
        dialog.close();
        multichannel.appData.selectedCaseId = $(e.currentTarget).data('caseId');
        multichannel.router.navigate('/supportFeedback');
      });
      $('.js-view-container').on('click', '.js-close-case-dialog', function () {
        dialog.close();
      });
    }
  };

}(window, window.multichannel));