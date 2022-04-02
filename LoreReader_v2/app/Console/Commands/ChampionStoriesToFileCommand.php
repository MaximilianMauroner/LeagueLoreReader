<?php

namespace App\Console\Commands;

use App\Models\Champion;
use App\Models\File;
use App\Models\Story;
use Illuminate\Console\Command;

class ChampionStoriesToFileCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'custom:championfile';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a files for each Champion Stories using the last champion sorted alphabetically';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $champion = Champion::whereHas('stories', function ($stories) {
            $stories->doesntHave('file');
        })->first();
        if ($champion == null) {
            return 1;
        }
        $story = $champion->stories()->where('champion_id', $champion->id)->doesntHave('file')->first();
        if ($story == null) {
            return 1;
        }
        $fp = fopen('story.json', 'w');
        fwrite($fp, json_encode($story));
        fclose($fp);
        $cmd = "python3 main.py";
        $ret = shell_exec($cmd);
        if ($ret == 1) {
            File::firstOrCreate([
                "save_path" => './' . $story->text_id . ".mp3",
                "filename" => $story->text_id . ".mp3",
                'story_id' => $story->id
            ]);
        } else {
            $filePath = "../LoreFiles/" . $story->text_id . ".mp3";
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        return $ret;
    }
}
