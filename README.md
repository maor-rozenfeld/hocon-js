
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
          "yes": "no not really"
        }
      }
    },
    "dupe": "quotesarebadmmkay"
  },
  "meinarr": [
    2,
    3,
    {
      "x": "haha"
    }
  ],
  "meinobj": {
    "hocon": "issoweirdman"
  },
  "notherobj": "issoweirdman"
}
```

## Missing features
* Multiline comments
* Syntax errors *(it may parse things that shouldn't be parsed)*
* Merging objects
* Other advanced stuff
