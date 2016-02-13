#!/bin/sh

ENV_FOLDER="$PATH_TO_ENV_FOLDER/$1"

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
    
    echo "Dev build finished"
elif [ $1 = "prod" ]; then
    #Compile using Typescript compiler
    $PATH_TO_TYPESCRIPT_COMPILER --outFile $ENV_FOLDER/js/game.js -p $PATH_TO_SOURCE --removeComments
    
    # Join all js (config + dictionary + game) and compress
    uglifyjs --compress --mangle --output $ENV_FOLDER/js/game.min.js -- $ENV_FOLDER/js/game.js $ENV_FOLDER/js/config.js $ENV_FOLDER/js/dictionary.js
    
    #Remove joined source files
    rm $ENV_FOLDER/js/game.js         
    rm $ENV_FOLDER/js/config.js         
    rm $ENV_FOLDER/js/dictionary.js         
    rm $ENV_FOLDER/js/lib/phaser.js    
    
    #Replace CDN placeholder with actual value
    echo "Replacing CDN with $PROD_CDN in $ENV_FOLDER/js/game.min.js"
    sed -i -- "s/{CDN}/http:\/\/uswest-23f4.kxcdn.com\//g" $ENV_FOLDER/js/game.min.js
    echo "Prod build finished"
fi

#Move assets
echo "Moving assets..."
cp -R -u $PATH_TO_SOURCE/../../assets $ENV_FOLDER/


if [ $1 = "dev" ];then
    echo "Dev build finished"
elif [ $1 = "prod" ]; then
    echo "Prod build finished"
fi
