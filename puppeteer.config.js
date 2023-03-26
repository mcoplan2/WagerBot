module.exports = {
    launch: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    browserContext: 'default',
    exitOnPageError: false,
    timeout: 30000,
    cacheDirectory: '.cache/puppeteer',
  };
  
  