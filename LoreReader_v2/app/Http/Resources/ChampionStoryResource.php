<?php

namespace App\Http\Resources;

use App\Models\Champion;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\VarDumper\VarDumper;

class ChampionStoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {


        $championId = $this->id;
        $champIds = Champion::query()
            ->join('champion_story', 'champion_story.champion_id', '=', 'champions.id')
            ->whereIn('champion_story.story_id',
                function ($query) use ($championId) {
                    $query->select('champion_story.story_id')
                        ->from('champions')
                        ->join('champion_story', 'champion_story.champion_id', '=', 'champions.id')
                        ->where('champions.id', $championId)
                        ->get();
                })
            ->where('champions.id', '<>', $championId)
            ->get()->pluck('id');

        return [
            'champion' => parent::toArray($request),
            'location' => $this->location,
            'stories' => $this->stories,
            'relations' => Champion::whereIn('id', $champIds)->get()
        ];
    }
}
