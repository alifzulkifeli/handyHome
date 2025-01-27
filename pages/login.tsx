
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


export default function LoginForm() {
    const { toast } = useToast()
    const router = useRouter()

    const [email, setEmail] = useState("aliff@foo.bar")
    const [password, setPassword] = useState('12345678')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        try {
            
            const authData = await pb.collection('Users').authWithPassword(
                form.email.value,
                form.password.value
            );
            console.log(authData);
            localStorage.setItem('pocketbase_auth', JSON.stringify(authData));
            router.push('/');
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Account not found. Please check your email and password.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
              })
        }
        
        console.log(form.email.value);
        console.log(form.password.value);

    }


    return (
        <div  >
              <div className='fixed top-0 left-0 z-20  w-full bg-zinc-900 pt-safe'>
            <header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
                <div className='mx-auto flex h-16 max-w-screen-md items-center justify-between px-6'>
                        <button onClick={() => router.back()} className='text-blue-600'>
                            {"< Back"}
                        </button>
                </div>
            </header>
        </div>
            <Section>
                <Card className="m-4 mt-40 max-w-screen-md mx-auto" >
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your email and password to log in. <Link href="/signup" className="underline font-bold">Click here</Link> to create new account</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" required value={email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" value={password} required />
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

