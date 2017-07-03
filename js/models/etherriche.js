var EtherRiche = Backbone.Model.extend(
{
  defaults:
  {
    burnRate:     undefined,  /* wei burned per second */
    lastUpdate:   undefined,  /* timestamp (in seconds) of last burn */
    seats:        undefined   /* collection of the current seats */
  },

  fetch: ( options ) =>
  {
    // TODO get the latest state via web3
  },

});