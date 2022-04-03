<?php

namespace App\Http\Resources;

use App\Models\Champion;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationRelationResource extends JsonResource
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
            'location' => parent::toArray($request),
            'relations' => $this->champions
        ];
    }
}
