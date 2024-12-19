'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '../ui/use-toast';
import { useSearchParams } from 'next/navigation';
import { AdminRegisterUsers } from '@/constants/data';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  loginid: string;
  passwordcode: string;
  category: string;
  id: string;
  phonenumber: string;
}

export const RegisterModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<AdminRegisterUsers[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [loginId, setLoginId] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [passwordCode, setPasswordCode] = useState('');
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const phoneNumber = data[0]?.register &&
    data[0]?.register?.length > 0 &&
    data[0]?.register[0]?.phonenumber
    ? data[0]?.register[0]?.phonenumber
    : 'None'

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch('/api/admin/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${id}`
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          setData(result.data || []);
        } else {
          console.error('No data found in the result:', result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (!isMounted) {
    return null;
  }

  const userData: UserData = {
    loginid: loginId,
    passwordcode: passwordCode,
    category: selectedOption,
    id: id ? id : '',
    phonenumber: phoneNumber
  };

  const onSubmit = async (userData: UserData) => {
    if (loginId === '' || passwordCode === '') {
      toast({
        title: 'All field do not full!',
        description: 'Please try, again!'
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/registeruser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Code sending failed' };
      }

      toast({
        title: 'Modify Successful!',
        description: 'Welcome! User info has been modified.'
      });

      location.reload();

      return await response.json();
    } catch (error) {
      toast({
        title: 'Modify Failed!',
        description: 'User info modify has failed. Please try again.'
      });
      throw error;
    }
  };

  const onConfirm = async () => {
    const response = await onSubmit(userData);

    if (response && response.error) {
    } else { }
  };

  return (
    <Modal
      title="User Detail Info Add"
      description="You can add user datail info in here."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col">
        <label className="text-sm font-medium">Category</label>
        <select
          id="FireKirin"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
        >
          <option value="FireKirin">FireKirin</option>
          <option value="MilkyWay">MilkyWay</option>
          <option value="OrionStars">OrionStars</option>
          <option value="Juwa">Juwa</option>
          <option value="GameVault">GameVault</option>
          <option value="VegasSweep">VegasSweep</option>
          <option value="YOLO">YOLO</option>
          <option value="UltraPanda">UltraPanda</option>
          <option value="VBlink">VBlink</option>
        </select>
        <label className="mt-3 text-sm font-medium">Login ID</label>
        <input
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
          onChange={(e) => setLoginId(e.target.value)}
        />
        <label className="mt-3 text-sm font-medium">Password Code</label>
        <input
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
          onChange={(e) => setPasswordCode(e.target.value)}
        />
      </div>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" handleClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          handleClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
