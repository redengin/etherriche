models.Riche = Backbone.Model.extend(
{
  defaults:
  {
    avatarUrl:  undefined,
    message:    undefined,
    claimValue: undefined,
  },

  fetch: function( options )
  {
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