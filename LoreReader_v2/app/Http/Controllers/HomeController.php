<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChampionResource;
use App\Http\Resources\HomeResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\StoryRelationResource;
use App\Http\Resources\StoryResource;
use App\Models\Champion;
use App\Models\Location;
use App\Models\Story;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return HomeResource::collection(Champion::inRandomOrder()->paginate(5));
    }
}
