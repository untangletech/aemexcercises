//entry point for webpack

import './scripts/common/ajax.wrapper.js';
import './scripts/common/appData.js';
import './scripts/common/apiUrls.js';
import './scripts/utilities/common.utils.js';
import './scripts/helpers/helper.js';
import './modules/caseListing/caseListing.js';
import './modules/caseDetail/caseDetail.js';
import './modules/caseRequestSearch/caseRequestSearch.js';
import './modules/identifyInstruments/identifyInstruments.js';
import './modules/imageView/imageView.js';
import './modules/qRCodeInstrument/qRCodeInstrument.js';
import './modules/specifyProblem/specifyProblem.js';
import './modules/supportFeedback/supportFeedback.js';
import './modules/instrumentCases/instrumentCases.js';
import './modules/countrySelector/countrySelector.js';
import './modules/errorPage/errorPage.js';
import './router/router.js';
import './scripts/base/core.js';
import './scripts/helpers/helper.js';

//scss
import './assets/scss/app.scss';

