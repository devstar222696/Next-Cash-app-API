export interface IResendCodePayload {
  userEmail: string;
  code: number;
}

export const sendCodeToDb = async ({ userEmail, code }: IResendCodePayload) => {
  const response = await fetch('/api/emailcode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: userEmail, code })
  });

  return response;
};

export const sendCodeToEmail = async ({
  userEmail,
  code
}: IResendCodePayload) => {
  const response = await fetch('/api/sendemail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: userEmail, code })
  });

  return response;
};
