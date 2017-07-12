var Router = Backbone.Router.extend(
{
  routes:
  {
    'buy'     :   'showBuyForm',
    ''        :   'showList'
  },


  showList : function()
  {
    $('#activity').empty();

    /* create the views */
    $('#main').html( new views.EtherSeats( { model:etherRiche } ).render().$el );
  },


  showBuyForm : function()
  {
    // TODO inject a Riche model matching web3 default account
    $('#activity').html( new views.Buy().render().$el );
  },


});