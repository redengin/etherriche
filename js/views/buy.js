views.Buy = Backbone.View.extend(
{
  tagName: 'button',

  events: {
    'click'   :   'gotoBuyForm'
  },


  render: function()
  {
    this.$el.html( 'BUY' );
    return this;
  }

});
