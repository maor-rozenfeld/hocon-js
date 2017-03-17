QUnit.test("parse basic", function(assert) {
  var obj = parseHocon('x : 5');
  assert.equal(obj.x, 5);
});

QUnit.test("parse basic in braces", function(assert) {
  var obj = parseHocon('{ x : 5 }');
  assert.equal(obj.x, 5);
});

QUnit.test("parse two fields by comma", function(assert) {
  var obj = parseHocon('{ x : 5, y : 6 }');
  assert.equal(obj.x, 5);
  assert.equal(obj.y, 6);
});

QUnit.test("parse two fields by newline", function(assert) {
  var obj = parseHocon('{ x : 5\r\n y : 6 }');
  assert.equal(obj.x, 5);
  assert.equal(obj.y, 6);
});

QUnit.test("parse nested object", function(assert) {
  var obj = parseHocon('{ x { y : 6 }}');
  assert.equal(obj.x.y, 6);
});

QUnit.test("parse float", function(assert) {
  var obj = parseHocon('x : 2.1');
  assert.equal(obj.x, 2.1);
});

QUnit.test("parse string", function(assert) {
  var obj = parseHocon('x : a2.1');
  assert.equal(obj.x, 'a2.1');
});

QUnit.test("parse deep key", function(assert) {
  var obj = parseHocon('x.y.z : 300');
  assert.equal(obj.x.y.z, 300);
});

QUnit.test("parse deep key with object val", function(assert) {
  var obj = parseHocon('x.y.z { a: \'hello\' , b: \'it\\\'s me\' }');
  assert.equal(obj.x.y.z.a, 'hello');
  assert.equal(obj.x.y.z.b, 'it\'s me');
});

QUnit.test("parse basic array", function(assert) {
  var obj = parseHocon('[2,5]');
  assert.equal(obj.length, 2);
  assert.equal(obj[0], 2);
  assert.equal(obj[1], 5);
});

QUnit.test("parse array in field", function(assert) {
  var obj = parseHocon('x: [2,5]');
  assert.equal(obj.x.length, 2);
  assert.equal(obj.x[0], 2);
  assert.equal(obj.x[1], 5);
});

QUnit.test("parse objects in array", function(assert) {
  var obj = parseHocon('{x:[\'a\',\'b\',{c:3},5]}');
  assert.equal(obj.x.length, 4);
  assert.equal(obj.x[0], 'a');
  assert.equal(obj.x[1], 'b');
  assert.equal(obj.x[2].c, 3);
  assert.equal(obj.x[3], 5);
});

QUnit.test("parse objects in arrayx", function(assert) {
  var obj = parseHocon(`{x : [
  {
    c:3
  }
]}`);
  assert.equal(obj.x.length, 1);
  assert.equal(obj.x[0].c, 3);
});

QUnit.test('parse array with trailing comma', function(assert) {
  var obj = parseHocon(`{x : [1,2,3,], y: 2}`);
  assert.equal(obj.x.length, 3);
  assert.equal(obj.x[0], 1);
  assert.equal(obj.x[1], 2);
  assert.equal(obj.x[2], 3);
  assert.equal(obj.y, 2);
});

QUnit.test('parse array with newline delimiter', function(assert) {
  var obj = parseHocon(`{
    a: [1
    2
    3]
  }`);
  assert.equal(Object.keys(obj).length, 1);
  assert.equal(obj.a.length, 3);
  assert.equal(obj.a[0], 1);
  assert.equal(obj.a[1], 2);
  assert.equal(obj.a[2], 3);
});

QUnit.test('multiple nested arrays', function(assert) {
  var obj = parseHocon(
    `{
    a: [[1,2], [9,8,7,6]],
    b: { x:1, y:[1, { c: [12, 34] }] }
  }`
  );
  assert.equal(Object.keys(obj).length, 2);
  assert.equal(obj.a.length, 2);
  assert.equal(obj.a[0].length, 2);
  assert.equal(obj.a[1].length, 4);
  assert.equal(obj.b.y[1].c.length, 2);
});

QUnit.test('parse basic substitutions', function(assert) {
  var obj = parseHocon('{ x: 5, y: ${x}}');
  assert.equal(obj.x, 5);
  assert.equal(obj.y, 5);
  console.log(obj);
});

QUnit.test('ignore comment', function(assert) {
  var obj = parseHocon(
    `{
      # this isn\'t a field
      x : 10  // This also isn\'t a field
    }`
  );
  assert.equal(obj.x, 10);
  assert.equal(typeof obj['#'], 'undefined');
});

QUnit.test('ignore comment same line', function(assert) {
  var obj = parseHocon(
    `{
      x : 10# this isn\'t a field
      y : 10 # this isn\'t a field
      // This is just another comment
    }`
  );
  assert.equal(obj.x, 10);
  assert.equal(obj.y, 10);
  assert.equal(typeof obj['#'], 'undefined');
});

QUnit.test('ignore quotes inside comment', function(assert) {
  var obj = parseHocon(
    `{
    a: 'This is a string', // here is "great" comment with 'quotes',
    b: 'and another str' # And 'yet' another comment
  }`
  );
  assert.equal(Object.keys(obj).length, 2);
  assert.equal(obj.a, 'This is a string');
  assert.equal(obj.b, 'and another str');
});

QUnit.test('extend rather than override', function(assert) {
  var obj = parseHocon(
    `{
      x.fudge { fudginess: 10, tastiness: 90 }
      x.fudge { fudginess: 100, softness: 40 }
    }`
  );
  assert.equal(obj.x.fudge.fudginess, 100);
  assert.equal(obj.x.fudge.tastiness, 90);
  assert.equal(obj.x.fudge.softness, 40);
});

QUnit.test('Parse URL fields correctly', function(assert) {
  var obj = parseHocon(
    `myUrl = 'http://www.hoconjs.com/kiss/my?zenthia=please#ok' //some comment`
  );
  assert.equal(obj.myUrl,
    'http://www.hoconjs.com/kiss/my?zenthia=please#ok');
});

QUnit.test('Multiline strings as values', function(assert) {
  var obj = parseHocon(
    `{
    a: """This is
a multiline string.
...and it even has some "quotes" in it."""
  }`
  );
  assert.equal(obj.a,
    'This is\na multiline string.\n...and it even has some "quotes" in it.'
  );
});

QUnit.test('String concatenation on array values without comma', function(
  assert) {
  var obj = parseHocon(`{
    a: [ 1 2 3 4 ]
  }`);
  assert.equal(obj.a.length, 1);
  assert.equal(obj.a[0], '1 2 3 4');
});
