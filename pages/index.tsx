import Card from '@/components/card'
import Category from '@/components/dd-category'
import City from '@/components/location/dd-city'
import Postcode from '@/components/location/dd-postcode'
import State from '@/components/location/dd-state'
import Page from '@/components/page'
import Section from '@/components/section'
import { pb } from '@/lib/pb'
import { List } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Index = () => {
    const [negeri, setNegeri] = useState<any>();
    const [city, setCity] = useState<any>();
    const [postcode, setPostcode] = useState<any>();
    const [category, setCategory] = useState<any>();
    const [services, setServices] = useState<any[]>([]);
    const [list_category, setListCategory] = useState<any[]>([])

    const router = useRouter();

    // Load saved state on initial render
    useEffect(() => {
        const savedPostcode = localStorage.getItem('savedPostcode');
        const savedServices = localStorage.getItem('savedServices');
        const savedScrollPosition = localStorage.getItem('scrollPosition');

        if (savedPostcode) {
            setPostcode(savedPostcode);
        }

        if (savedServices) {
            setServices(JSON.parse(savedServices));
        }

        if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition));
        }
    }, []);

    // Save scroll position before the component unmounts or before navigation
    useEffect(() => {
        const handleRouteChange = () => {
            localStorage.setItem('scrollPosition', window.scrollY.toString());
        };
        router.events.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events]);

    // Save data when the postcode or services change
    useEffect(() => {
        if (postcode) {
            localStorage.setItem('savedPostcode', postcode);
        }

        if (services.length > 0) {
            localStorage.setItem('savedServices', JSON.stringify(services));
        }
    }, [postcode, services]);

    useEffect(() => {
        if (postcode) {
            const fetchData = async () => {
                try {
                    const providersList = await pb.collection('ServiceProviders').getList(1, 50, {
                        filter: `zip_code='${postcode}'`,
                    });

                    const resultList = await pb.collection('ServiceCategories').getList(1, 50);
                    setListCategory(resultList.items);

                    let providerIds: any[] = [];

                    if (providersList.totalItems > 0 && category) {
                        for (let index = 0; index < providersList.totalItems; index++) {
                            const servicesList = await pb.collection('Services').getList(1, 50, {
                                filter: `provider_id='${providersList.items[index].id}' && category='${category}'`,
                            });
                            providerIds = providerIds.concat(servicesList.items);
                        }

                        setServices(providerIds);
                    } else if (providersList.totalItems > 0) {
                        for (let index = 0; index < providersList.totalItems; index++) {
                            const servicesList = await pb.collection('Services').getList(1, 50, {
                                filter: `provider_id='${providersList.items[index].id}'`,
                            });
                            providerIds = providerIds.concat(servicesList.items);
                        }

                        setServices(providerIds);
                    }
                    
                    else {
                        setServices([]);
                    }
                } catch (error) {
                    console.log("Error fetching services:", error);
                    setServices([]);
                }
            };
            fetchData();
        } else {
            setServices([]);
        }
    }, [postcode, category]);

    return (
        <Page padding={3}>
            <Section>
                <div className='flex w-full'>
                    
                    <State setNegeri={setNegeri} setCity={setCity} setPostcode={setPostcode} />
                    <City negeri={negeri} setCity={setCity} setPostcode={setPostcode} city={city} />
                    <Postcode city={city} setPostcode={setPostcode} negeri={negeri} />
                </div>
                <Category list_category={list_category} category={category} setCategory={setCategory} />
                {/* Render Cards based on the fetched services */}
                {services.length > 0 ? (
                    services.map((service, index) => (
                        <div key={index} onClick={() => router.push("/service/" + service.id)}>
                            <Card data={service} />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center pt-40 px-4 pb-20">
                    <div className="text-primary w-24 h-24 mb-8">
                        <List size={96} />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4 text-center">No Items Found</h1>
                    <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
                         Start by selecting a location and category to find services.
                    </p>
                    
                </div>
                )}
            </Section>
        </Page>
    );
}

export default Index;
