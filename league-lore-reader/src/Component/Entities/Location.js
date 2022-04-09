import React from "react";
import Api from "../Helpers/API";
import ViewEntityBox from "../ReusableComponents/ViewEntityBox";
import Loading from "../ReusableComponents/Loading";

class Location extends React.Component {
    state = {
        loading: true,
        grid_layout: 'h-auto grid grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1',
        location_slug: this.props.match.params.slug,
        location: null,
        relations: [],


    }

    componentDidMount() {
        const location_slug = this.props.match.params.slug;
        this.setState({loading: true})
        new Api().location(location_slug).then((res) => {
            let response = res.data.data;
            this.setState({
                location: response.location,
                relations: response.relations,
                loading: false
            })
        })
    }

    heading = (title) => {
        return (<h1 className="pt-3 pl-5 text-2xl font-semibold text-white">{title}</h1>)
    }
    displayLocation = () => {
        return (
            <div className="container mx-auto py-9 md:py-2">
                <div className="flex items-strech justify-center flex-col ">
                    <div className="flex flex-col items-strech justify-between py-6 px-6">
                        <h1 className={"text-center pt-3 text-4xl text-white"}>{this.state.location.title}</h1>
                        <h3 className={"text-center pb-3 text-xl text-white"}><span className={"font-bold text-3xl"}>{this.state.relations.length}</span>&nbsp;Champions in this Region</h3>
                        <img className={"object-cover"} src={this.state.location.image_url} alt=""/>
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
                {this.displayLocation()}
                {this.heading("Champions")}
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
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Location
