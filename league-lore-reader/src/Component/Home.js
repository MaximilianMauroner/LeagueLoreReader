import React from "react";
import Api from "./Helpers/API";
import ViewEntityBox from "./ReusableComponents/ViewEntityBox";
import Loading from "./ReusableComponents/Loading";

class Home extends React.Component {
    state = {
        data: [],
        stories: [],
        locations: [],
        nextPage: '',
        loading: false,
        grid_layout: 'h-auto grid grid-cols-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'
    }

    componentDidMount() {

        this.loadHome();
    }

    loadHome = () => {
        this.setState({loading: true});
        new Api().home().then((res) => {
            this.setState({
                data: res.data.data,
                nextPage: res.data.links.next,
                loading: false
            })
        })

    }
    heading = (title) => {
        return (<h1 className="pt-3 pl-5 text-2xl font-semibold text-white">{title}</h1>)
    }

    render() {
        if (this.state.loading) {
            return (<Loading/>)
        }
        return (
            <div className="bg-gray-800 pt-5 min-h-screen h-full  justify-center">
                {this.heading("Champions")}
                <div className={this.state.grid_layout}>
                    {this.state.data.map((entry) => (
                            entry.champion ?
                                <div className={"mx-5"}>
                                    <ViewEntityBox
                                        entity={
                                            {
                                                image_url: entry.champion.image_url,
                                                name: entry.champion.name,
                                                title: entry.champion.title,
                                                link: "/champion/" + entry.champion.slug
                                            }
                                        }/>
                                </div>
                                : null
                        )
                    )}
                </div>
                {this.heading("Regions")}
                <div className={this.state.grid_layout}>
                    {this.state.data.map((entry) => (
                            entry.location ?
                                <div className={"mx-5"}>
                                    <ViewEntityBox
                                        entity={
                                            {
                                                image_url: entry.location.image_url,
                                                name: entry.location.title,
                                                title: entry.location.name,
                                                link: "/region/" + entry.location.slug
                                            }
                                        }/>
                                </div>
                                : null
                        )
                    )}
                </div>
                {this.heading("Stories")}
                <div className={this.state.grid_layout}>
                    {this.state.data.map((entry) => (
                            entry.stories.length > 0 ?
                                <div className={"mx-5 flex flex-col"}>
                                    {entry.stories.map((story) => {
                                        return (
                                            <ViewEntityBox
                                                entity={
                                                    {
                                                        image_url: story.image_url,
                                                        name: story.title,
                                                        title: entry.champion.name,
                                                        link: "/champion/" + entry.champion.slug + "/story/" + story.text_id
                                                    }
                                                }/>
                                        );
                                    })}
                                </div>
                                : null
                        )
                    )}
                </div>
            </div>
        );
    }

}

export default Home;