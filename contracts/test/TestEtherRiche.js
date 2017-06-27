var TestRpc = require( 'ethereumjs-testrpc' );
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(TestRpc.provider());




describe('etherRiche', function() {

  it('should require a contract', function()
  {
    // TODO
  });

  it('should require payment', function()
  {
    // TODO
  });

  it('should reject a payment less than or eual to the minimum', function()
  {
    // TODO
  });

  it('should accept a payment greater than the minimum present claim values', function()
  {
    // TODO
  });

  it('should require the maximal claim degrade in 30 days', function()
  {
    // TODO
  });

  it('should topoff a current seat value', function()
  {
    // TODO
  });

  it('should replace the lowest seat given a more valuable claim', function()
  {
    // TODO
  });

});