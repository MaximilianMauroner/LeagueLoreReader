import React from "react";
import Api from "../Helpers/API";
import ViewEntityBox from "../ReusableComponents/ViewEntityBox";

class AllLocations extends React.Component {
    state = {
        locations: [],
        loading: true,
        grid_layout: 'h-auto grid grid-cols-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'

    }

    componentDidMount() {
        new Api().all_locations().then((res) => {
            let response = res.data
            this.setState({
                locations: response.data,
                loading: false
            })
        });
    }

    render() {
        return (
            <div className="bg-gray-800 pt-5 min-h-screen h-full  justify-center">
                <div className={this.state.grid_layout}>
                    {this.state.locations.map((location) => (
                            <div key={location.slug} className={"mx-5"}>
                                <ViewEntityBox
                                    entity={{
                                        image_url: location.image_url,
                                        name: location.title,
                                        title: location.name,
                                        link: "/region/" + location.slug
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

export default AllLocations