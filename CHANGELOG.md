# CHANGELOG

### v2.0.1
> Final patch
- Optimizing: change a few log information

### v2.0.0
> Final Update
- New: Add a new option `autoClean` in config file which indicate whether programme clean work directory automatically after processing
- New: add a copyright screen in the end of each videos
- Optimizing: now the option `output` is changed to `string` type which only refers one file name. If over two database files are going to process, then programme will add `_{index}` behind `output` and build a new name which refers to one current output file
- Change: change the font size to 100

### v1.0.0
> Final version
- Optimizing: now `Fetcher` will try again when error occurs
- Optimizing: support `config.json` to configure whole project
- Optimizing: now the length(s) of whole video(s) generated will change dynamically depending on how long the audios which make whole video up is
- New: `Task` concept is introduced. Now if more than two database files are set, `Task` will be enabled and handle all database files by order 

### v0.3
> Better version
- Optimizing: `Logger` system used, now you can see the whole progress
- Optimizing: folders that programme need will be created automatically if do not exist

### v0.2
> Improved version
- Optimizing: no `setTimeout` function is use, using `Stack` data structure instead
- Fix: the volume of the whole video generated will no longer change

### v0.1
> This version is the first that actually under development
- New: fetch audio automatically from `youdao.com`
- New: generate video automatically