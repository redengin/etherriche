var EtherSeats = Backbone.View.extend(
{
  tagName: "ol",

  render: function()
  {
    var template = _.template(
        '<li>' +
        '<img src=<%= avatarUrl %> />' +
        '<%= message %>' +
        'VALUE: <%= claimValue %>' +
        '</li>'
    );

    _.each( this.model.attributes.seats, ( seat ) =>
    {
      this.$el.append( template( seat ) );
    }, this );

    return this;
  }

});
      $('body').append( 'HELLo');
