'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import PhoneInput from '../ui/phoneInput';
import { sendCodeVerification, sendSMSPhone } from '@/app/utils/phonecodeverify';

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
  phoneNumber,
}) => {
  const router = useRouter();
  const [verification, setVerification] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!isOpen) {
      setVerification(false);
      setPhoneCode('');
      setError(null);
      setResendDisabled(false);
      setTimer(60);
    }
  }, [isOpen]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (resendDisabled) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [resendDisabled]);

  const validatePhoneCode = (phoneCode: string): boolean => {
    if (!phoneCode) {
      setError('Phone code required');
      return false;
    }
    if (!/^\d{6}$/.test(phoneCode)) {
      setError('Invalid phone code');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSendVerificationCode = async () => {
    try {
      setResendDisabled(true)
      let response = await sendSMSPhone({ phoneno: phoneNumber });
      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed.');
      }
      setVerification(true);
      toast({
        title: 'Successful!',
        description: data.message
      });
      return await response.json();
    } catch (error:any) {
      toast({ title: 'Error', description: error.message });
      setResendDisabled(false);
    }
  };

  const handleReSendVerificationCode = async () => {
    try {
      setResendDisabled(true);
      let response = await sendSMSPhone({ phoneno: phoneNumber });
      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed.');
      }
      toast({
        title: 'Successful!',
        description: data.message
      });
      setPhoneCode('');
    } catch (error:any) {
      toast({ title: 'Error', description: error.message });
      setResendDisabled(false);
    }
  };

  const handleVerificationCode = async () => {
    if (!validatePhoneCode(phoneCode)) return;
    try {
      let response = await sendCodeVerification({ phoneno: phoneNumber, phonecode: phoneCode });
       let data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed.');
      }
      toast({ title: 'Successful!', description: 'Phone number verified successfully!' });
      router.push('/sendemail');
    } catch (error:any) {
      toast({ title: 'Error', description: error.message });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='text-center sm:text-xl text-sm mb-6'>Enter code sent to your number</div>
      <div className="flex flex-col gap-2 mb-2">
      <PhoneInput value={phoneNumber} disabled={true} />
        {verification ? (
          <>
            <Input
              placeholder="Code"
              value={phoneCode}
              onChange={(e) => {
                setPhoneCode(e.target.value)
                if (!validatePhoneCode(e.target.value)) return;
              }}
            />
            {error && <div className="text-destructive text-sm">{error}</div>}
          </>
        ) : null}
      </div>
      <div className='flex flex-col gap-2 mt-6'>
        {verification ? (
          <>
            <Button
              className="ml-auto bg-blue-500 w-full"
              type="submit"
              handleClick={handleVerificationCode}
            >
              Verify
            </Button>
            <Button
              disabled={resendDisabled || loading}
              className="ml-auto bg-blue-500 w-full"
              type="submit"
              handleClick={handleReSendVerificationCode}
            >
              Resend
            </Button>
            {resendDisabled && (
              <div className="text-yellow-500 text-sm text-center mt-2">
                Please wait {timer} seconds before resending the code.
              </div>
            )}
          </>
        ) : (
          <Button
            className="ml-auto bg-blue-500 w-full"
            type="submit"
            handleClick={handleSendVerificationCode}
          >
            Send Verification Code
          </Button>
        )}
      </div>
    </Modal>
  );
};
