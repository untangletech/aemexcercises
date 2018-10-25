(function (window, multichannel) {

  multichannel = window.multichannel = window.multichannel || {}; 

  let commonModules = ['ajaxWrapper','commonUtils'];

  multichannel.core = {

    init() {
        
      // initialize modules, and app initialization logic
      $.each(commonModules, function(index, value) {
        try {
          // initialize the current module
          multichannel[value].init();
        } catch(e) {
          // catch error, if any, while initialing module
          console.log(`${value} doesn't have init method.`);
          multichannel.commonUtils.log(`${value} doesn't have init method.` );
        }
      });

      multichannel.commonUtils.setCookie('testCookie','testvalue');
    }
  };

  multichannel.core.init();

}(window, window.multichannel));