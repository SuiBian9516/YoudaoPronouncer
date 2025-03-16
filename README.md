# Youdao_Pronouncer

### What Youdao_Pronouncer
This is a software designed by SuiBian9516 aiming to create English videos which contain twice-pronouncing audios. **This project is for learning purposes only at your own risk**

## Command Usage
```shell
app.exe <working_directory>
```
`working_directory`: the root path at which the programme runs and where the config file is

## Programme Usage
`Firstly`, make sure that the executable file is in the `libs` folder that is in the same folder as the program

`Then`, assuming that now you have a directory `example` and a config file `config.json`. Then make sure that you have put `example.json` database file in `example/asset/example.json`(see [Database](#Database)).
```json
//config.json
{
    "autoClean":true,
    "database":"./asset/example.json",
    "output":"example",
}
```
Finally, run command below

```shell
youdao_pronouncer.exe ./example/
```

## Config File
In new version(>=1.0.0), command line only receives one argument that tells programme where the working directories is. So if `workPath` is correctly set, then programme will find `config.json` in `workPath`. Next I will show you how to create your own `config.json`.
```json
{
    "autoClean":true,
    "database":"./asset/example.json",
    "output":"example"
}
```
`autoClean`: means programme will automatically clean the working directory, including `cache` and `audio`
`database`: means the path of database file(s). If path refers to a file, it will only parse one file; if path refers to a directory, parser will consider all files under this directory as `database` file
`output`: means the names of generated videos. If over two database files are detected, then programme will add `_{index}` behind `output` automatically

## Database
If you are going to add English words you like, patient...
I will provide you with the example database file below...
```json
{
    "group1":{
        "Hello":"Description here",
        "World":"Description here"
    },
    "group2":{
        "Bye":"Description here",
        "World":"Description here"
    }
}
```
`group1` and `group2` or so are freely named, do what you like.