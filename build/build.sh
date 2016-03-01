#!/bin/sh

ENV_FOLDER="$PATH_TO_ENV_FOLDER/$1"
TIMESTAMP=$(date +%s)
VERSION=$TIMESTAMP

echo "Compiller path $PATH_TO_TYPESCRIPT_COMPILER"
echo "Dest folder $ENV_FOLDER"
echo "Source path $PATH_TO_SOURCE"

#Clean up folder
#Clean up folder
rm -rf $ENV_FOLDER/*

#Move Libs
echo "Moving config and libs..."
mkdir $ENV_FOLDER/js
cp -R -u $PATH_TO_SOURCE/../js/* $ENV_FOLDER/js
cp -R -u $PATH_TO_SOURCE/../build/$1/index.html $ENV_FOLDER/

# Compile source
echo "Compilling sources..."
if [ $1 = "dev" ];then
    #Compile using Typescript compiler
    $PATH_TO_TYPESCRIPT_COMPILER --outDir $ENV_FOLDER/js -p $PATH_TO_SOURCE --removeComments
    
    #Replace CDN placeholder with actual value
    sed -i -- "s/{CDN}//g" $ENV_FOLDER/js/constants.js
    sed -i -- "s/{VERSION}/$VERSION/g" $ENV_FOLDER/js/menuState.js

    echo "Dev build finished"
elif [ $1 = "prod" ] || [ $1 = "stg" ]; then

    GAME_RELEASE_JS=$ENV_FOLDER/js/game.$VERSION.min.js
    #Combine all scenario file paths into one string
    SCENARIOS=""
    for file in $ENV_FOLDER/js/scenarios/*
        do
          if [ -f "$file" ];then
           SCENARIOS="$SCENARIOS $file"
          fi
        done


    #Compile using Typescript compiler
    $PATH_TO_TYPESCRIPT_COMPILER --outFile $ENV_FOLDER/js/game.js -p $PATH_TO_SOURCE --removeComments
    
    # Join all js (config + dictionary + game) and compress
    uglifyjs --compress --mangle --output $GAME_RELEASE_JS -- $ENV_FOLDER/js/game.js $ENV_FOLDER/js/config.js  $ENV_FOLDER/js/dictionary.js $SCENARIOS

    #Replace CDN placeholder with actual value
    if [ $1 = "stg" ]; then
        echo "Using local source"
        sed -i -- "s/{CDN}//g" $GAME_RELEASE_JS
    else
        echo "Using remote source"
        echo "Replacing CDN with $PROD_CDN in $GAME_RELEASE_JS"
        sed -i -- "s/{CDN}/http:\/\/uswest-23f4.kxcdn.com\//g" $GAME_RELEASE_JS
    fi
    sed -i -- "s/{VERSION}/$VERSION/g" $GAME_RELEASE_JS
    
    #Remove joined source files
    rm $ENV_FOLDER/js/game.js         
    rm $ENV_FOLDER/js/config.js         
    rm $ENV_FOLDER/js/dictionary.js         
    rm $ENV_FOLDER/js/lib/phaser.js    
    rm -R $ENV_FOLDER/js/scenarios    

fi

#Move assets
echo "Moving assets..."
cp -R -u $PATH_TO_SOURCE/../../assets $ENV_FOLDER/

for FILE in $ENV_FOLDER/assets/images/*
    do
     VERSION_STRING=".$VERSION."
     NEW_FILE="${FILE/./$VERSION_STRING}"
     mv $FILE $NEW_FILE;
    done


#Setting release file to index.html. Need to avoid unwanted caching
echo "Updating version in $ENV_FOLDER/index.html"
sed -i -- "s/{VERSION}/$VERSION/g" $ENV_FOLDER/index.html




if [ $1 = "dev" ];then
    echo "Dev build finished"
elif [ $1 = "prod" ]; then
    echo "Prod build finished"
elif [ $1 = "stg" ]; then
    echo "Stage build finished"
fi
