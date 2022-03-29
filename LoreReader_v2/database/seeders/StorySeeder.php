<?php

namespace Database\Seeders;

use App\Models\Champion;
use App\Models\Story;
use App\Models\Type;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Symfony\Component\VarDumper\VarDumper;

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
        $baseUrl = "https://universe-meeps.leagueoflegends.com/v1";
        foreach ($champions as $champion) {
            $chamption_story = Http::get($baseUrl . '/en_us/champions/' . $champion->slug . '/index.json');
            if ($chamption_story->ok()) {
                $story = $chamption_story->json();
                $champion_story_id = Type::query()->where('slug', 'champion_story')->pluck('id')->first();
                $colour_story_id = Type::query()->where('slug', 'colour_story')->pluck('id')->first();
                Story::firstOrCreate([
                    "text_id" => $story['champion']['slug'],
                    "story" => strip_tags($story['champion']['biography']['full']),
                    'type_id' => $champion_story_id
                ])->champions()->attach([$champion->id]);

                foreach ($story['modules'] as $module) {
                    if ($module['type'] == "story-preview") {
                        $single_story_request = Http::get($baseUrl . $module['url'] . '/index.json');
                        if ($single_story_request->ok()) {
                            $single_story = $single_story_request->json();
                            $story_content = "";
                            $champion_slugs = [];
                            $champion_slugs[$champion->slug] = $champion->slug;
                            foreach ($single_story['story']['story-sections'] as $section) {
                                foreach ($section['story-subsections'] as $subsection) {
                                    $story_content .= strip_tags($subsection['content']);
                                }
                                foreach ($section['featured-champions'] as $featuredchampion) {
                                    $champion_slugs[$featuredchampion['slug']] = $featuredchampion['slug'];
                                }
                            }
                            $champion_ids = Champion::query()->whereIn('slug', $champion_slugs)->pluck('id');

                            $s = Story::firstOrCreate([
                                "text_id" => $single_story['id'],
                                "story" => $story_content,
                                'type_id' => $colour_story_id
                            ]);
                            $s->champions()->attach($champion_ids);
                        }
                    }
                }
            }
        }
    }
}
