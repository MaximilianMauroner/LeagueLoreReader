"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/", current: true },
    { name: "Champions", href: "/champion", current: false },
    { name: "Factions", href: "/faction", current: false },
    { name: "Stories", href: "/story", current: false },
    // {name: 'Text-to-Speech Stories', href: '/tts/all', current: false},
  ]);

  useEffect(() => {
    for (let i = 0; i < navigation.length; i++) {
      const curr = navigation[i];
      if (curr === undefined) {
        continue;
      }
      if (i == 0) {
        curr.current = pathname === curr.href;
      } else {
        curr.current = pathname === curr.href || pathname.includes(curr.href);
      }
      navigation[i] = curr;
    }
    const temp = navigation;
    setNavigation([...temp]);
  }, [pathname]);

  return (
    <html lang="en">
      <body
        className={
          inter.className +
          " flex h-full min-h-screen w-full items-center justify-center bg-gray-800"
        }
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold">Maintenance Mode</h1>
          <p className="mt-4">
            Our website is currently undergoing maintenance with no estimated
            time of completion. We apologize for any inconvenience caused.
            Please check back later.
          </p>
        </div>
      </body>
    </html>
  );

  return (
    <html lang="en">
      <body
        className={inter.className + " h-full min-h-screen w-full bg-gray-800"}
      >
        <Disclosure as="nav" className="bg-gray-900">
          {({ open }) => (
            <>
              <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            passHref={true}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                              item.current
                                ? "bg-gray-800 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium",
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium",
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <main className="h-full bg-gray-800">{children}</main>
      </body>
    </html>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
