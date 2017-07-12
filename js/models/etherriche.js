models.EtherRiche = Backbone.Model.extend(
{
  seatCount: 5,

  defaults:
  {
    burnTime:     undefined,  /* seconds until claim is fully burned */
    burnRate:     undefined,  /* wei burned per second */
    lastBurn:     undefined,  /* timestamp (in seconds) of last burn */

    contract:     undefined,  /* the contract to use */
  },

  presentValue: function( claim )
  {
    if( ! claim ) return 0;

    let parent = this.attributes.etherriche;
    let burnRate = this.attributes.burnRate;
    let lastBurn = this.attributes.lastBurn;

    let burnDuration = web3.toBigNumber( ( Date.now() / 1000 ) - lastBurn );

    return ( claim.minus( burnRate.times( burnDuration ) ) );
  },


  constructor: function()
  {
    /* call base constructor */
    Backbone.Model.apply( this, arguments );

    /* create the seats collection */
    this._seats = new collections.Seats();
    for( let i=0; 5 > i; ++i )
    {
      let model = new models.Riche( { id:i, contract:this.attributes.contract, etherriche:this } );
      this._seats.add( model );
    }
  },


  fetch: function()
  {
    /* fetch burnTime */
    this.attributes.contract.burnTime.call(
      ( _err, _result ) =>
      {
        if( ! _err ) this.set( 'burnTime', _result.c[0] );
      }
    );

    /* fetch burnRate */
    this.attributes.contract.burnRate.call(
      ( _err, _result ) =>
      {
        let burnRate = web3.toBigNumber( _result.c[0] );
        if( ! _err ) this.set( 'burnRate', burnRate );
      }
    );

    /* fetch lastBurn */
    this.attributes.contract.lastBurn.call(
      ( _err, _result ) =>
      {
        if( ! _err ) this.set( 'lastBurn', _result.c[0] );
      }
    );

    /* fetch the current Riche */
    this._seats.fetch();
  },

  buy: function( riche )
  {
    console.log( riche );
    this.attributes.contract.buySeat(
      riche.attributes.avatarUrl,
      riche.attributes.message,
      riche.attributes.messageUrl,
      {
        from: riche.attributes.addresss,
        value: riche.attributes.claim,
        gas: 4E6,
      },
      ( _err, _result ) =>
      {
        if( _err )
        {
          // TODO handle failure
          console.log( _err );
        }
      }
    );
  }

});