import React from "react";
import API from "./Helpers/API";
import Loading from "./ReusableComponents/Loading";
import ViewEntityBox from "./ReusableComponents/ViewEntityBox";
import ViewAudioFile from "./ReusableComponents/ViewAudioFile";
import {Redirect} from "react-router-dom";

class Story extends React.Component {
    state = {
        story: null,
        file: null,
        relations: [],
        loading: true,
    }

    componentDidMount() {
        const text_id = this.props.match.params.text_id
        new API().story(text_id).then((res) => {
            let response = res.data.data
            console.log(response)
            this.setState({
                story: response.story,
                relations: response.related_champions,
                file: response.file,
                loading: false
            })
        })
    }

    heading = (title) => {
        return (<h1 className="pt-3 pl-5 text-2xl font-semibold text-white">{title}</h1>)
    }
    changeLink = (link) => {
        this.setState({redirectTo: link})
    }

    render() {
        if (this.state.loading) {
            return (<Loading/>)
        }

        return (
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
                <div className={"pb-5 text-white content-center flex flex-col items-center"}>
                    <article className="relative justify-center w-1/2 md:w-2/3">
                        <h1 className="mb-4 text-2xl tracking-tight font-bold text-slate-200 text-center">
                            {this.state.story.title}
                        </h1>
                        {this.state.file ? <ViewAudioFile story={this.state.story} champions={this.state.relations} file={this.state.file}/> : null}

                        <div className="mb-6 prose text-gray-200 antialiased  tracking-wide prose-dark" dangerouslySetInnerHTML={{__html: this.state.story.html_story}}/>
                    </article>
                </div>
                {this.heading("Related Champions")}
                <div className={this.state.grid_layout}>
                    {this.state.relations.map((champion) => (
                        <div key={champion.id} className={"mx-5"}>
                            <ViewEntityBox
                                entity={{
                                    image_url: champion.image_url,
                                    name: champion.title,
                                    title: champion.name,
                                    link: "/champion/" + champion.slug
                                }}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Story;