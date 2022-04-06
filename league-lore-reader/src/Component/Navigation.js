import React, {Fragment, useEffect, useState} from 'react'
import {Disclosure, Menu, Transition} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import {Search} from '@mui/icons-material/';


const Navigation = () => {
    const [navigation, setNavigation] = useState([
        {name: 'Home', href: '/home', current: true},
        {name: 'Champions', href: '/champions/all', current: false},
        {name: 'Regions', href: '/regions/all', current: false},
        {name: 'Stories', href: '/stories/all', current: false},
    ]);
    const pathname = window.location.href;

    useEffect(() => {
        let temp = navigation
        for (let i = 0; i < temp.length; i++) {
            if (pathname === temp[i].href || pathname.includes(temp[i].href)) {
                temp[i].current = true
            } else {
                temp[i].current = false
            }
        }
        setNavigation([...temp])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    function changeCurrent(item) {
        let temp = navigation
        for (let i = 0; i < temp.length; i++) {
            if (item.name === temp[i].name) {
                temp[i].current = true
            } else {
                temp[i].current = false
            }
        }
        setNavigation([...temp])

    }

    return (
        <Disclosure as="nav" className="bg-gray-900">
            {({open}) => (
                <>
                    <div className="mx-6 px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="absolute inset-y-0 left-0 flex items-center hidden sm:block">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true"/>
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex sm:items-center sm:justify-center items-stretch justify-start">
                                <div className="block sm:hidden sm:ml-6">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute right-0 flex items-center static inset-auto ml-6 pr-0">
                                    <div className="pt-2 relative mx-auto text-gray-400">
                                        <button type="submit" className="absolute left-0 top-0 mt-3 ml-1">
                                            <Search/>
                                        </button>
                                        <input className="bg-gray-700 w-64 h-8 px-2 pl-8 rounded-lg text-sm focus:outline-none"
                                               type="text" name="search" placeholder="Search"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Disclosure.Panel className="sm:block hidden">
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
export default Navigation;