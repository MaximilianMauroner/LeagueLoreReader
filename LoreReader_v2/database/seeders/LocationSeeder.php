<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Symfony\Component\VarDumper\VarDumper;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $location_res = Http::get('https://universe-meeps.leagueoflegends.com/v1/en_us/faction-browse/index.json');
        if ($location_res->ok()) {
            $locations = $location_res->json();
            foreach ($locations['factions'] as $location) {
                Location::firstOrCreate([
                    "title" => $location["name"],
                    "slug" => $location["slug"],
                    "description" => "",
                    "url" => "",
                    "image_url" => $location['image']["uri"]
                ]);
            }
        }
        Location::firstOrCreate([
            "title" => "Unaffiliated",
            "slug" => "unaffiliated",
            "description" => "",
            "url" => "",
            "image_url" => ""
        ]);
    }
}
