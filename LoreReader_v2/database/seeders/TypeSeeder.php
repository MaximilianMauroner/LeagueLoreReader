<?php

namespace Database\Seeders;

use App\Models\Type;
use Illuminate\Database\Seeder;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            ["name" => "Champion Story", "slug" => "champion_story"], ["name" => "Colour Story", "slug" => "colour_story"]
        ];

        foreach ($types as $type) {
            Type::firstOrCreate([
                'name' => $type['name'],
                'slug' => $type['slug']
            ]);
        }
    }
}
