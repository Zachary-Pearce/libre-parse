#!/usr/bin/env bash

check_valid_param () {
    if [ ! -f "$1" ];
    then
        echo -e "\e[41mERROR\e[0m File '$1' does not exist"
        exit 1
    fi
}

if [[ -z $1 || $1 == "-h" || $1 == "--help" ]];
then
    echo "LibreParse - A parser generator for LL(1) grammars."
    echo
    echo "Usage: libre-parse [--options OPTIONS]"
    echo "                   generate [--input EBNF] [--output JSON]"
    echo "                   parse [--parser JSON] [--input INPUT]"
    echo
    echo "Commands:"
    echo "  generate        Generate a parser from a given syntax definition written in EBNF. Outputs a parse table, token RegEx's, and start symbol in a JSON format."
    echo "  parse           Parse a file of text using the parser defined in the input JSON file."
    echo
    echo "Options:"
    echo "  -h | --help     Display the help text."
    echo "  -p | --parser   Set the parser for the given command."
    echo "  -i | --input    Set the input file for the given command."
    echo "  -o | --output   Set the output file for the given command."
    exit 0
else
    case "$1" in
        "generate")
            inputParsed=false
            outputParsed=false
            while [[ $inputParsed == false || $outputParsed == false ]]; do
                case "$2" in
                    "-o" | "--output")
                        #TODO: fix this
                        #we don't need to check if this exists actually
                        #we just need to make sure one is provided
                        check_valid_param "$3"
                        output="$3"
                        outputParsed=true
                        shift 2
                        ;;
                    
                    "-i" | "--input")
                        check_valid_param "$3"
                        input="$3"
                        inputParsed=true
                        shift 2
                        ;;

                    *)
                        echo -e "\e[41mERROR\e[0m Invalid options"
                        exit 1
                        ;;
                esac
            done
            echo -e "\e[44mINFO\e[0m Executing generator..."
            echo -e "\e[44mINFO\e[0m Using file '$input'"
            node ./src/generator/index.js
            if [ $? -eq 0 ];
            then
                echo -e "\e[42mDONE\e[0m Result written to '$output'"
            else
                echo -e "\e[41mERROR\e[0m Generation failed"
            fi
            exit 0
            ;;

        "parse")
            #TODO: add a javascript thing here to parse the file and open some kind of ast visualiser
            #This wouldn't really have much of a use outside of testing
            exit 0
            ;;
        
        *)
            echo -e "\e[41mERROR\e[0m Invalid command '$1'"
            exit 1
            ;;
    esac
fi