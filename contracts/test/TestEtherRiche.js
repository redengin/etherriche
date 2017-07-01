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
  it( 'requires at least six mock accounts', function ( done )
  {
    /* get the testrpc accounts */
    web3.eth.getAccounts(
      function ( _err, _accounts )
      {
        if ( !_err )
        {
          accounts = _accounts;
          assert( ( accounts.length >= 6 ),
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


  var claim = 200;
  it( 'should accept the first five claims', function ( done )
  {
    var createdCount = 0;
    for( var i=0; 5 >= i; ++i )
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
            console.log( "bought seat" );
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


  it( 'should reject a payment less than the present value minimum', function ()
  {
    // TODO
  } );


  it( 'should accept a payment greater than the minimum present value minimum', function ()
  {
    // TODO
  } );


  it( 'should zero all claims in 30 days', function ()
  {
    // TODO
  } );


  it( 'should topoff a current claim', function ()
  {
    // TODO
  } );

} );