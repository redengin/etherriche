collections.Seats = Backbone.Collection.extend(
{
  model: models.Riche,

  comparator: function( a, b )
  {
    /* sort from highest to lowest */
    return b.claimValue - a.claimValue;
  },

  fetch: function()
  {
    this.each( (_model) => { _model.fetch() } );
  }

});