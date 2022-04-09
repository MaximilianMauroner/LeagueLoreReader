import React from "react";
import Api from "../Helpers/API";
import Loading from "../ReusableComponents/Loading";
import ViewEntityBox from "../ReusableComponents/ViewEntityBox";

class Champion extends React.Component {
    state = {
        champion_slug: this.props.match.params.slug,
        champion: null,
        location: null,
        relations: [],
        stories: [],
        loading: true,
        grid_layout: 'h-auto grid grid-cols-2 md:grid-cols-1 mx-3'
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = (url = false) => {
        let champion_slug = "";
        if (url === false) {
            champion_slug = this.props.match.params.slug;
        } else {
            champion_slug = url.split("/champion/")[1]
        }
        this.setState({loading: true});
        new Api().champion(champion_slug).then((res) => {
            let response = res.data.data
            this.setState({
                champion: response.champion,
                location: response.location,
                relations: response.relations,
                stories: response.stories,
                loading: false
            })
        });
    }

    heading = (title) => {
        return (<h1 className="pt-3 pl-5 text-2xl font-semibold text-white">{title}</h1>)
    }


    displayChampion = () => {
        return (
            <div className={""}>
                <div className="container mx-auto py-9 md:py-2">
                    <div className="flex items-strech justify-center flex-col ">
                        <div className="flex flex-col items-strech justify-between py-6 px-6">
                            <h1 className={"text-center pt-3 text-4xl text-white"}>{this.state.champion.name}</h1>
                            <h1 className={"text-center pb-3 text-3xl text-white"}>{this.state.champion.title}</h1>
                            <img className={"object-cover"} src={this.state.champion.image_url} alt=""/>
                            <div className={"text-center py-3 text-xl text-white"}>{"Release Date: " + new Date(this.state.champion.release_date).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.state.loading) {
            return (<Loading/>)
        }
        return (
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
                <div className={"w-auto"}>
                    {this.displayChampion()}
                </div>
                {this.heading("Stories")}
                <div className={this.state.grid_layout}>
                    {this.state.stories.map((story) => (
                        <div key={story.id} className={"mx-5"}>
                            <ViewEntityBox
                                entity={{
                                    image_url: story.image_url,
                                    name: story.title,
                                    title: this.state.champion.name,
                                    link: "/story/" + story.text_id
                                }}

                            />
                        </div>
                    ))}
                </div>

                {this.heading("Region")}
                <div className={"w-auto"}>
                    <ViewEntityBox
                        entity={{
                            image_url: this.state.location.image_url,
                            title: this.state.location.title,
                            link: "/region/" + this.state.location.slug
                        }}

                    />
                </div>

                {this.state.relations.length > 0 ? this.heading("Related Champions") : null}
                <div className={this.state.grid_layout}>
                    {this.state.relations.map((champion) => (
                        <div key={champion.id} className={"mx-5"}>
                            <ViewEntityBox
                                entity={{
                                    image_url: champion.image_url,
                                    name: champion.name,
                                    title: champion.title,
                                    link: "/champion/" + champion.slug
                                }}
                                loadData={this.loadData}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Champion