interface IResendCodePayload {
    phoneno: string,
}

interface IVerifyCodePayload {
    phoneno: string,
    phonecode: string
}

export const sendCodeVerification = async ({
    phoneno,
    phonecode
  }: IVerifyCodePayload) => {
    const response = await fetch('/api/phonecodeverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneno, phonecode })
    });
    return response;
  };
  
  export const sendSMSPhone = async ({
    phoneno,
  }: IResendCodePayload) => {
    const response = await fetch('/api/sendsms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneno })
    });
  
    return response;
  };
  