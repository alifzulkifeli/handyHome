import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Section from '@/components/section'
import { useRouter } from 'next/router'
import { pb } from '@/lib/pb'
import { toast } from '@/hooks/use-toast'

export default function ProfilePage() {
    const router = useRouter()

    const [verificationState, setVerificationState] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [newName, setNewName] = useState<string | null>(null)

    const handleVerifyEmail = async () => {
        await pb.collection('Users').requestVerification('test@example.com');
        setVerificationState("Verification email sent!");
    }

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                let userData: { model: { id: string; name: string; avatar?: string; email?: string } } | null = null;
                const userStorage = localStorage.getItem('pocketbase_auth');
                if (userStorage) {
                    userData = JSON.parse(userStorage);
                } else {
                    console.log('No user found in localStorage');
                    return;
                }

                if (userData && userData.model) {
                    setUser(userData.model);
                    setNewName(userData.model.name);
                    // If userData.model.avatar is a filename, you may need to construct a URL using pb.getFileUrl
                    // Example: setAvatarSrc(pb.getFileUrl(userData.model, userData.model.avatar));
                    if (userData.model.avatar) {
                        // If you have a file field "avatar" in PocketBase and user's avatar is a stored file:
                        setAvatarSrc(pb.getFileUrl(userData.model, userData.model.avatar));
                    }
                }
            } catch (error) {
                console.log("Error fetching user details:", error);
            }
        };

        fetchDetails();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!user || !user.id) {
            console.log("No user data found.");
            return;
        }

        try {
            const formData = new FormData();
            if (newName) {
                formData.append("name", newName);
            }
            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }

            const record = await pb.collection('Users').update(user.id, formData);

            if (record) {
                console.log("User updated successfully:", record);
                setUser(record);
                // Update the stored user data in localStorage if needed
                const stored = localStorage.getItem('pocketbase_auth');
                if (stored) {
                    let storedData = JSON.parse(stored);
                    storedData.model = record;
                    localStorage.setItem('pocketbase_auth', JSON.stringify(storedData));

                    // toast success message
                    toast({
                        title: "Yahoo!! Your profile has been updated🎉 ",
                        // description: "Friday, February 10, 2023 at 5:57 PM",
                      })
                }
            }
        } catch (error) {
            console.log("Error updating user:", error);
        }
    }

    return (
        <>
            {user && (
                <div className='p-2 max-w-screen-md mx-auto'>
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
                        <Card className="w-full mt-20 ">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="w-24 h-24">
                                            {avatarSrc ? (
                                                <AvatarImage src={avatarSrc} alt="Profile picture" />
                                            ) : (
                                                <AvatarImage src='https://pb.alifz.xyz/api/files/novm4dln6wcco7x/tnxkz1axt5fvz16/l60_hf_1_QJJvJvC9BM.png'/>
                                            )}
                                        </Avatar>
                                        <div>
                                            <Label htmlFor="profilePicture">Change Profile Picture</Label>
                                            <Input id="profilePicture" name="profilePicture" type="file" accept="image/*" onChange={handleFileChange} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Your name"
                                            value={newName || ""}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className='bg-gray-200'
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value="********"
                                            readOnly
                                            className='bg-gray-200'
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">Update Profile</Button>
                                </form>

                                <div className="mt-6">
                                    <Button onClick={handleVerifyEmail} variant="outline" className="w-full">Verify Email</Button>
                                    {verificationState && <p className="mt-2 text-blue-600">{verificationState}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </Section>
                </div>
            )}
        </>
    )
}
