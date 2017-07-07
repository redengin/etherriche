views.EtherSeat = Backbone.View.extend(
{
  tagName: "li",

  template: _.template(
        '<img src="<%=avatarUrl%>" />' +
        '<span> <%=message%> </span>' +
        '<span class="claimValue"> <%=claimValue%> </span>'
  ),


  constructor: function()
  {
    Backbone.View.apply( this, arguments );

    this.listenTo( this.model, 'change', this.render );
  },


  render: function()
  {
    console.log( this.model.attributes );
    this.$el.html( this.template( this.model.attributes ) );
    return this;
  }

});

