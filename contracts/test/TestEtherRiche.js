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
  it( 'requires at least eight mock accounts', function ( done )
  {
    /* get the testrpc accounts */
    web3.eth.getAccounts(
      function ( _err, _accounts )
      {
        if ( !_err )
        {
          accounts = _accounts;
          assert( ( accounts.length >= 8 ),
              "only found " + accounts.length + " accounts" );
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


  var claim = 1;
  it( 'should accept the first five claims', function ( done )
  {
    this.timeout( 3000 );
    var createdCount = 0;
    for( var i=0; 5 > i; ++i )
    {
      Contract.at( contractAddress ).buySeat( 'avatar'+i, 'hello world '+i,
        {
          from: accounts[i],
          value: claim,
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
            ++createdCount;
            if( createdCount >= 5 )
            {
              done();
            }
          }
        }
      );
    }
  } );


  it( 'should transfer funds to the bank', function ( done )
  {
    web3.eth.getBalance( bankAddress,
      function ( _err, _balance )
      {
        if ( _err )
        {
          done( _err );
        }
        else if ( _balance )
        {
          assert.equal( _balance, ( 5 * claim ) );
          done();
        }
      }
    );
  } );


  it( 'should reject a payment less than the present minimum', function ( done )
  {
    Contract.at( contractAddress ).buySeat( 'INVALID', 'INVALID',
      {
        from: accounts[5],
        value: ( claim - 1 ),
        gas: 4E6,
      },
      function ( _err, _result )
      {
        if ( _err )
        {
          /* failure expected */
          done();
        }
        else
        {
          done( 'invalid claim' );
        }
      }
    );
  } );


  it( 'should accept a payment equal to the present minimum', function ( done )
  {
    Contract.at( contractAddress ).buySeat( 'replacer equal', 'I replaced a seat',
      {
        from: accounts[5],
        value: claim,
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


  it( 'should accept a payment greater than the present value minimum', function ( done )
  {
    Contract.at( contractAddress ).buySeat( 'replacer greater', 'I replaced a seat',
      {
        from: accounts[6],
        value: ( claim + 1 ),
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


  it( 'the test 30 days to pass', function( done )
  {
    /* after advancing time, mine to record time change */
    function mine()
    {
      web3.currentProvider.sendAsync(
        {
          jsonrpc: "2.0",
          method: "evm_mine"
        },
        ( _err ) =>
        {
          if( _err )
          {
            done( _err );
          }
          else
          {
            done();
          }
        }
      );
    }

    /* advance the time */
    var forward_s = ( 30 * 24 * 60 * 60 );  /* thirty days */
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [ forward_s ]
      },
      ( _err ) =>
      {
        if( _err )
        {
          done( _err );
        }
        else mine();
      }
    );
  } );


  it( 'should accept any claim after 30 days', function( done )
  {
    Contract.at( contractAddress ).buySeat( 'lowballer', 'I lowballed a seat',
      {
        from: accounts[7],
        value: 1,
        gas: 4E6,
      },
      function ( _err, _claim )
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


  it( 'should accept topoff a current claim', function( done )
  {
    Contract.at( contractAddress ).buySeat( 'replacer greater', 'I replaced a seat',
      {
        from: accounts[4],
        value: 2,
        gas: 4E6,
      },
      function ( _err, _claim )
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


  it( 'should record the claim value', function( done )
  {
    var claimCount = 0;
    function validateClaim( _index, _claim )
    {
      var expectedValue;
      switch( _index )
      {
        case 4:
                  expectedValue = 2;
                  break;

        default:
                  expectedValue = 1;
                  break;
      }

      assert.equal( _claim, expectedValue,
          'expected ' + expectedValue + ' for seat ' + _index + ' got ' + _claim  );

      ++claimCount;
      if( 5 > claimCount )
      {
        done();
      }
    }


    var completed = false;
    for( var seat=0; 5 > seat; ++seat )
    {
      var _index = seat;
      Contract.at( contractAddress ).getSeatClaim( seat,
        ( _err, _claim ) =>
        {
          if( _err )
          {
            done( _err );
          }
          else
          {
            validateClaim( _index, _claim );
            if( completed ) done();
          }
        }
      );
    }
  } );

} );