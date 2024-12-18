export interface IResendCodePayload {
    userEmail: string;
    code: number;
  }
  
  export const sendCodeToEmail = async ({
    userEmail,
    code
  }: IResendCodePayload) => {
    const response = await fetch('/api/emailcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: userEmail, code })
    });
  
    return response;
  };
  