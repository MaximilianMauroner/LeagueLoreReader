import React, {useState, useCallback, useEffect} from 'react';
import {Search as SearchIcon} from '@material-ui/icons'
import './App.css';

import ReactAudioPlayer from 'react-audio-player';
import axios from "axios";


function App() {
    const [link, setLink] = useState(0);
    const [url] = useState("https://backend.lorereader.mauroner.eu/");
    const [baseFileUrl] = useState("https://files.lorereader.mauroner.eu/");
    const [fileUrls, setFileUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendLink = (() => {
        const axios = require('axios');
        setLoading(true);
        axios.post(url + "?url=" + link, {}).then(function (response) {
            let files = fileUrls;
            if (files.indexOf(response.data.filePath) === -1) {
                files.push(response.data.filePath)
            }
            setFileUrls(files)
            setLoading(false);
        })
    });

    const loadExistingFiles = (() => {
        axios.post(url, {}).then(function (response) {
            setFileUrls(response.data.filePaths)
            setLoading(false);
        })
    });

    useEffect(() => {
        loadExistingFiles()
    }, [link]);

    const _handleKeyDown = ((e) => {
        if (e.key === 'Enter') {
            sendLink()
        }
    })


    return (
        <div className="bg-gray-800 min-h-screen h-full">
            <div className="container h-32 sm:h-28 flex justify-center items-center px-4 sm:px-6 lg:px-8">
                {loading ? <div className="flex items-center justify-center w-full h-full">
                    <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">

                        <svg fill='none' className="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                            <path clip-rule='evenodd'
                                  d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                                  fill='white' fill-rule='evenodd'/>
                        </svg>


                        <div className={"text-white"}>Loading ...</div>
                    </div>
                </div> : null}
                {!loading ?
                    <div className="relative w-6/12 sm:w-full">
                        {" "}
                        <input onKeyDown={_handleKeyDown} onChange={(e) => setLink(e.target.value)}
                               type="text"
                               placeholder={"Input the League Universe Link here"}
                               className="h-14 w-full bg-gray-700 text-white pr-8 pl-5 rounded-full py-3 px-6 z-0 focus:ring-gray-600 focus:outline-none"
                        />
                        <button className="absolute top-4 right-3" onClick={sendLink}>
                            {""}
                            <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"><SearchIcon/></i>
                            {" "}
                        </button>
                    </div> : null}
            </div>
            {fileUrls.length > 0 && !loading ?
                fileUrls.map((file) => (
                    (
                        <div className={"container h-32 sm:h-28 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"}>
                            <div className={"text-white pb-2"}>{file}</div>
                            <ReactAudioPlayer className={"w-6/12 sm:w-full"}
                                              src={encodeURI(baseFileUrl + file)}
                                              autoPlay={false}
                                              controls/>
                        </div>
                    )
                ))
                : null}
        </div>
    );

}

export default App;