import React, {useEffect, useState} from 'react'
import {Disclosure} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import {Search} from '@mui/icons-material/';
import {Link, useLocation} from "react-router-dom";
import API from "./Helpers/API";

const Navigation = () => {
    const [navigation, setNavigation] = useState([
        {name: 'Home', href: '/home', current: true},
        {name: 'Champions', href: '/champions/all', current: false},
        {name: 'Regions', href: '/regions/all', current: false},
        {name: 'Stories', href: '/stories/all', current: false},
        // {name: 'Text-to-Speech Stories', href: '/tts/all', current: false},
    ])
    const [searchLocationResult, setSearchLocationResult] = useState([])
    const [searchStoryResult, setSearchStoryResult] = useState([])
    const [searchChampionResult, setSearchChampionResult] = useState([])
    const location = useLocation();


    useEffect(() => {
        let pathname = location.pathname;
        let temp = navigation
        for (let i = 0; i < temp.length; i++) {
            temp[i].current = !!(pathname === temp[i].href || pathname.includes(temp[i].href));
        }
        setNavigation([...temp])

    }, [location, searchLocationResult, searchStoryResult, searchChampionResult]);

    function searchTerm(term) {
        if (term.length > 0) {
            new API().search(term).then((res) => {
                let response = res.data.data
                setSearchLocationResult(response.locations.data)
                setSearchStoryResult(response.stories.data)
                setSearchChampionResult(response.champions.data)
            });
        } else {
            setSearchLocationResult([])
            setSearchStoryResult([])
            setSearchChampionResult([])
        }
    }


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    function displaySearchResults() {
        return (
            <>
                {displaySearchComponent(searchStoryResult, "Stories", "/story/", false)}
                {displaySearchComponent(searchChampionResult, "Champions", "/champion/")}
                {displaySearchComponent(searchLocationResult, "Regions", "/region/")}
            </>
        )
    }

    function displaySearchComponent(passArr, title, baseUrl, bt = true) {
        return (
            <div>
                {passArr.length > 0 ?
                    <h1 className={classNames(
                        bt ? 'border-t' : '',
                        'py-2 border-b  border-white text-center text-lg text-white'
                    )}>{title}</h1>

                    : null}
                <ul>
                    {passArr.map((entry) => (
                        <li key={Math.random()} className="pl-8 pr-2 py-2 relative rounded-xl cursor-pointer text-gray-400 hover:-translate-y-1 ease-in-out duration-300">
                            <a href={passArr[0] && passArr[0].text_id ? baseUrl + entry.text_id : baseUrl + entry.slug}>
                                {entry.name ? entry.name : entry.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <Disclosure as="nav" className="bg-gray-900">
            {({open}) => (
                <>
                    <div className="mx-6 sm:mx-0 px-8 sm:px-2">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="absolute sm:relative lg:mt-3 sm:mt-0 inset-y-0 left-0 flex items-center hidden lg:block">
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
                            <div className="flex-1 flex lg:items-center lg:justify-center items-stretch justify-start">
                                <div className="block lg:hidden sm:ml-6">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className={classNames(
                                                    item.current ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute sm:relative right-0 flex items-center static inset-auto ml-6 sm:ml-0 pr-0 sm:w-full">
                                    <div className={"relative w-full"}>
                                        <div className="relative mx-auto text-gray-400">
                                            <button type="submit" className="absolute left-0 top-0 mt-1 ml-1">
                                                <Search/>
                                            </button>
                                            <input className="bg-gray-700 w-64 sm:w-full h-9 p-2 pl-8 rounded-lg text-sm focus:outline-none"
                                                   type="text" name="search" placeholder="Search" onChange={(e) => searchTerm(e.target.value)}/>
                                        </div>
                                        <div className={"absolute z-50 w-full"}>
                                            {searchStoryResult.length > 0 || searchChampionResult.length > 0 || searchLocationResult.length > 0 ?
                                                <div className={"bg-slate-700 border border-gray-800 w-full rounded-xl shadow-2xl"}>
                                                    {displaySearchResults()}
                                                </div> :
                                                null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Disclosure.Panel className="lg:block hidden">
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