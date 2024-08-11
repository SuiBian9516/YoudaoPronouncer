# CHANGELOG

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