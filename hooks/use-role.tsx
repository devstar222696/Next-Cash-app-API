import { useEffect, useState } from 'react';
import { Roles } from '@/constants/roles';

export default function useRole() {
  const [role, setRole] = useState<Roles>(Roles.user);

  useEffect(() => {
    if (typeof window !== 'undefined') {      
      try {
        const userInfoStr = localStorage.getItem('userinfo');
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
        if (userInfo.role) {
          setRole(userInfo.role);
        }
      } catch (error) {}
    }
  }, []);

  return { role };
}
