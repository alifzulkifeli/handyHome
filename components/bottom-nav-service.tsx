import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
	serviceroviderID: string;
	serviceId: string
}

const BottomNavService = ({ serviceroviderID, serviceId }: Props) => {

	console.log(serviceroviderID);

	const router = useRouter()

	return (
		<div className=''>
			<nav className='fixed bottom-0 w-full max-w-screen-md border-t bg-zinc-100  dark:border-zinc-800 dark:bg-zinc-900'>
				<div className=' flex h-16  items-center justify-around'>


					<Link
						key="Chat Us"
						href={("/chat/" + serviceroviderID)}
						className={`flex h-full w-full flex items-center justify-center space-y-1 bg-blue-200`}
					>
						<svg
							viewBox='0 0 15 15'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							width='18'
							height='18'
						>
							<path
								d='M7.5 15V7m0 .5v3m0-3a4 4 0 00-4-4h-3v3a4 4 0 004 4h3m0-3h3a4 4 0 004-4v-3h-3a4 4 0 00-4 4v3zm0 0l4-4m-4 7l-4-4'
								stroke='currentColor'
							/>
						</svg>
						<span className='text-xs text-zinc-600 dark:text-zinc-400 ml-2 ' >
							{"Chat Us"}
						</span>
					</Link>


					<Link
						key="Order Now"
						href={("/order/new/" + serviceId)}
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
							{"Order Now"}
						</span>
					</Link>
				</div>
			</nav>
		</div>
	)
}

export default BottomNavService

