// import React from 'react';
// import './redeemReward.css';

// export default function RedeemReward() {


//     const handleRedeem = () => {
//         // Handle redeem logic here
//         console.log("Reward redeemed!");
//       };
// const point = 50;
// const redeemPoints = 100;

//   return (
//     <main id='main' className='main'>

//     <div className="redeem-container">
//       <h3 className="center-text">Gift Redeem</h3>
//       <br/>
//       <h5 className="center-text">Available Points: {point} Points</h5>
// <br/>
//       <div className="reward-box">
//         <div className="reward-info">
//           <h5>Iron Box</h5>
//           <h6>Redeem Points: {redeemPoints}</h6>
//         </div>
//       </div>

//       <div className='redeem-button-parent'>
//       <button className="redeem-button" onClick={handleRedeem}>
//         Redeem
//       </button>
//       </div>
//     </div>
//  </main>


//   )
// }
import React, { useEffect, useState, useContext} from "react";
import './redeemReward.css';
import { supabase } from '../../../supabaseClient';
import { UserContext } from "../../context/UserContext";

export default function RedeemReward() {
  const [giftItems, setGiftItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(50);
  const {user} = useContext(UserContext);

  useEffect(() => {
    const fetchGiftItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('giftitem_master')
        .select('*')
        .eq('activestatus', 'Y'); // Fetch only active gift items

      if (error) {
        console.error('Error fetching gift items:', error.message);
      } else {
        setGiftItems(data); // Set the fetched gift items to state
      }
      setLoading(false);
    };

    fetchGiftItems();
  }, []);

    const handleRedeem = () => {
        console.log("Reward redeemed!");
    };

  return (
    <main id='main' className='main'>

    <div className="redeem-container">
      <h3 className="center-text">Gift Redeem</h3>
      <br/>
      <h5 className="center-text">Available Points: {userPoints} Points</h5>
<br/>
<div className="d-flex w-100 gap-5 flex-wrap">
{loading ? (
          <p>Loading gift items...</p>
        ) : (
         
          giftItems.map((item) => (
           
            <div key={item.id} className="reward-box">
              <div className="reward-info">
                <h5>{item.itemname}</h5> {/* Assuming `giftname` column in the table */}
                <h6>Redeem Points: {item.redeempoints}</h6> {/* Fetching redeempoints */}
              </div>
              <div className="redeem-button-parent">
                <button
                  className="redeem-button"
                  onClick={() => handleRedeem(item.giftname)}
                  disabled={userPoints < item.redeempoints} // Disable if user points are insufficient
                >
                  {userPoints >= item.redeempoints ? 'Redeem' : 'Not Enough Points'}
                </button>
              </div>
            </div>
           
          ))
         
        )}
        </div>
      </div>
    </main>
  );
}