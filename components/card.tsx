interface CardPorps {
    data: any[any];
}

const Card = ({data}:CardPorps) => {
    console.log(data);
    
    return ( 

        <div className="flex w-full overflow-hidden bg-white rounded-lg shadow-lg mb-4">
            <div className="w-1/3 ">
                <img className=" object-cover h-60 "  src={"https://picsum.photos/200/300?random=" + data.id } alt="" />
                {/* <img src="images/logo-dark.png" alt="" /> */}

            </div>
            <div className="w-full p-4">
                <h1 className="text-xl font-bold text-gray-900">
                    {data.service_name}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {data.description}
                </p>
                <div className="flex mt-2 item-center">
                    <svg className="w-5 h-5 text-gray-700 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z">
                        </path>
                    </svg>
                    <svg className="w-5 h-5 text-gray-700 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z">
                        </path>
                    </svg>
                    <svg className="w-5 h-5 text-gray-700 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z">
                        </path>
                    </svg>
                    <svg className="w-5 h-5 text-gray-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z">
                        </path>
                    </svg>
                    <svg className="w-5 h-5 text-gray-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z">
                        </path>
                    </svg>
                </div>
                <div className=" justify-left mt-3 item-center">
                    <h1 className="text-xl font-bold text-gray-700">
                        RM {data.price}
                    </h1>
                    <div className="">
                    <button className="px-3 mr-1 py-2 text-xs font-bold text-white uppercase bg-gray-800 rounded">
                        Chat Us
                    </button>

                    <button className="px-3 py-2 text-xs font-bold text-white uppercase bg-gray-800 rounded">
                        Book Now
                    </button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Card;