'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import GoogleSignUpButton from './google-auth-button';
import { useState, useTransition } from 'react';
import { VerificationModal } from '@/components/modal/verification-modal';
import 'intl-tel-input/build/css/intlTelInput.css';
import IntlTelInput from 'intl-tel-input/react';
import { useEffect, useRef } from 'react';

const formSchema = z
  .object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
    firstname: z.string(),
    lastname: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const intlTelInputInstance = useRef<any>(null);
  console.log('phoneInputRef: ', phoneInputRef?.current?.value);

  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [number, setNumber] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        if(number){
          const response = await signUp({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: data.password,
            phoneno:number?.toString()
          });
  
          if (response.error) {
            // Handle error (e.g. show error message)
            console.error('Signup error:', response.error);
            return;
          }
          setOpen(true);
          localStorage.setItem('verifyemail', JSON.stringify(response.email));
        }
      } catch (error) {
        // Handle errors that do not come from the response
        console.error('Signup error:', error);
      }
    });
  };

  const signUp = async (userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneno: string | null;
  }) => {
    try {
      const response = await fetch('api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'User already exists.',
          description: 'Sorry! Your email already exists. Please try again'
        });

        return { error: errorData.message || 'Signup failed' }; // Handle response error
      }
      toast({
        title: 'Successful!',
        description: 'Welcome! Your request has been success.'
      });

      return await response.json(); // Assume successful response returns user data or a success message
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: 'Sorry! Your SignUp has been failed. Please try again'
      });
      throw error; // Rethrow or return an error response
    }
  };

  const ok = () => {};
  
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input type="text" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input type="text" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormItem>
            <FormLabel>Phone no</FormLabel>
            <div className='phone-input'>
              <IntlTelInput
                onChangeNumber={setNumber}
                onChangeValidity={setIsValid}
                onChangeErrorCode={setErrorCode}
                inputProps={{
                  className:
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                }}
                // any initialisation options from the readme will work here
                initOptions={{
                  initialCountry: 'us',
                  loadUtils: () =>
                    import('intl-tel-input/build/js/utils.js' as string)
                }}
              />
            </div>
          </FormItem>
          <div className="w-full">
            {notice && <div className="notice">{notice}</div>}
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto bg-red-500 w-full" type="submit" handleClick={ok}>
            Sign Up
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignUpButton />
      <VerificationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        phoneNumber={number?.toString() || ''}
      />
    </>
  );
}