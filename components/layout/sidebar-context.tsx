import useSocket from '@/lib/socket';
import { createContext, useContext, useEffect, useState } from 'react';

// Create contexts with generics
export const SidebarContext = createContext<{
  counts: {
    register: number;
    redeem: number;
    withdrawal: number;
  };
}>({
  counts: {
    register: 0,
    redeem: 0,
    withdrawal: 0
  },
});

// Provider component
export const SidebarProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [countsLoaded, setCountsLoaded] = useState<boolean>(false);
  const [registerCount, setRegisterCount] = useState(0);
  const [redeemCount, setDepositCount] = useState(0);
  const [withdrawalCount, setWithdrawalCount] = useState(0);

  const { socket } = useSocket();

  const updateRegisterCount = (data: any) => {
    console.log('new register', data);
    setRegisterCount((count) => count + 1);
  };

  const updateDepositCount = (data: any) => {
    console.log('new deposit', data);
    setDepositCount((count) => count + 1);
  };

  const updateWithdrawalCount = (data: any) => {
    console.log('new withdrawal', data);
    setWithdrawalCount((count) => count + 1);
  };

  useEffect(() => {
    if (!socket) return;
    if (typeof window === 'undefined') return;
    console.log('socket', socket);
    socket?.on('newRegister', updateRegisterCount);

    socket?.on('newDeposit', updateDepositCount);
  
    socket?.on('newWithdrawal', updateWithdrawalCount);

    return () => {
      console.log('unsubscribing');
      socket?.off('newRegister', updateRegisterCount);
      socket?.off('newDeposit', updateDepositCount);
      socket?.off('newWithdrawal', updateWithdrawalCount);
    };
  }, [socket])



  useEffect(() => {
    const loadCounts = async () => {
        try {
          if (!countsLoaded) {
            const countsResponse = await fetch('/api/admin/get-real-time-counts', {
              cache: 'no-store'
            }); // Your API for withdrawals
            const result = await countsResponse.json();
            const countsResult = result.data as {
              register: number;
              redeem: number;
              withdrawal: number;
            };
            setRegisterCount(countsResult.register);
            setDepositCount(countsResult.redeem);
            setWithdrawalCount(countsResult.withdrawal);
            console.log('countsResult', countsResult);
          }
        } catch (error) {
          console.log('Error fetching counts', error);
        } finally {
          setCountsLoaded(true);
        }
      };

    if (typeof window === 'undefined') return;
    loadCounts();
  }, [countsLoaded])

  return (
    <SidebarContext.Provider
      value={{
        counts: {
          register: registerCount,
          redeem: redeemCount,
          withdrawal: withdrawalCount
        },
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarCounts = () => {
    const context = useContext(SidebarContext);
    if (!context) {
      throw new Error("useSidebarCounts must be used within a SidebarProvider");
    }
    return context.counts;
};
