function parseHocon(text) {
  var index = 0;
  var result = readHocon(text);
  return handleSubtitutions(result);

  function readHocon(hoconText) {
    var isInQuotes = false;
    var quotesType = '';
    var isEscaping = false;

    var isInCurly = false;
    var isInArray = false;
    var isReadingValue = false;
    var isReadSeperator = false;
    var isInlineComment = false;
    var possibleComment = false;
    var isInMultilineString = false;
    var currentKey = '';
    var currentValue = '';
    var obj = {};

    while (index < hoconText.length) {
      var c = hoconText[index];
      index++;

      if (isInlineComment && !isInMultilineString) {
        if (c === '\r' || c === '\n') {
          isInlineComment = false;
        }
        continue;
      }

      if (!isEscaping && c === '"') {
        if ((index + 1 < hoconText.length) && hoconText[index] === '"' &&
          hoconText[index + 1] === '"') {
          if (isInMultilineString) {
            setValue();
            isInMultilineString = false;
            isInQuotes = false;
            isReadingValue = false;
            index += 2;
            // TODO: if this is followed by another quote, then it's not over..
            continue;
          }

          isInMultilineString = true;
          isInQuotes = true;
          isReadingValue = true;
          index += 2;
          continue;
        }
      }

      if (!isEscaping && !isInMultilineString && (c === '\'' || c === '"')) {
        if (isInQuotes && quotesType === c) {
          if (isReadingValue)
            setValue();
          else {
            isReadingValue = true;
          }
          isInQuotes = false;
          continue;
        }

        isInQuotes = true;
        quotesType = c;
        continue;
      }

      if (isInMultilineString && escapeInMultiLine(c)) {
        currentValue += c;
        continue;
      }

      if (isInQuotes && c === '\\') {
        isEscaping = true;
        continue;
      }

      isEscaping = false;

      if (!isInQuotes)
        switch (c) {
          case ' ':
            {
              if (currentValue === '')
                continue;
              if (isInArray && isReadingValue) {
                currentValue += c;
                continue;
              }
            }
          case '\t':
          case '\r':
          case '\n':
            {
              if (isInArray && isReadingValue) {
                if (currentValue === '')
                  continue;

                setValue();
                continue;
              }

              if (!currentKey)
                continue;

              if (!isReadingValue) {
                isReadingValue = true;
                continue;
              }

              if (isReadingValue && currentValue) {
                setValue();
                continue;
              }

              continue;
            }
          case '{':
            {
              if (isInCurly || isInArray || currentKey) {
                index--;
                currentValue = readHocon(hoconText);
                setValue();
                continue;
              }

              isInCurly = true;
              continue;
            }
          case '}':
            {
              if (!isInCurly)
                throw 'What';

              if (currentValue)
                setValue();
              else if (currentKey)
                return currentKey;

              return obj;
            }
          case ':':
          case '=':
            {
              if (isReadSeperator)
                throw 'Already met seperator';
              isReadingValue = true;
              isReadSeperator = true;
              continue;
            }
          case ',':
            {
              if (isReadingValue && currentValue)
                setValue();
              continue;
            }
          case '[':
            {
              if (isInCurly || isInArray || currentKey) {
                index--;
                currentValue = readHocon(hoconText);
                setValue();
                continue;
              }
              isReadingValue = true;
              isInArray = true;
              obj = [];
              continue;
            }
          case ']':
            {
              if (!isInArray)
                throw 'not in an array';

              if (currentValue) {
                currentValue = currentValue.trim();
                setValue();
              }

              return obj;
            }
          case '$':
            {
              if (!currentValue) {
                currentValue = '${' + readHocon(hoconText) + '}';
                setValue();
                continue;
              }
              break;
            }
          case '#':
            {
              isInlineComment = true;
              continue;
            }
          case '/':
            {
              if (possibleComment) {
                isInlineComment = true;
                possibleComment = false;
                continue;
              }
              possibleComment = true;
              continue;
            }
        }

      if (isReadingValue) {
        currentValue += c;
      } else {
        currentKey += c;
      }
    }
    if (isInCurly)
      throw 'Expected closing curly bracket';

    if (isInArray)
      throw 'Expected closing square bracket';

    if (isReadingValue) {
      setValue();
    }
    return obj;

    function escapeInMultiLine(char) {
      return ['"', '\\'].indexOf(char) !== -1;
    }

    function setValue(key, objt) {
      var key = key || currentKey;
      var objt = objt || obj;
      var dotIndex = key.indexOf('.');
      if (!isInArray && dotIndex > 0) {
        var partKey = key.substring(0, dotIndex);
        objt[partKey] = objt[partKey] || {};
        setValue(key.substring(dotIndex + 1), objt[partKey]);
        return;
      }

      if (!isInQuotes) {
        if (/^\d+$/.test(currentValue))
          if (Array.isArray(currentValue))
            currentValue = [parseInt(currentValue)];
          else
            currentValue = parseInt(currentValue);
        else if (/^\d+\.\d+$/.test(currentValue))
          if (Array.isArray(currentValue))
            currentValue = [parseFloat(currentValue)];
          else
            currentValue = parseFloat(currentValue);
      }

      if (isInArray) {
        objt.push(currentValue);
      } else {
        if (typeof objt[key] === 'object' && typeof currentValue === 'object')
          extend(objt[key], currentValue)
        else
          objt[key] = currentValue;
        isReadingValue = false;
      }
      isReadSeperator = false;
      currentKey = '';
      currentValue = '';
    }
  }

  function handleSubtitutions(mainObj, intermidiateObj, loops) {
    intermidiateObj = typeof intermidiateObj === 'undefined' ? mainObj :
      intermidiateObj;
    if (intermidiateObj == null)
      return intermidiateObj;

    if (Array.isArray(intermidiateObj)) {
      intermidiateObj.forEach(function(element, index) {
        intermidiateObj[index] = handleSubtitutions(mainObj, element);
      });
    } else if (typeof intermidiateObj === 'string') {
      var match = /^\$\{(.+?)\}$/.exec(intermidiateObj);
      if (match && match.length == 2) {
        return eval('mainObj.' + match[1]);
      }
    } else if (typeof intermidiateObj === 'object') {
      Object.keys(intermidiateObj).forEach(function(key, index) {
        intermidiateObj[key] = handleSubtitutions(mainObj, intermidiateObj[
          key]);
      });
    }

    return intermidiateObj;
  }

  function extend() {
    for (var i = 1; i < arguments.length; i++)
      for (var key in arguments[i])
        if (arguments[i].hasOwnProperty(key)) {
          if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] ===
            'object')
            extend(arguments[0][key], arguments[i][key]);
          else
            arguments[0][key] = arguments[i][key];
        }
    return arguments[0];
  }
};
