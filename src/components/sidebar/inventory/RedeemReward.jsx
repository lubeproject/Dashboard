import React from 'react';
import './redeemReward.css';

export default function RedeemReward() {


    const handleRedeem = () => {
        // Handle redeem logic here
        console.log("Reward redeemed!");
      };
const point = 50;
const redeemPoints = 100;

  return (
    <main id='main' className='main'>

    <div className="redeem-container">
      <h3 className="center-text">Gift Redeem</h3>
      <br/>
      <h5 className="center-text">Available Points: {point} Points</h5>
<br/>
      <div className="reward-box">
        <div className="reward-info">
          <h5>Iron Box</h5>
          <h6>Redeem Points: {redeemPoints}</h6>
        </div>
      </div>

      <div className='redeem-button-parent'>
      <button className="redeem-button" onClick={handleRedeem}>
        Redeem
      </button>
      </div>
    </div>
 </main>


  )
}
