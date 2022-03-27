<?php

namespace Database\Seeders;

use App\Models\Champion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $champions = Champion::all();
        foreach ($champions as $champion) {
            $chamption_story = Http::get('https://universe-meeps.leagueoflegends.com/v1/en_us/champions/' + $champion->slug + '/index.json');
            if ($chamption_story->ok()) {
                $story = $chamption_story->json();

            }
        }


    }
}
