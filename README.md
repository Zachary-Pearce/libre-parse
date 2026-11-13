# LibreParse
LibreParse is an open and approachable parser generator for LL(1) grammars. It accepts a formal grammar written in EBNF and generates a parse table and set of token regular expressions, which can then be used to tokenize and parse any text.

The code has been kept as simple as possible without compromising performance. You won't find any unnecessary features here.

## Installation
LibreParse is published as an npm package with the same name as this repository, `libre-parse`. Use the following command to install it:

```bash
npm install libre-parse
```

After installation, you can import it into your javascript project:

```javascript
const libreParse = require('libre-parse');
```

## Usage
LibreParse is written in JavaScript as it was primarily designed to be used as a module in web-based code editors. You can also use it as a standalone tool through the provided [bash script](./libre-parse.sh).

The bash script has two functions:

* Generate - Runs the parser generator to create a parse table and tokenizers from an EBNF definition. All information is written to a json file. See an example command below:

```bash
bash libre-parse.sh generate -i ./grammar.ebnf -o ./output.json
```

* Parse - Parse a structured text file using a given parser, the resulting syntax tree is displayed using a visualizer tool. See an example command below:

```bash
bash libre-parse.sh parse -i ./program.asm -p ./parser.json
```

## Resources
Included in this repository is detailed documentation that shows how to use LibreParse as well as provide foundational knowledge on language grammars and parsing techniques. If you are new to languages and parsing but want to learn how it works, check out the [documentation](./docs/) to get started.