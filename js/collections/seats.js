collections.Seats = Backbone.Collection.extend(
{
  model: models.Riche,

  comparator: function( a, b )
  {
    /* sort from highest to lowest */
    return b.claim - a.claim;
  },

  fetch: function()
  {
    this.each( (_model) => { _model.fetch() } );
  }

});