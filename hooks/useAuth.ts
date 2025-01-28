import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminRoles } from '@/constants/roles';

const useAuth = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const userInfoStr = localStorage.getItem('userinfo');
    if (userInfoStr) {
      const user = JSON.parse(userInfoStr);
      if (AdminRoles.includes(user.role)) {
        router.push('/main');
      } else {
        router.push('/mypage');
      }
    }

    setIsChecking(false);
  }, []);

  return {
    isChecking
  };
};

export default useAuth;
