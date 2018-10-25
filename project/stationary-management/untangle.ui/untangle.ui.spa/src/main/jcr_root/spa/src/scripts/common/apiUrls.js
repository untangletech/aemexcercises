(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {};

  multichannel.localhostUrl = window.location.hostname === 'localhost' ? 'https://roche-cmms.sapient.com' : '';
  multichannel.apiUrls = {
    loginDetails: multichannel.localhostUrl + '/api/c1/login_details',
    serviceCase: multichannel.localhostUrl + '/api/v1/accounts/serviceCases',
    devices: multichannel.localhostUrl + '/api/v1/accounts/devices',
    createCase: multichannel.localhostUrl + '/api/v1/serviceCases',
    configurations: multichannel.localhostUrl + '/bin/cmms/multichannel.',
    myCases: multichannel.localhostUrl + '/api/v1/contacts/serviceCases'
  };
}(window, window.multichannel));