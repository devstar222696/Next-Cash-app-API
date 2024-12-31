'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  phoneNumber: string;
}


export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  loading,
  phoneNumber
}) => {
  const router = useRouter()
  const [verification, setVerification]= useState(false)
  const [phoneCode, setPhoneCode] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setVerification(false);
    }
  }, [isOpen]);


  const sendVerificationCode = async () => {
    try {
      const response = await fetch('api/sendsms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneno: phoneNumber })
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error || 'Signup failed' };
      }
      setVerification(true)
      toast({
        title: 'Successful!',
        description: 'Welcome! Your request has been success.'
      });

      return await response.json();
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: 'Sorry! Your SignUp has been failed. Please try again'
      });
      throw error;
    }
  };

  const reSendVerificationCode = async () => {
    try {
      const response = await fetch('api/sendsms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneno: phoneNumber })
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Verification failed' };
      }
      toast({
        title: 'Successful!',
        description: 'Verification sms sent successfully!'
      });
      setPhoneCode('')
      return await response.json();
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Sorry! Your Verification has been failed. Please try again'
      });
      throw error;
    }
  };

  const handleVerificationCode = async () => {
    const verificationData = {
      phoneno: phoneNumber,
      phonecode:phoneCode
    }
    if (!phoneCode) {
      toast({
        title: 'Warning!',
        description: 'Otp is required!'
      });
      return
    }
    try {
      const response = await fetch('api/phonecodeverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(verificationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Verification failed' };
      }
      setVerification(true)
      router.push('/sendemail');
      toast({
        title: 'Successful!',
        description: 'Verification sms sent successfully!'
      });

      return await response.json();
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Sorry! Your Verification has been failed. Please try again'
      });
      throw error;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
        <div className='text-center sm:text-xl text-sm mb-6'>Enter code sent to your number</div>
      <div className="flex flex-col gap-2 mb-2">
        <input
        value={phoneNumber}
        disabled
        placeholder='Phone number'
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
        />
        {verification ?     <input
        placeholder='Code'
        value={phoneCode}
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
          onChange={(e) => setPhoneCode(e.target.value)}
        />: null}
      </div>
     <div className='flex flex-col gap-2 mt-6'>
          {verification ?<> <Button className="ml-auto bg-blue-500 w-full" type="submit" handleClick={handleVerificationCode}>
           Verify
          </Button>
          <Button disabled={true} className="ml-auto bg-blue-500 w-full" type="submit" handleClick={reSendVerificationCode}>
           Resend
          </Button></>: <Button  className="ml-auto bg-blue-500 w-full" type="submit" handleClick={sendVerificationCode}>
            Send Verification Code
          </Button>}
          </div>
    </Modal>
  );
};
