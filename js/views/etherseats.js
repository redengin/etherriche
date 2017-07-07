views.EtherSeats = Backbone.View.extend(
{
  tagName: "ol",

  constructor: function( options )
  {
    this.views = [];

    Backbone.View.apply( this, arguments );
    this.listenTo( this.model._seats, 'add', this.add );
    this.listenTo( this.model._seats, 'remove', this.remove );
    this.listenTo( this.model._seats, 'update', this.render );
  },

  add: function ( model, collection, options )
  {
    this.views[model.id] = new views.EtherSeat( { model:model } );
    this.render();
  },

  remove: function ( model, collection, options )
  {
    delete this.views[model.id];
    this.render();
  },

  render: function()
  {
    this.$el.empty();
    this.views.forEach( function( view )
    {
      this.$el.append( view.render().$el );
    }, this );
  }

});

