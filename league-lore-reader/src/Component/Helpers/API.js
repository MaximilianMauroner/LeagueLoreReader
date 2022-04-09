import * as axios from "axios";

export default class API {
    constructor() {
        this.client = null;
        this.api_url = process.env.REACT_APP_API_URL;
    }

    init = () => {

        let headers = {
            Accept: "application/json",
        };

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000,
            headers: headers,
        });

        return this.client;
    };

    home = () => {
        return this.init().get("/home");
    }
    champion = (champion_slug) => {
        return this.init().get("/champion/" + champion_slug);
    }
    story = (text_id) => {
        return this.init().get("/story/" + text_id);
    }
    location = (location_slug) => {
        return this.init().get("/location/" + location_slug);
    }
    search = (search_term) => {
        return this.init().get("/search/" + search_term);
    }

    all_champions = () => {
        return this.init().get("/champions/all");
    }
    all_stories = () => {
        return this.init().get("/stories/all");
    }
    all_locations = () => {
        return this.init().get("/locations/all");
    }
    all_tts_stories = () => {
        return this.init().get("/files/all");
    }

}