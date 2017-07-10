var Router = Backbone.Router.extend(
{
  routes:
  {
    'buy'     :   'showBuyForm',
    ''        :   'showList'
  },


  showList : function()
  {
    /* create the views */
    $('body').append( new views.EtherSeats( { model:etherRiche } ).render().$el );

    /* start the updating */
    etherRiche.fetch();
  },


  showBuyForm : function()
  {
    console.log( "buyer" );
  },



});