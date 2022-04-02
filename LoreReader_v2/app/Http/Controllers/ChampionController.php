<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChampionResource;
use App\Http\Resources\ChampionStoryResource;
use App\Models\Champion;
use App\Http\Requests\StoreChampionRequest;
use App\Http\Requests\UpdateChampionRequest;
use phpDocumentor\Reflection\Types\Resource_;

class ChampionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * //     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new ChampionResource(Champion::all()->sortBy('slug'));
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
     * @param \App\Http\Requests\StoreChampionRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreChampionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param string $slug
     * @return \Illuminate\Http\Response
     */
    public function show(string $slug)
    {
        return new ChampionStoryResource(Champion::where('slug', $slug)->first());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Models\Champion $champion
     * @return \Illuminate\Http\Response
     */
    public function edit(Champion $champion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateChampionRequest $request
     * @param \App\Models\Champion $champion
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateChampionRequest $request, Champion $champion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Champion $champion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Champion $champion)
    {
        //
    }

    /**
     * Create new file.
     *
     * @param \App\Http\Requests\StoreChampionRequest $request
     * @return \Illuminate\Http\Response
     */
    public function makeFile(StoreChampionRequest $request)
    {


    }
}
