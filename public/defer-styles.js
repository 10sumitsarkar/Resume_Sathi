(function(){
  var urls = [
    '/front-assets/css/bootstrap.min.css',
    '/front-assets/css/style.css',
    '/front-assets/css/responsive.css',
    'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
  ];

  function addStylesheet(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (href.indexOf('fonts.googleapis.com') === 0) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }

  function loadStyles() {
    for (var i = 0; i < urls.length; i += 1) {
      addStylesheet(urls[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStyles);
  } else {
    loadStyles();
  }
})();
