'use client';
import { Button } from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {  useTransition } from 'react';
import {  useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
      confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters' }),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type UserFormValue = z.infer<typeof formSchema>;



export default function UserAuthResetPassword() {
    const router = useRouter();
    const { slug } = useParams();
    const [loading, startTransition] = useTransition();
    
    const form = useForm<UserFormValue>({
       resolver: zodResolver(formSchema)
    });

    const resetPassword=async (data:{verifytoken:string,password:string})=>{
        try{
          const response = await fetch('/api/resetpassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        
          if (!response.ok) {
            const errorData = await response.json();
            toast({
              title: 'Failed!',
              description: errorData.error
            });
            return { error: errorData.error || 'Failed' };
          }
    
          return await response.json();
    
        }catch(error){
          console.error('Error during fetch:', error);
          throw error;
        }
    }
    
   const onSubmit = async (data: UserFormValue) => {
      startTransition(async () => {
        if(!slug || !data?.password) return 
        try {
          const response = await resetPassword({
              verifytoken:slug as string,
              password:data?.password
            });
          if (response.message) {
            toast({
              title: response.message,
            });
            router.push('/main');
          } 
        } catch (error) {
          console.error('Signup error:', error);
        }
      });
    };

    return (  
    <>
     <div className="relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex w-full justify-center">
              <Image src="/logo.png" width={170} height={170} alt="logo image" />
          </div>
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
        <Form {...form}>
        <form
          onSubmit={form?.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
        <FormField
            control={form?.control}
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
            control={form?.control}
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
         <Button disabled={loading} className="ml-auto bg-blue-500 w-full" type="submit" handleClick={()=>{}}>
            Reset Password
          </Button>
        </form>
        </Form>
        </div>
    </div>
    </div>
    </>
    );
}