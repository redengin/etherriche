var EtherSeats = Backbone.View.extend(
{
  tagName: "div",

  render: function()
  {
    var template = _.template(
        '<div>' +
        '<img src=<%= avatarUrl %> />' +
        '<%= message %>' +
        'VALUE: <%= claimValue %>' +
        '</div>'
    );

    _.each( this.model.attributes.seats, ( seat ) =>
    {
      this.$el.append( template( seat ) );
    }, this );

    return this;
  }

});
      $('body').append( 'HELLo');
