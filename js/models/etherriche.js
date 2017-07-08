models.EtherRiche = Backbone.Model.extend(
{
  seatCount: 5,

  defaults:
  {
    burnTime:     undefined,  /* seconds until claim is fully burned */
    burnRate:     undefined,  /* wei burned per second */
    lastBurn:     undefined,  /* timestamp (in seconds) of last burn */
  },

  constructor: function()
  {
    Backbone.Model.apply( this, arguments );
    this._seats = new collections.Seats();
  },

  fetch: function( options )
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
        if( ! _err ) this.set( 'burnRate', _result.c[0] );
      }
    );

    /* fetch lastUpdate */
    this.attributes.contract.lastBurn.call(
      ( _err, _result ) =>
      {
        if( ! _err ) this.set( 'lastBurn', _result.c[0] );
      }
    );

    /* fetch the current Riche */
    this._seats.reset( { silent:true } );
    for( var i=0; ( this.seatCount > i ); ++i )
    {
      let _i = i;
      /* fetch current claim */
      this.attributes.contract.getSeatClaim.call( i,
        ( _err, _result ) =>
        {
          if( ! _err )
          {
            var riche = new models.Riche( { id:_i, contract:this.attributes.contract, claimValue:_result.c[0] } );
            this._seats.add( riche );
            riche.fetch();
          }
        }
      );
    }
  },

});