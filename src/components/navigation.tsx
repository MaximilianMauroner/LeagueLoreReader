import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Disclosure} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import Link from "next/link";
import {z} from "zod";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}


const Navigation: React.FC = () => {
    const router = useRouter();
    const [navigation, setNavigation] = useState([
        {name: 'Home', href: '/', current: true},
        {name: 'Champions', href: '/champion', current: false},
        {name: 'Factions', href: '/faction', current: false},
        {name: 'Stories', href: '/story', current: false},
        // {name: 'Text-to-Speech Stories', href: '/tts/all', current: false},
    ])
    const navigationValidator = z.array(z.object({
        name: z.string(),
        href: z.string().startsWith("/"),
        current: z.boolean()
    }))
    useEffect(() => {
        const pathname = router.pathname;
        const temp = navigationValidator.parse(navigation)
        for (let i = 0; i < temp.length; i++) {
            const curr = temp[i]
            if (curr === undefined) {
                return
            }
            if (i == 0) {
                curr.current = pathname === curr.href
            } else {
                curr.current = (pathname === curr.href || pathname.includes(curr.href));
            }
            temp[i] = curr;
        }
        setNavigation([...temp])

    }, [router]);

    return (
        <Disclosure as="nav" className="bg-gray-900">
            {({open}) => (
                <>
                    <div className="mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div
                                className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true"/>
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden sm:block sm:ml-6">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                passHref={true}
                                                aria-current={item.current ? 'page' : undefined}
                                                className={classNames(
                                                    item.current ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}>
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div
                                    className="absolute sm:relative right-0 flex items-center static inset-auto ml-6 sm:ml-0 pr-0 sm:w-full">
                                    {/*<div className={"relative w-full"}>*/}
                                    {/*    <div className="relative mx-auto text-gray-400">*/}
                                    {/*        <button type="submit" className="absolute left-0 top-0 mt-1 ml-1">*/}
                                    {/*            <Search/>*/}
                                    {/*        </button>*/}
                                    {/*        <input*/}
                                    {/*            className="bg-gray-700 w-64 sm:w-full h-9 p-2 pl-8 rounded-lg text-sm focus:outline-none"*/}
                                    {/*            type="text" name="search" placeholder="Search"*/}
                                    {/*            onChange={(e) => searchTerm(e.target.value)}/>*/}
                                    {/*    </div>*/}
                                    {/*    <div className={"absolute z-50 w-full"}>*/}
                                    {/*        {searchStoryResult.length > 0 || searchChampionResult.length > 0 || searchLocationResult.length > 0 ?*/}
                                    {/*            <div*/}
                                    {/*                className={"bg-slate-700 border border-gray-800 w-full rounded-xl shadow-2xl"}>*/}
                                    {/*                {displaySearchResults()}*/}
                                    {/*            </div> :*/}
                                    {/*            null*/}
                                    {/*        }*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Disclosure.Panel className="sm:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block px-3 py-2 rounded-md text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default Navigation