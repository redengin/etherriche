views.EtherSeats = Backbone.View.extend(
{
  tagName: 'ol',
  className: 'richeList',

  template: _.template(
        '<li>' +
        '<img src="<%-avatarUrl%>" />' +
        '<span> <%-message%> </span>' +
        '<a href="<%-messageUrl%>"> link </a>' +
        '<span class="presentValue"> <%=presentValue%> </span>' +
        '</li>'
  ),

  constructor: function( options )
  {
    this.views = [];

    Backbone.View.apply( this, arguments );
    this.listenTo( this.model._seats, 'all', this.render );

    // TODO fetch on an interval
    this.model.fetch();
  },

  render: function()
  {
    this.$el.empty();

    this.model._seats.each( function(riche)
    {
      let presentValue = this.model.presentValue( riche.attributes.claim );
      if( presentValue > 0 )
      {
        let attributes = _.extend(
          {
              presentValue:weiToString( presentValue ),
          },
          riche.attributes
        );
        this.$el.append( this.template( attributes ) );
      }
    }, this );

    return this;
  }

});

