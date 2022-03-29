<?php

namespace Database\Seeders;

use App\Models\Champion;
use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Symfony\Component\VarDumper\VarDumper;

class ChampionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $champion_res = Http::get('https://universe-meeps.leagueoflegends.com/v1/en_us/champion-browse/index.json');
        if ($champion_res->ok()) {
            $champions = $champion_res->json();
            foreach ($champions['champions'] as $champion) {

                if ($champion['type'] == 'champion') {
                    $location_id = Location::query()->where('slug', $champion["associated-faction-slug"])->pluck('id')->first();
                    Champion::firstOrCreate([
                        'name' => $champion['name'],
                        'release_date' => date("Y-m-d", strtotime($champion['release-date'])),
                        'url' => $champion['url'],
                        'image_url' => $champion['image']['uri'],
                        'location_id' => $location_id,
                        'slug' => $champion['slug']
                    ]);
                }
            }
        }
    }
}
