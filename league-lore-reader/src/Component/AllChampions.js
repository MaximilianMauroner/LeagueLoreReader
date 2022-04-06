import React from "react";
import Api from "./Helpers/API";
import ViewEntityBox from "./ReusableComponents/ViewEntityBox";

class AllChampions extends React.Component {
    state = {
        champions: [],
        links:[],
        loading:true,
        grid_layout: 'h-auto grid grid-cols-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'

    }

    componentDidMount() {
        new Api().all_champions().then((res) => {
            let response = res.data
            this.setState({
                champions: response.data,
                links: response.links,
                loading: false
            })
        });
    }

    render() {
        return (
            <div className="bg-gray-800 pt-5 min-h-screen h-full  justify-center">
                <div className={this.state.grid_layout}>
                    {this.state.champions.map((champion) => (
                                <div className={"mx-5"}>
                                    <ViewEntityBox
                                        entity={{
                                            image_url: champion.image_url,
                                            name: champion.name,
                                            title: champion.title,
                                            link: "/champion/" + champion.slug
                                        }}
                                    />
                                </div>
                        )
                    )}
                </div>

            </div>

        )
    }
}

export default AllChampions