#!/usr/bin/env bash

echo -e "\e[44mINFO\e[0m Running tests..."

cd ../test/
for file in *; do
    echo $file
    if [ -f "$file" ];
    then
        node $file
    fi
done

echo -e "\e[44mINFO\e[0m Testing complete"