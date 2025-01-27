import BackHome from "@/components/backHome"
import Page from "@/components/page"
import Section from "@/components/section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { pb } from "@/lib/pb"
import { CalendarIcon, PackageIcon, TruckIcon } from "lucide-react"
import { useRouter } from "next/router"
import { use, useEffect, useState } from "react"



export default function Order() {
  type RecordModel = {
    id: string;
    avatar?: string;
    collectionId: string;
    name: string;
    status: string;
    booking_date: string;
    price: number;
    expand?: {
      service_id: {
        service_name: string;
        description: string;
      };
    };
  };
  const [user, setUser] = useState<RecordModel | any>(null)
  const [orders, setOrders] = useState<RecordModel[]>([]);






  useEffect(() => {
    let otherUser: [] = [];
    const fetchMessages = async () => {
      try {
        let user: { model: { id: string } } | null = null;
        const userStorage = localStorage.getItem('pocketbase_auth');
        if (userStorage) {
          user = JSON.parse(userStorage);
          setUser(user);
        } else {
          console.log('No user found in localStorage');
          return;
        }

        
        

        if (!user) {
          console.log('User is null');
          return;
        }


        const records = await pb.collection('Bookings').getFullList({
            filter: `user_id.id="${user.model.id}"`,
            expand: 'user_id,service_id',
            sort: '-created',
        });

        const mappedRecords: RecordModel[] = records.map(record => ({
          id: record.id,
          avatar: record.avatar,
          collectionId: record.collectionId,
          name: record.name,
          status: record.status,
          booking_date: record.booking_date,
          price: record.price,
          expand: {
            service_id: {
              service_name: record.expand?.service_id?.service_name || '',
              description: record.expand?.service_id?.description || '',
            },
          },
        }));

        setOrders(mappedRecords);
        console.log(records);
        



      }
      catch (error) {
        console.log('Error fetching user:', error)
      }

    }
    fetchMessages()

    
  }, [])


  const statusColor: { [key: string]: string } = {
    Ongoing: "bg-yellow-500",
    Completed: "bg-green-500"
  }

  const handleRouteToOrderDetails = (order: RecordModel) => {
    router.push({
        pathname: '/order/' + order.id,
    });
  }

  const router = useRouter();
  return (

     <Page padding={0} >
      <Section >
        {user && orders.length  > 0 ? (
          <div className="h-full bg-background pb-20 text-foreground w-full">
          <ScrollArea className="h-full ">
            <div className="p-5  space-y-3">
              {orders.map((order, index) => (

                <Card className="w-full  " key={index} >
                <CardHeader className="flex flex-row items-center  justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Order #{order.id}</CardTitle>
                  <Badge className={statusColor[order.status]}>{order.status}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">{order.booking_date.substring(0,10)}</span>
                    </div>
                    <div className="flex items-center">
                      <PackageIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs font-bold text-muted-foreground">{order.expand?.service_id?.service_name} </span>
                    </div>
                    <div className="flex items-center">
                     
                      <span className="text-xs pl-6 text-muted-foreground">{order.expand?.service_id?.description} </span>
                    </div>
                    <div className="flex items-center font-bold">
                      <TruckIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-sm">Total: RM{order.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleRouteToOrderDetails(order)} >View Order Details</Button>
                </CardFooter>
              </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        ) : (
          <BackHome />
        )}
      </Section>
    </Page>

  )
}