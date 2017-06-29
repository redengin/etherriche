/* Ether Riche
 * Copyright (c) 2017 Stephen Holstein.  Released under GPLv3.
 */
pragma solidity ^0.4.10;

contract EtherRiche
{
  /* The continuous burn rate for claim_wei per second */
  uint      public    burnRate;
  /* The last time the burnRate was recalculated */
  uint      public    lastUpdate;

  /* A public list of the seats */
  address   public    seat0_address;
  string    public    seat0_avatarUrl;
  string    public    seat0_message;
  uint      public    seat0_claim_wei;

  address   public    seat1_address;
  string    public    seat1_avatarUrl;
  string    public    seat1_message;
  uint      public    seat1_claim_wei;

  address   public    seat2_address;
  string    public    seat2_avatarUrl;
  string    public    seat2_message;
  uint      public    seat2_claim_wei;

  address   public    seat3_address;
  string    public    seat3_avatarUrl;
  string    public    seat3_message;
  uint      public    seat3_claim_wei;

  address   public    seat4_address;
  string    public    seat4_avatarUrl;
  string    public    seat4_message;
  uint      public    seat4_claim_wei;


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
  // TODO translate to checksum 
  address   constant  _bank = 0x8bb00852623184d534d9805c66ed85b1d8ec0f52; 

  /* the internal store of seats */
  Seat[5]     _seats;

  function buySeat( string _avatarUrl, string _message ) payable
  {
    /* update the current seat claims */
    _updateClaims( _avatarUrl, _message );

    /* update the public data */
    _updatePublicData();

    /* take the money */
    _bank.transfer( msg.value );
  }


  function _presentValue( uint _value )
      private constant returns (uint)
  {
    return ( _value - ( burnRate * ( now - lastUpdate ) ) );
  }


  function _updateClaims( string _avatarUrl, string _message ) private
  {
    var lowestClaimIndex = 0;
    var isTopUp = false;

    for( uint i=0; _seats.length > i; ++i )
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
        if( _seats[lowestClaimIndex].claim_wei < _seats[i].claim_wei )
        {
          /* found a new lowest claim */
          lowestClaimIndex = uint8(i);
        }
      }
    }

    if( false == isTopUp )
    {
      /* see if the sender has a claim */
      if( _seats[lowestClaimIndex].claim_wei < msg.value )
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
        // TODO event
        throw;
      }
    }
  }


  function _updatePublicData() private
  {
    uint maxClaimIndex = 0;

    seat0_address    = _seats[0].riche.addr;
    seat0_avatarUrl  = _seats[0].riche.avatarUrl;
    seat0_message    = _seats[0].riche.message;
    seat0_claim_wei  = _seats[0].claim_wei;
    if( _seats[maxClaimIndex].claim_wei < _seats[0].claim_wei )
    {
      maxClaimIndex = 0;
    }

    seat1_address    = _seats[1].riche.addr;
    seat1_avatarUrl  = _seats[1].riche.avatarUrl;
    seat1_message    = _seats[1].riche.message;
    seat1_claim_wei  = _seats[1].claim_wei;
    if( _seats[maxClaimIndex].claim_wei < _seats[1].claim_wei )
    {
      maxClaimIndex = 1;
    }

    seat2_address    = _seats[2].riche.addr;
    seat2_avatarUrl  = _seats[2].riche.avatarUrl;
    seat2_message    = _seats[2].riche.message;
    seat2_claim_wei  = _seats[2].claim_wei;
    if( _seats[maxClaimIndex].claim_wei < _seats[2].claim_wei )
    {
      maxClaimIndex = 2;
    }

    seat3_address    = _seats[3].riche.addr;
    seat3_avatarUrl  = _seats[3].riche.avatarUrl;
    seat3_message    = _seats[3].riche.message;
    seat3_claim_wei  = _seats[3].claim_wei;
    if( _seats[maxClaimIndex].claim_wei < _seats[3].claim_wei )
    {
      maxClaimIndex = 3;
    }

    seat4_address    = _seats[4].riche.addr;
    seat4_avatarUrl  = _seats[4].riche.avatarUrl;
    seat4_message    = _seats[4].riche.message;
    seat4_claim_wei  = _seats[4].claim_wei;
    if( _seats[maxClaimIndex].claim_wei < _seats[4].claim_wei )
    {
      maxClaimIndex = 4;
    }

    _updateBurnRate( maxClaimIndex );
  }


  function _updateBurnRate( uint _maxClaimIndex ) private
  {
    /* burn the max claim over the next 30 days */
    burnRate = ( _seats[_maxClaimIndex].claim_wei / ( 30 days ) );
    lastUpdate = now;
  }

}
