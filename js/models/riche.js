models.Riche = Backbone.Model.extend(
{
  defaults:
  {
    address:      undefined,
    claim:        0,
    avatarUrl:    '',
    message:      '',
    messageUrl:   '',
  },

  fetch: function( options )
  {
    /* fetch address */
    this.attributes.contract.getSeatAddress.call( this.id,
      ( _err, _result ) =>
      {
        if( ! _err )
        {
          this.set( 'address', _result );
        }
      }
    );

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

    /* fetch messageUrl */
    this.attributes.contract.getSeatMessageUrl.call( this.id,
      ( _err, _result ) =>
      {
        if( ! _err ) this.set( 'messageUrl', _result );
      }
    );
  }

});