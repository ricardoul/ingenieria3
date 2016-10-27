exports.config = {
  seleniumAddress: 'http://localhost:3000',

  multiCapabilities: [
	{
	  'browserName' : 'chrome'
	},
	{
	  'browserName' : 'firefox'
	}
  ],

  specs: ['test-spec.js'],

  jasmineNodeOpts: {
    showColors: true
  }
};