var moment = require('moment');
(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};

  let _sortCases = (status, cases) => {
    let sortingKey = status === 'open' ? 'createdDate' : 'closedDate';
    cases.sort(function (obj1, obj2) {
      return moment(obj2.serviceCases[sortingKey]) - moment(obj1.serviceCases[sortingKey]);
    });
    return cases;
  };
  multichannel.appData = {
    cases: {
      allCases: [],
      myOpen: [],
      allOpen: [],
      myClosed: [],
      allClosed: [],
      getOpenCases: function (allCases) {
        let openStatusCases = [];
        openStatusCases = allCases.filter(function (obj) {
          let objStatus = obj.serviceCases.status.toLowerCase();
          return objStatus === 'open' || objStatus === 'dispatched';
        });
        return openStatusCases;
      },
      getCasesByDevice: function (deviceId) {
        let casesByDevice = [];
        casesByDevice = multichannel.appData.cases.allCases.filter(function (obj) {
          let objStatus = obj.serviceCases.status.toLowerCase();
          return obj.serviceCases.devices.id === deviceId && (objStatus === 'open' || objStatus === 'dispatched');
        });
        _sortCases('open', casesByDevice);
        return casesByDevice;
      }
    },
    instruments: [],
    selectedInstrument: '',
    casesResponseMessage: '',
    selectedCaseId: '',
    filterSelected: '',
    innerTextSelected: '',
    pageControlFrSearch: false,
    caseResponseObject: {},
    callServiceAllCases: false,
    createCaseFailed: false
  };

}(window, window.multichannel));