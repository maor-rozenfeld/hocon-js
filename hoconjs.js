function parseHocon(text) {
    var index = 0;
    return readHocon(text);

    function readHocon(hoconText) {
        var isInQuotes = false;
        var quotesType = '';
        var isEscaping = false;

        var isInCurly = false;
        var isInArray = false;
        var isReadingValue = false;
        var isReadSeperator = false;
        var currentKey = '';
        var currentValue = '';
        var obj = {};
        while(index < hoconText.length) {
            var c = hoconText[index];
            index++;

            if (!isEscaping && (c === '\'' || c === '"')) {
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

            if (isInQuotes && c === '\\') {
              isEscaping = true;
              continue;
            }

            isEscaping = false;

            if (!isInQuotes)
            switch(c) {
              case ' ':
              case '\t':
              case '\r':
              case '\n': {
                if (!currentKey)
                  continue;

                if (!isReadingValue) {
                  isReadingValue = true;
                  continue;
                }

                if (isReadingValue && currentValue)
                {
                  setValue();
                  continue;
                }

                continue;
              }
              case '{': {
                if (isInCurly || isInArray || currentKey)
                {
                    index--;
                    currentValue = readHocon(hoconText);
                    setValue();
                    continue;
                }

                isInCurly = true;
                continue;
              }
              case '}': {
                if (!isInCurly)
                    throw 'What';

                if (currentValue)
                  setValue();

                return obj;
              }
              case ':':
              case '=': {
                if (isReadSeperator)
                  throw 'Already met seperator';
                isReadingValue = true;
                isReadSeperator = true;
                continue;
              }
              case ',': {
                if (isReadingValue && currentValue)
                  setValue();
                continue;
              }
              case '[': {
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
              case ']': {
                if (!isInArray)
                  throw 'not in an array';
                setValue();
                return obj;
              }
            }

            if (isReadingValue)
                currentValue += c;
            else
                currentKey += c;
        }
        if (isInCurly)
          throw 'Expected closing curly bracket';

        if (isInArray)
          throw 'Expected closing square bracket';

        if (isReadingValue) {
          setValue();
        }
        return obj;

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
              currentValue = parseInt(currentValue);
            else if (/^\d+\.\d+$/.test(currentValue))
              currentValue = parseFloat(currentValue);
          }

          if (isInArray) {
            objt.push(currentValue);
          }
          else {
            objt[key] = currentValue;
            isReadingValue = false;
          }
          isReadSeperator = false;
          currentKey = '';
          currentValue = '';
        }
    }
};
