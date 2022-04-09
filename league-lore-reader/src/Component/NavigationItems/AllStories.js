import React from "react";
import Api from "../Helpers/API";
import ViewEntityBox from "../ReusableComponents/ViewEntityBox";
import Loading from "../ReusableComponents/Loading";

class AllStories extends React.Component {
    state = {
        stories: [],
        loading: true,
        grid_layout: 'h-auto grid grid-cols-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'

    }

    componentDidMount() {
        new Api().all_stories().then((res) => {
            let response = res.data
            this.setState({
                stories: response.data,
                loading: false
            })
        });
    }

    render() {
        if (this.state.loading) {
            return (<Loading/>)
        }
        return (
            <div className="bg-gray-800 pt-5 min-h-screen h-full  justify-center">
                <div className={this.state.grid_layout}>
                    {this.state.stories.map((story) => (
                            <div key={story.text_id} className={"mx-5"}>
                                <ViewEntityBox
                                    entity={{
                                        image_url: story.image_url,
                                        name: story.name,
                                        title: story.title,
                                        link: "/story/" + story.text_id
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

export default AllStories