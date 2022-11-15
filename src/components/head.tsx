import Head from "next/head";
import React from "react";

const HeadComponent = ({title, description}: { title: string, description: string }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description}/>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="manifest" href="/manifest.json"/>
        </Head>
    );
}
export default HeadComponent;