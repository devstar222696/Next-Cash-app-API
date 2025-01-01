'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
  phoneNumber?: string;
  title?: string;
}
  
const errorMap = [
  'Invalid number',
  'Invalid country code',
  'Too short',
  'Too long',
  'Invalid number'
];

export const VerificationModal: React.FC<VerificationModalProps> = ({
  title = 'login',
  isOpen,
  onClose,
  phoneNumber,
}) => {
  const router = useRouter();
  const [verification, setVerification] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [notice, setNotice] = useState<string>('');
  const [number, setNumber] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setVerification(false);
      setPhoneCode('');
      setError(null);
      setResendDisabled(false);
      setTimer(60);
      setApiLoading(false);
    }
  }, [isOpen]);

  const handleSendVerificationCode = useCallback(async () => {
    if (!isValid)  {
      const errorMessage = errorMap[errorCode || 0] || 'Invalid number';
      console.log('setNotice', errorMessage);
      
      setNotice(`${errorMessage}`);
      return false;
    }
    try {
      setApiLoading(true);
      setResendDisabled(true)
      let response = await sendSMSPhone({ phoneno: number });
      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Verification failed.');
      }
      setVerification(true);
      toast({
        title: 'Successful!',
        description: data.message
      });
    } catch (error:any) {
      toast({ title: 'Error', description: error.message });
      setResendDisabled(false);
    } finally {
      setApiLoading(false);
    }
  }, [isValid, errorCode, number]);

  useEffect(() => {
    if (phoneNumber && isOpen) {
      setNumber(phoneNumber);
      handleSendVerificationCode()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber, isOpen, handleSendVerificationCode]);

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


  const handleReSendVerificationCode = async () => {
    try {
      if (!isValid)  {
        const errorMessage = errorMap[errorCode || 0] || 'Invalid number';
        setNotice(`${errorMessage}`);
        return false;
      }
      setApiLoading(true);
      setResendDisabled(true);
      let response = await sendSMSPhone({ phoneno: number });
      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Verification failed.');
      }
      toast({
        title: 'Successful!',
        description: data.message
      });
      setPhoneCode('');
    } catch (error:any) {
      toast({ title: 'Error', description: error.message });
      setResendDisabled(false);
    } finally {
      setApiLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validatePhoneCode(phoneCode)) return;
    try {
      setApiLoading(true);
      let response = await sendCodeVerification({ phoneno: number, phonecode: phoneCode });
       let data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Verification failed.');
      }
      toast({ title: 'Successful!', description: 'Phone number verified successfully!' });
      if(title == 'signup'){
        router.push('/sendemail');
      }else{
        router.push('/');
      }
      onClose()
    } catch (error:any) {
      toast({ title: 'Error', description: error.message });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='text-center sm:text-xl text-sm mb-6'>Enter code sent to your number</div>
      <div className="flex flex-col gap-4 mb-2">
      <PhoneInput
              value={number}
              disabled={title == 'signup'}
              onChangeNumber={setNumber}
              onChangeValidity={setIsValid}
              onChangeErrorCode={setErrorCode}
            />
              <div className="w-full">
            {notice && !isValid && <div className="text-destructive">{notice}</div>}
          </div>
        {verification ? (
          <div className='mb-2'>
            <Input
              placeholder="Code"
              value={phoneCode}
              onChange={(e) => {
                setPhoneCode(e.target.value)
                if (!validatePhoneCode(e.target.value)) return;
              }}
            />
            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
        ) : null}
      </div>
      <div className='flex flex-col gap-2 mt-6'>
        {verification ? (
          <>
            <Button
              className="ml-auto bg-blue-500 w-full"
              type="submit"
              disabled={apiLoading}
              handleClick={handleVerifyCode}
            >
              Verify
            </Button>
            <Button
              disabled={resendDisabled || apiLoading}
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
            disabled={apiLoading}
            handleClick={handleSendVerificationCode}
          >
            Send Verification Code
          </Button>
        )}
      </div>
    </Modal>
  );
};
