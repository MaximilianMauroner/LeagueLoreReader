<?php

namespace App\Console\Commands;

use App\Models\Champion;
use App\Models\File;
use Illuminate\Console\Command;
use Symfony\Component\Finder\Finder;

class UpdateAllFilesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'custom:updateFiles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        $fileArr = [];
        $finder = new Finder();
        $finder->files()->in("../LoreFiles/");
        foreach ($finder as $file) {
            $fileNameWithExtension = $file->getRelativePathname();
            $fileArr[$fileNameWithExtension] = $fileNameWithExtension;
        }
        $champions = Champion::whereHas('stories', function ($stories) {
            $stories->doesntHave('file');
        })->get();
        foreach ($champions as $champion) {
            $stories = $champion->stories()->where('champion_id', $champion->id)->doesntHave('file')->get();
            foreach ($stories as $story) {
                if (isset($fileArr[$story->text_id . ".mp3"])) {
                    File::firstOrCreate([
                        "save_path" => './' . $story->text_id . ".mp3",
                        "filename" => $story->text_id . ".mp3",
                        'story_id' => $story->id
                    ]);
                }
            }
        }


        return 0;
    }
}
