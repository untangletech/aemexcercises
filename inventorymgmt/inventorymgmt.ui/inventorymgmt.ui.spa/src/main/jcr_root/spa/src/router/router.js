(function (window, multichannel) {

  if (!(document.getElementById('countrySelector') || document.getElementById('errorPage'))) {
    multichannel = window.multichannel = window.multichannel || {};

    let Router = require('../scripts/vendor/es6-router.js');
    Router = Router.default;

    const router = new Router({});

    router.add('caseListing', () => {
      multichannel.caseListing.init();
      document.title = window.Granite ? window.Granite.I18n.get('cmms_title.caseListing') : 'Multichannel';
    }).add('specifyProblem', () => {
      multichannel.specifyProblem.init();
      document.title = window.Granite ? window.Granite.I18n.get('cmms_title.specifyProblem') : 'Multichannel';
    }).add('caseRequestSearch', () => {
      multichannel.caseRequestSearch.init();
      document.title = window.Granite ? window.Granite.I18n.get('cmms_title.caseSearch') : 'Multichannel';
    }).add('identifyInstruments', () => {
      multichannel.identifyInstruments.init();
      document.title = window.Granite ? window.Granite.I18n.get('cmms_title.identifyInstruments') : 'Multichannel';
    }).add('imageView', () => {
      multichannel.imageView.init();
    }).add('qRCodeInstrument', () => {
      multichannel.qRCodeInstrument.init();
      document.title = window.Granite ? window.Granite.I18n.get('cmms_title.qRCodeInstrument') : 'Multichannel';
    }).add('supportFeedback', () => {
      multichannel.supportFeedback.init();
      document.title = window.Granite ? window.Granite.I18n.get('cmms_title.supportFeedback') : 'Multichannel';
    }).add('instrumentCases', () => {
      document.title = window.Granite ? window.Granite.I18n.get('cmms_title.instrumentCases') : 'Multichannel';
    });
    multichannel.router = router;
  }

}(window, window.multichannel));


