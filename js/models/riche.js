models.Riche = Backbone.Model.extend(
{
  defaults:
  {
    claim:      undefined,
    avatarUrl:  undefined,
    message:    undefined,
  },

  fetch: function( options )
  {
    /* fetch claim */
    this.attributes.contract.getSeatClaim.call( this.id,
      ( _err, _result ) =>
      {
        if( ! _err )
        {
          let claim = web3.toBigNumber( _result );
          this.set( 'claim', claim );
        }
      }
    );

    /* fetch avatarUrl */
    this.attributes.contract.getSeatAvatarUrl.call( this.id,
      ( _err, _result ) =>
      {
        if( ! _err )
        {
          this.set( 'avatarUrl', _result );
        }
      }
    );

    /* fetch message */
    this.attributes.contract.getSeatMessage.call( this.id,
      ( _err, _result ) =>
      {
        if( ! _err ) this.set( 'message', _result );
      }
    );
  }

});