function weiToString( wei )
{
  return  _format( wei, 1E18, 'ether' )     ||
          _format( wei, 1E15, 'finney' )    ||
          _format( wei, 1E12, 'szabo' )     ||
          _format( wei, 1E9,  'shannon' )   ||
          _format( wei, 1E6,  'lovelace' )  ||
          _format( wei, 1E3,  'babbage' )   ||
          _format( wei, 1,    'wei' );

  function _format( wei, base, suffix )
  {
    if( wei.greaterThan( base ) )
    {
      return ( wei.dividedToIntegerBy( base ) + ' ' + suffix );
    }
  };
}