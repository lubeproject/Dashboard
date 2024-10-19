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
  const [userPoints, setUserPoints] = useState(0);
  const {user} = useContext(UserContext);

  useEffect(() => {
    const fetchUserPoints = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('active', 'Y')
        .eq('enablecheck','Y')
        .eq('userid',user.userid);
    
        if (error) {
          console.error('Error fetching gift items:', error.message);
        } else {
          // console.log(data[0]);
          
          setUserPoints(data[0].rewardpoints);
        }
        
    }
    const fetchGiftItems = async () => {
      const { data, error } = await supabase
        .from('giftitem_master')
        .select('*')
        .eq('activestatus', 'Y')
        .order('itemid',{ascending:true})
        .in('role',[user.role,'Both']);

      if (error) {
        console.error('Error fetching gift items:', error.message);
      } else {
        setGiftItems(data); // Set the fetched gift items to state
      }
    };

    setLoading(true);
    fetchGiftItems();
    fetchUserPoints();
    setLoading(false);
  }, [user]);

    // const handleRedeem = () => {
    //     console.log("Reward redeemed!");
    // };

    const redeemGift = async (item) => {
      try {
        // Insert into the giftitem_redeem table
        const { error: insertError } = await supabase
          .from('giftitem_redeem')
          .insert([
            {
              userid: user.userid,
              name: user?.name,
              shopname: user?.shopname,
              itemid: item.itemid,
              redeempoints: item.redeempoints,
              itemname: item.itemname,
              redeemapproval: 'N',
              created: new Date().toISOString(),
              lastupdatetime: new Date().toISOString(),
              quantity: 1,
              createdby: user?.userid,
              updatedby: user?.userid
            },
          ]);
  
        if (insertError) {
          console.error('Error inserting into giftitem_redeem:', insertError.message);
          alert('Failed to redeem gift. Please try again.');
          return;
        }
  
        // Update the user's points
        const { error: updateError } = await supabase
          .from('users')
          .update({
            rewardpoints: userPoints - item.redeempoints,
          })
          .eq('userid', user.userid);
  
        if (updateError) {
          console.error('Error updating user points:', updateError.message);
          alert('Failed to update user points. Please try again.');
          return;
        }
  
        console.log('Gift redeemed successfully!');
        alert('Gift redeemed successfully!');
        setUserPoints(userPoints - item.redeempoints);
      } catch (error) {
        console.error('Transaction failed:', error.message);
        alert('Transaction failed. Please try again.');
      }
    };
  
    const handleRedeem = (giftname) => {
      console.log("Attempting to redeem gift:", giftname);
      
      // Find the gift item that the user is trying to redeem
      const item = giftItems.find(item => item.itemname === giftname);
    
      if (item) {
        // Check if the user has enough points
        if (userPoints >= item.redeempoints) {
          redeemGift(item);
        } else {
          console.log("Not enough points to redeem this gift.");
          alert("Not enough points to redeem this gift.");
        }
      } else {
        console.log(`Gift item not found: ${giftname}. Available items:`, giftItems);
        alert(`Gift item "${giftname}" not found. Please refresh the page and try again.`);
      }
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
                  onClick={() => handleRedeem(item.itemname)}
                  disabled={userPoints < item.redeempoints}
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
