'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from 'next/navigation'
import Page from '@/components/page'
import Section from '@/components/section'
import { pb } from '@/lib/pb' // Replace with your PocketBase import
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/router'

// Define proper types
interface Service {
    id: string;
    service_name: string;
    description: string;
    price: number;
    time_taken: string
}

interface Provider {
    avatar: string;
    collectionId: string;
    id: string;
    name: string;
    email: string;
    zip_code: string;
}

interface Availabilities {
    id: string;
    provider_id: string;
    date: string;
    time_block: string;
}

interface AddressState {
    Adress1: string
    Adress2: string
    postcode: string
}

export default function ChatDetails() {
    const [service, setService] = useState<Service | null>(null);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [availbility, setAvailbility] = useState<Availabilities[] | null>(null);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [listTime, setListTime] = useState<string[] | null>(null);

    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState<AddressState>({
        Adress1: '',
        Adress2: '',
        postcode: ''
    })

    const params = useParams()
    const serviceId: any = params?.id ?? 'Pending' // Recipient ID
    // const currentUserId = 'sbptzw4sjouas1a' // Replace with actual current user ID
    const [currentUserId, setUserId] = useState<string | null>(null)

    const router = useRouter();
    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (!serviceId) {
                setLoading(false);
                return;
            }

            try {


                let user: { model: { id: string } } | null = null;
                const userStorage = localStorage.getItem('pocketbase_auth');
                if (userStorage) {
                    user = JSON.parse(userStorage);
                } else {
                    console.log('No user found in localStorage');
                    return;
                }

                if (user) {
                    setUserId(user.model.id)
                    console.log("User ID:", user.model.id);
                }


                
                // Get today's date in yyyy-mm-dd format
                const today = new Date().toISOString().split('T')[0];

                // Get the date seven days from now in yyyy-mm-dd format
                const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];


                // Fetch the service details using the service_id
                const serviceData: any = await pb.collection('Services').getOne(serviceId);
                const serviceProviderData: any = await pb.collection('ServiceProviders').getOne(serviceData.provider_id);
                const reviewsData: any = await pb.collection('ReviewRatings').getList(1, 5, {
                    filter: `service_id='${serviceData.id}'`
                });
                const availbilityData: any = await pb.collection('Availabilities').getList(1, 50, {
                    filter: `provider_id='${serviceData.provider_id}' && date>='${today}' && date<'${sevenDaysFromNow}'`
                });

                console.log(serviceData);
                console.log(serviceProviderData);
                console.log(availbilityData);

                setService(serviceData);
                setProvider(serviceProviderData)
                setAvailbility(availbilityData.items)
                setAddress({
                    Adress1: "",
                    Adress2: "",
                    postcode: serviceProviderData.zip_code
                })

            } catch (error) {
                console.log("Error fetching service details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [serviceId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAddress(prev => ({ ...prev, [name]: value }))
    }

    function handleDateSet(date: any): void {
        let tempList = []
        setSelectedDate(date);
        for (let index = 0; index < availbility!.length; index++) {
            const element = availbility![index];
            if (element.date === date) {
                tempList.push(element.time_block)
            }
        }
        setListTime(tempList)
    }

    const submitNewOrder = async () => {
        try {
            const orderData = {
                user_id: currentUserId,
                service_id: service?.id,
                booking_date: selectedDate,
                booking_time: selectedTime,
                address1: address.Adress1,
                address2: address.Adress2,
                status: "Ongoing",
                price: service?.price,
            };

            const newOrder = await pb.collection('Bookings').create(orderData);
            console.log("New order created:", newOrder);
            router.push('/order/');

        } catch (error) {
            console.log("Error creating new order:", error);
        }
    }

    return (
        <Page padding={0} nav={false}>
            <Section>
                {!loading ?
                    <div className="p-2 pb-20">


                        <Card className="">
                            <CardHeader>
                                <CardTitle className='text-xl' >{service?.service_name}</CardTitle>
                                <CardDescription >{service?.description}</CardDescription>
                                <CardDescription className='text-md' >{`Time Taken: ${service?.time_taken ?? 0} ${Number(service?.time_taken) > 1 ? "Hours" : "Hour"}`}</CardDescription>
                                <CardDescription className='text-md' >{`Provider: ${provider?.name}`}</CardDescription>
                                <CardDescription className='text-md' >{`Provider: ${provider?.zip_code}`}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="mt-2 p-3">

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[70%] text-left">Item</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    <TableRow >
                                        <TableCell className="font-medium">{"Base Charge"}</TableCell>
                                        <TableCell className="text-right">RM {service?.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium">{"Platform Charge(10%)"}</TableCell>
                                        <TableCell className="text-right">RM {(service?.price! / 10).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium">{"Total"}</TableCell>
                                        <TableCell className="text-right font-bold">RM {(service?.price! * 1.10).toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>

                        {availbility?.length ?
                            <Card className="mt-2 p-3 ">
                                <CardDescription className='text-md pl-3' >Date <span className='text-xs' >- choose one of the date</span> </CardDescription>
                                <div className='grid justify-items-center grid-cols-3' >
                                    {availbility?.length ? (
                                        [...new Set(availbility.map((avail: any) => avail.date))].map((date: any, _index: any) => (
                                            <div className=' py-1 mx-1' key={_index}>
                                                <div className='w-1/3' >
                                                    <Button onClick={() => handleDateSet(date)} className={`${selectedDate === date
                                                        ? 'focus:bg-blue-500  bg-blue-500 text-white border-blue-700 active:bg-blue-700'
                                                        : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-700 active:border-blue-700'
                                                        }`}
                                                    >{date.substring(8, 10) + date.substring(4, 7)}</Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <CardDescription className='w-screen'>No availbility found for this ...yet</CardDescription>
                                    )}
                                </div>
                            </Card>
                            : null}

                        {selectedDate ?

                            <Card className="mt-2 p-3 ">
                                <CardDescription className='text-md pl-3' >Time <span className='text-xs' >- choose one of the date</span> </CardDescription>
                                <div className='grid justify-items-center grid-cols-3' >
                                    {listTime?.length ? (
                                        listTime.map((time: any, _index: any) => (
                                            <div className=' py-1 mx-1' key={_index}>
                                                <div className='w-1/3' >
                                                    <Button onClick={() => setSelectedTime(time)} 
                                                    className={`${selectedTime === time
                                                        ? 'focus:bg-blue-500  bg-blue-500 text-white border-blue-700 active:bg-blue-700'
                                                        : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-700 active:border-blue-700'
                                                        }`}

                                                  >{time < 10 ? `0${time}:00` : `${time}:00`}</Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <CardDescription className='w-screen'>No availbility found for this service...yet</CardDescription>
                                    )}
                                </div>
                            </Card>
                            : null}






                        <Card className="mt-2">
                            <CardHeader>
                                <CardTitle>Enter Your Address</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="">
                                    <Label htmlFor="street">Address 1</Label>
                                    <Input
                                        id="address1"
                                        name="Adress1"
                                        value={address.Adress1}
                                        onChange={handleChange}
                                        placeholder="No, Street"
                                        required
                                    />
                                </div>
                                <div className="">
                                    <Label htmlFor="city">Address 2</Label>
                                    <Input
                                        id="address2"
                                        name="Adress2"
                                        value={address.Adress2}
                                        onChange={handleChange}
                                        placeholder="Area"
                                        required
                                    />
                                </div>

                                <div className="">
                                    <Label htmlFor="postcode">Postcode</Label>
                                    <Input
                                        id="postcode"
                                        name="postcode"
                                        value={address.postcode}
                                        onChange={handleChange}
                                        disabled
                                        className="bg-gray-100 text-gray-500"
                                    />
                                </div>
                            </CardContent>

                        </Card>



                    </div>
                    : null}

            </Section>

            {selectedDate && selectedTime && address.Adress1 && address.Adress2 ?
            <div className=''>
                <nav className='fixed bottom-0 w-full  max-w-screen-md  border-t bg-zinc-100  dark:border-zinc-800 dark:bg-zinc-900'>
                    <div className=' flex h-16  items-center justify-around'>

                        <div
                            key="Order Now"
                            onClick={submitNewOrder}
                            className={`flex h-full w-full flex items-center justify-center space-y-1 bg-green-200`}
                        >
                            <svg
                                viewBox='0 0 15 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                width='18'
                                height='18'
                            >
                                <path
                                    d='M2.5.5V0H2v.5h.5zm10 0h.5V0h-.5v.5zM4.947 4.724a.5.5 0 00-.894-.448l.894.448zM2.5 8.494l-.447-.223-.146.293.21.251.383-.32zm5 5.997l-.384.32a.5.5 0 00.769 0l-.385-.32zm5-5.996l.384.32.21-.251-.146-.293-.447.224zm-1.553-4.219a.5.5 0 00-.894.448l.894-.448zM8 9.494v-.5H7v.5h1zm-.5-4.497A4.498 4.498 0 013 .5H2a5.498 5.498 0 005.5 5.497v-1zM2.5 1h10V0h-10v1zM12 .5a4.498 4.498 0 01-4.5 4.497v1c3.038 0 5.5-2.46 5.5-5.497h-1zM4.053 4.276l-2 3.995.895.448 2-3.995-.895-.448zM2.116 8.815l5 5.996.769-.64-5-5.996-.769.64zm5.768 5.996l5-5.996-.768-.64-5 5.996.769.64zm5.064-6.54l-2-3.995-.895.448 2 3.995.895-.448zM8 14.49V9.494H7v4.997h1z'
                                    fill='currentColor'
                                />
                            </svg>
                            <span className='text-xs text-zinc-600 dark:text-zinc-400 ml-2 ' >
                                {"Create Booking"}
                            </span>
                        </div>
                    </div>
                </nav>
            </div>
            : null}
        </Page>
    )
}
