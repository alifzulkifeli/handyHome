
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Page from "@/components/page"
import Section from "@/components/section"
import { useRouter } from "next/router"
import { pb } from "@/lib/pb"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"


export default function SignUp() {
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        try {
            const data = {
                "email": form.email.value,
                "emailVisibility": true,
                "password": form.password.value,
                "passwordConfirm": form.password2.value,
            };

            console.log(data);
            

            if (data.password !== data.passwordConfirm) {
                throw new Error("Passwords do not match");
            }
            
            const record = await pb.collection('Users').create(data);

            if (record){
                const authData = await pb.collection('Users').authWithPassword(
                    form.email.value,
                    form.password.value
                );
                console.log(authData);
                localStorage.setItem('pocketbase_auth', JSON.stringify(authData));
                router.push('/');
                    
            }
            console.log(record);
            
            
   

        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: (error as Error).message,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
              })
        }
    

    }


    return (
        <div  >
              <div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
            <header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
                <div className='mx-auto flex h-16 max-w-screen-md items-center justify-between px-6'>
                        <button onClick={() => router.back()} className='text-blue-600'>
                            {"< Back"}
                        </button>
                </div>
            </header>
        </div>
            <Section>
                <Card className="m-4 mt-40  max-w-screen-md mx-auto" >
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Enter your email and password to create an account. </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Confirm Password</Label>
                                <Input id="password2" name="password2" type="password" required />
                            </div>
                        </CardContent>
                       
                        <CardFooter>
                            <Button type="submit" className="w-full">Log in</Button>
                        </CardFooter>
                    </form>
                </Card>
            </Section>
        </div>
    )
}

