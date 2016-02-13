#!/bin/sh

DEV_ENV_FOLDER="$PATH_TO_ENV_FOLDER/$1"

echo "Compiller path $PATH_TO_TYPESCRIPT_COMPILER"
echo "Dest folder $DEV_ENV_FOLDER"
echo "Source path $PATH_TO_SOURCE"

#Clean up folder
#Clean up folder
rm -rf $DEV_ENV_FOLDER/*

#Move Libs
echo "Moving config and libs..."
mkdir $DEV_ENV_FOLDER/js
cp -R -u $PATH_TO_SOURCE/../js/* $DEV_ENV_FOLDER/js
cp -R -u $PATH_TO_SOURCE/../build/$1/index.html $DEV_ENV_FOLDER/

# Compile source
echo "Compilling sources..."
if [ $1 = "dev" ];then
    $PATH_TO_TYPESCRIPT_COMPILER --outDir $DEV_ENV_FOLDER/js -p $PATH_TO_SOURCE --removeComments
    echo "Dev build finished"
elif [ $1 = "prod" ]; then
    $PATH_TO_TYPESCRIPT_COMPILER --outFile $DEV_ENV_FOLDER/js/game.js -p $PATH_TO_SOURCE --removeComments
    uglifyjs --compress --mangle --output $DEV_ENV_FOLDER/js/game.min.js -- $DEV_ENV_FOLDER/js/game.js $DEV_ENV_FOLDER/js/config.js $DEV_ENV_FOLDER/js/dictionary.js
    rm $DEV_ENV_FOLDER/js/game.js         
    rm $DEV_ENV_FOLDER/js/config.js         
    rm $DEV_ENV_FOLDER/js/dictionary.js         
    rm $DEV_ENV_FOLDER/js/lib/phaser.js         
    echo "Prod build finished"
fi

#Move assets
echo "Moving assets..."
cp -R -u $PATH_TO_SOURCE/../../assets $DEV_ENV_FOLDER/


if [ $1 = "dev" ];then
    echo "Dev build finished"
elif [ $1 = "prod" ]; then
    echo "Prod build finished"
fi
