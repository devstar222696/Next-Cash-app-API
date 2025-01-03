import { useEffect, useState } from 'react';
import { AdminRegisterUsers } from '@/constants/data';

export default function useUser() {
  const [user, setUser] = useState<AdminRegisterUsers | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {      
      try {
        const userInfoStr = localStorage.getItem('userinfo');
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
        if (userInfo) {
            setUser(userInfo);
        }
      } catch (error) {}
    }
  }, []);

  return user;
}
