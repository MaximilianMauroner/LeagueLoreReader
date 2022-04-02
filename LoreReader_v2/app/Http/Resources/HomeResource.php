<?php

namespace App\Http\Resources;

use App\Models\Champion;
use App\Models\Location;
use App\Models\Story;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\VarDumper\VarDumper;

class HomeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "champion" => parent::toArray($request),
            "location" => $this->location,
            "stories" => $this->stories
        ];
    }
}
