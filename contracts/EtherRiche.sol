/* Ether Riche
 * Copyright (c) 2017 Stephen Holstein.  Released under GPLv3.
 */
pragma solidity ^0.4.10;

contract EtherRiche
{
  /* The continuous burn rate for claim_wei per second */
  uint constant public burnTime = 30 days;
  uint      public    burnRate = 0;
  /* The last time the burnRate was recalculated */
  uint      public    lastUpdate = now;

  /* The information about the user */
  struct Riche
  {
    address   addr;
    string    avatarUrl;
    string    message;
  }

  /* A seat in the contract */
  struct Seat
  {
    Riche     riche;
    uint      claim_wei;
  }

  /* where we stash all the contributions */
  address   constant  _bank = 0x8bb00852623184d534D9805c66ed85B1D8EC0f52;

  /* the internal store of seats */
  Seat[5]     _seats;


  function buySeat( string _avatarUrl, string _message ) payable
      returns( uint )
  {
    /* no money, no play */
    assert( msg.value > 0 );

    /* update the current seat claims */
    _updateClaims( _avatarUrl, _message );

    /* update the burn rate */
    _updateBurnRate();

    /* take the money */
    _bank.transfer( msg.value );
  }


  function getSeatClaim( uint _index )
    constant returns ( uint )
  {
    return _seats[_index].claim_wei;
  }

  function getSeatClaimAvatarUrl( uint _index )
    constant returns ( string )
  {
    return _seats[_index].riche.avatarUrl;
  }

  function getSeatClaimMessage( uint _index )
    constant returns ( string )
  {
    return _seats[_index].riche.message;
  }


  function _presentValue( uint _value )
      private constant returns ( uint )
  {
    if( now == lastUpdate )
    {
      /* updating within the same block, no burn */
      return _value;
    }

    assert( now > lastUpdate );
    var burned = ( burnRate * ( now - lastUpdate ) );

    /* soldity does not throw on underflow */
    if( burned >= _value )
    {
      return 0;
    }
    else
    {
      return ( _value - burned );
    }
  }


  function _updateClaims( string _avatarUrl, string _message ) private
  {
    var lowestClaimIndex = 0;
    var isTopUp = false;
    for( var i=0; _seats.length > i; ++i )
    {
      _seats[i].claim_wei = _presentValue( _seats[i].claim_wei );

      if( ( false == isTopUp ) && ( msg.sender == _seats[i].riche.addr ) )
      {
        /* topup the seated riche */
        _seats[i].claim_wei += msg.value;
        isTopUp = true;
      }
      else
      {
        if( _seats[i].claim_wei < _seats[lowestClaimIndex].claim_wei )
        {
          /* found a new lowest claim */
          lowestClaimIndex = i;
        }
      }
    }

    if( false == isTopUp )
    {
      /* see if the sender has a claim */
      if( msg.value >= _seats[lowestClaimIndex].claim_wei )
      {
        /* put the contributor into the seat */
        _seats[lowestClaimIndex].claim_wei = msg.value;
        _seats[lowestClaimIndex].riche.addr = msg.sender;
        _seats[lowestClaimIndex].riche.avatarUrl = _avatarUrl;
        _seats[lowestClaimIndex].riche.message = _message;
      }
      else
      {
        /* no seat available */
        revert();
      }
    }
  }


  function _updateBurnRate() private
  {
    var maxClaim = msg.value;
    for( var i=1; _seats.length > i; ++i )
    {
      if( _seats[i].claim_wei > maxClaim )
      {
        maxClaim = _seats[i].claim_wei;
      }
    }

    /* burn the max claim over the next 30 days */
    burnRate = ( maxClaim / burnTime );
  }

}
