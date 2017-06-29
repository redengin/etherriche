assert = require( 'assert' );
var TestRpc = require( 'ethereumjs-testrpc' );
var Web3 = require( 'web3' );


describe( 'etherRiche', function ()
{
  var bankAddress = '0x8bb00852623184d534d9805c66ed85b1d8ec0f52';

  /* use a mock blockchain */
  var web3 = new Web3();
  web3.setProvider( TestRpc.provider() );

  /* create the contract Class */
  var fs = require( 'fs' );
  var abi = JSON.parse( fs.readFileSync( './bin/contracts/EtherRiche.abi' ) );
  var bytecode = fs.readFileSync( './bin/contracts/EtherRiche.bin', 'utf8' );
  var Contract = web3.eth.contract( abi );

  var accounts;
  it( 'requires mock accounts', function ( done )
  {
    /* get the first testrpc account */
    web3.eth.getAccounts(
      function ( _err, _accounts )
      {
        if ( !_err )
        {
          accounts = _accounts;
          done();
        }
        else
        {
          done( _err );
        }
      }
    );
  } );

  var contractAddress;
  it( 'requires a contract', function ( done )
  {
    /* create the contract using the first account */
    var contract = Contract.new(
      {
        from: accounts[0],
        data: bytecode,
        gas: 4E6
      },
      function ( _err, _contract )
      {
        if ( ! _err )
        {
          if ( _contract.address )
          {
            contractAddress = _contract.address;
            done();
          }
        }
        else
        {
          done( _err );
        }
      }
    );
  } );

  var claim = 200;
  it( 'should accept the first claim', function ( done )
  {
    var contract = Contract.at( contractAddress );

    contract.buySeat( 'a url to an avatar', 'hello world',
      {
        from: accounts[0],
        value: claim,
        gas: 4E6,
      },
      function ( _err, _result )
      {
        if ( _err )
        {
          done( _err );
        }
        else if ( _result )
        {
          done();
        }
      }
    );
  } );

  it( 'should transfer funds to the bank', function ( done )
  {
    web3.eth.getBalance( bankAddress,
      function ( _err, _result )
      {
        if ( _err )
        {
          done( _err );
        }
        else if ( _result )
        {
          assert( claim == _result );
          done();
        }
      }
    );
  } );


  describe( 'should require payment', function ()
  {
    var badAvatarUrl = 'BAD';
    it( 'gets a payment of 0', function ( done )
    {
      var contract = Contract.at( contractAddress );
      contract.buySeat( badAvatarUrl, 'BAD',
        {
          from: accounts[0],
          value: 0,
          gas: 4E6,
        },
        function ( _err, _result )
        {
          if ( _err )
          {
            done( _err );
          }
          else
          {
            done();
          }
        }
      );
    } );

    it( 'rejects a claim of 0', function ( )
    {
      var contract = Contract.at( contractAddress );
      assert.notEqual( badAvatarUrl, contract.seat0_avatarUrl );
      assert.notEqual( badAvatarUrl, contract.seat1_avatarUrl );
      assert.notEqual( badAvatarUrl, contract.seat2_avatarUrl );
      assert.notEqual( badAvatarUrl, contract.seat3_avatarUrl );
      assert.notEqual( badAvatarUrl, contract.seat4_avatarUrl );
    } );

  } );

  it( 'should reject a payment less than or eual to the minimum', function ()
  {
    // TODO
  } );

  it( 'should accept a payment greater than the minimum present claim values', function ()
  {
    // TODO
  } );

  it( 'should require the maximal claim degrade in 30 days', function ()
  {
    // TODO
  } );

  it( 'should topoff a current seat value', function ()
  {
    // TODO
  } );

  it( 'should replace the lowest seat given a more valuable claim', function ()
  {
    // TODO
  } );

} );