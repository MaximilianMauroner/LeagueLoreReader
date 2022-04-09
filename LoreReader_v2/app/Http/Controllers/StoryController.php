<?php

namespace App\Http\Controllers;

use App\Http\Resources\StoryRelationResource;
use App\Http\Resources\StoryResource;
use App\Models\File;
use App\Models\Story;
use App\Http\Requests\StoreStoryRequest;
use App\Http\Requests\UpdateStoryRequest;
use Symfony\Component\VarDumper\VarDumper;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new StoryResource(Story::query()->orderBy('text_id')->paginate(15, ['title', 'text_id', 'image_url']));
    }

    public function files()
    {

        $s = Story::join('files', 'files.story_id', '=', 'stories.id')
            ->orderBy('files.created_at', 'desc')
            ->paginate(15, ['stories.*']);
        return StoryRelationResource::collection($s);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreStoryRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreStoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param string $text_id
     * @return \Illuminate\Http\Response
     */
    public function show(string $text_id)
    {
        return new StoryRelationResource(Story::where('text_id', $text_id)->first());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Models\Story $story
     * @return \Illuminate\Http\Response
     */
    public function edit(Story $story)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateStoryRequest $request
     * @param \App\Models\Story $story
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateStoryRequest $request, Story $story)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Story $story
     * @return \Illuminate\Http\Response
     */
    public function destroy(Story $story)
    {
        //
    }
}
