import { createContext, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const storedEmailorMobile = localStorage.getItem('access');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('userid, email, mobile, role, qrcode, name, shopname')
        .or(`email.eq.${storedEmailorMobile},mobile.eq.${storedEmailorMobile}`);

      if (error) {
        console.error(error);
      } else if (data.length > 0) {
        setUserData(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };