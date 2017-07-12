views.Buy = Backbone.View.extend(
{
  tagName: 'form',
  id: 'buyForm',

  template: _.template(
    '<img src="<%-avatarUrl%>"/>' +
    '<label>Avatar Url</label><input type="text" value="<%-avatarUrl%>"/>' +
    '<label>Message</label><textarea><%-message%></textarea>' +
    '<label>Url</label><input type="text" value="<%-messageUrl%>"/>' +
    '<label>Amount</label><input data-id="claim" type="number" value="<%-claim%>"/>wei' +
    '<label>Account</label><span><%-address%></span>' +
    '<input type="submit" value="Buy"/>'
  ),

  events: {
    'submit'   :   'submit',
  },

  constructor: function()
  {
    Backbone.View.apply( this, arguments );
    if( ! this.model ) this.model = new models.Riche( {address:web3.eth.defaultAccount});
  },


  render: function()
  {
    this.$el.html( this.template( this.model.attributes ) );
    return this;
  },

  submit: function()
  {
    this._bindModel();

    etherRiche.buy( this.model );
    return false;
  },

  _bindModel: function()
  {
    this.model.attributes.claim = this.$el.find('[data-id="claim"]').val();
  }

});
