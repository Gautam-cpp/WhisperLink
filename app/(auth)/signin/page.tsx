"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import {  useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
        identifier: "",
        password: "",
    },
  });

  const message = "Don't have an account? "

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if(result?.error){
            toast({
                title: "Login Failed",
                description: result.error || "Incorrect username or password",
                variant: "destructive"
            })
        }
        if(result?.url){
          setIsSubmitting(false)
          router.replace('/dashboard')
        }
        setIsSubmitting(false)
        
        console.log(result)
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 ">
            Join Mystery Message
          </h1>
          <p className="text-gray-500 mb-4">
            Sign in to your account to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username or Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password..."
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4 " /> Please Wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div>
          <p className="text-center text-gray-500 mt-4">
            {message}
            <Link href="/signup" className="text-blue-600 hover:to-blue-800 ">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
