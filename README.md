
This is a very basic [Hocon](https://github.com/typesafehub/config/blob/master/HOCON.md) parser written in JavaScript.

It does almost no validation whatsoever but can create an object from most hocon files.

Please feel free to contribute with PRs.

Usage:
```var obj = parseHocon(someHoconText);```

## Example Output

**Input Hocon string:**

```
  myConfig.cool.numb: 5
  myConfig.cool.stuff: {
     x : quotesarebadmmkay
     z : {
       yes: 'no not really'
     }
  }
  myConfig.cool.stuff { z { no='yes yes really' } }
  myConfig.dupe: ${myConfig.cool.stuff.x}
  meinarr [2,3, {x:haha}]
  meinobj {hocon: issoweirdman}
  notherobj : ${meinobj.hocon}
```

**Output object:**
```
{
  "myConfig": {
    "cool": {
      "numb": 5,
      "stuff": {
        "x": "quotesarebadmmkay",
        "z": {
          "yes": "no not really",
          "no": "yes yes really"
        }
      }
    },
    "dupe": "quotesarebadmmkay"
  },
  "meinarr": [2, 3, {
    "x": "haha"
  }],
  "meinobj": {
    "hocon": "issoweirdman"
  },
  "notherobj": "issoweirdman"
}
```

## Features

| Feature | Completion  | Example
|-----|-----|
| Objects | :white_check_mark: | `myKey { myOtherKey: 'myValue' }`
| Arrays | :white_check_mark: | `myKey [1,2,3,4]`
| Comments | :white_check_mark: | `// some comment` `# some comment`
| `=` and `:` Separators | :white_check_mark: | `myKey='myValue'`
| Unquoted Strings | :white_check_mark: | `myKey: myString`
| Multiline Strings (`"""`) |  :white_check_mark: | `myKey: """what's happening"""`
| Path Expressions |  :white_check_mark: | `myRoot.myKey.someKey : 4`
| Substitutions |  :white_check_mark: | `myKey: $(myRoot.myKey)`
| Objects Merging | :x: | |
| Value Concatenation | :x: | |
| `include` | :x: | | |
