<?php

namespace App\Http\Resources;

use App\Http\Controllers\ChampionController;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\VarDumper\VarDumper;

class StoryRelationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        return [
            'story' => parent::toArray($request),
            'file' => $this->file,
            'related_champions' => $this->champions
        ];
    }
}
