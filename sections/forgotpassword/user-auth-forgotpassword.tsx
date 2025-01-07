'use client';
import { Button } from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import {  useTransition } from 'react';
import {  useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
  .object({
   email: z.string().email({ message: 'Enter a valid email address' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForgotPassword() {
    const [loading, startTransition] = useTransition();
    
    const form = useForm<UserFormValue>({
       resolver: zodResolver(formSchema)
    });

    const forgotPassword=async (email:string)=>{
        try{
    
          const response = await fetch('api/forgotpassword', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({email:email})
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
        try{
          const response=await forgotPassword(data?.email);
          if(response?.message){
            toast({
                title: response?.message,
              }); 
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
              <Image src="/IH-LOGO.png" width={170} height={170} alt="logo image" />
          </div>
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            Forgot Password
          </h1>
        <Form {...form}>
        <form
          onSubmit={form?.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
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
         <Button disabled={loading} className="ml-auto bg-blue-500 w-full" type="submit" handleClick={()=>{}}>
            Submit
          </Button>
        </form>
        </Form>
        </div>
    </div>
    </div>
    </>
    );
}