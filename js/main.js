

$(document).ready( () =>
{
  var etherRiche = new EtherRiche();

  // FIXME for test use only
  etherRiche = new EtherRiche(
    {
      burnRate: 1, lastUpdate: new Date(),
      seats:
      [
        { avatarUrl:'http://vignette2.wikia.nocookie.net/pvx/images/b/b5/Misery_Cow.png/revision/latest?cb=20090217232925', message: 'hello', claimValue: '1' }
      ]
    }
  );

  new EtherSeats( { el:'#etherSeats', model:etherRiche } ).render();

}
);