# Youdao_Pronouncer

### What Youdao_Pronouncer
This is a software designed by SuiBian9516 aiming to create English videos which contain twice-pronouncing audio.

### Why Youdao_Pronouncer
To make tasks teacher gives to me easier and save my time

## Command Usage
```shell
main.js <rootPath> <databasePath> <outputName>
```
`rootPath`: the root path that contain cache files and video files
`databasePath`: the path which leads to the database file
`outputName`: the video name

## Programme Usage
`Firstly`, you are supposed to have FFmpeg installed in your computer and make sure that it is correctly configured.

`Secondly`, unzip the source code.

`Next`, choose the installing way you like
**npm**
```shell
npm install
```
**yarn**
```shell
yarn install
```
(~~I wont't tell you guys that I actually develop with `yarn`~~ `npm` is a good software that only eat *a little* memory in your disk.)

`Then`, assuming that now you have a directory `example`, and a database file `example/database.json` and you want to name the video `example.mp4`, type command below:
```shell
node dist/main.js ./example/ ./example/database.json example
```
You may see these below:
```
[INFO/Main] This software is successfully running...
[INFO/Main] Task is going to be executed
[INFO/Fetcher] Fetching: xxxx
[INFO/Fetcher] Fetching: xxxx
[INFO/Generator] Process of video generating is going to start
[INFO/Generator] Video is successfully generated
```
If yes, congratulations! You have won this tiring game! And you can admire the tiring video generated by this tiring programme...


## Database
If you are going to add English words you like, patient...
I will provide you with the example database file below...
```json
{
    "label1":[
        "Hello",
        "World"
    ],
    "label2":[
        "Bye",
        "World"
    ]
}
```
`label1` and `label2` or so are freely named, do what you like.

## Errors
If you meet some terrible problems, just `issue`, I will answer you if having time.

Wish you can have fun in this programme.