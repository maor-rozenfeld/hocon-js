QUnit.test("parse basic", function(assert) {
  var obj = parseHocon('x : 5');
  assert.equal(obj.x, 5);;
});

QUnit.test("parse basic in braces", function(assert) {
  var obj = parseHocon('{ x : 5 }');
  assert.equal(obj.x, 5);;
});

QUnit.test("parse two fields by comma", function(assert) {
  var obj = parseHocon('{ x : 5, y : 6 }');
  assert.equal(obj.x, 5);;
  assert.equal(obj.y, 6);;
});

QUnit.test("parse two fields by newline", function(assert) {
  var obj = parseHocon('{ x : 5\r\n y : 6 }');
  assert.equal(obj.x, 5);;
  assert.equal(obj.y, 6);;
});

QUnit.test("parse object inside another object", function(assert) {
  var obj = parseHocon('{ x { y : 6 }}');
  assert.equal(obj.x.y, 6);;
});

QUnit.test("parse float", function(assert) {
  var obj = parseHocon('x : 2.1');
  assert.equal(obj.x, 2.1);;
});

QUnit.test("parse string", function(assert) {
  var obj = parseHocon('x : a2.1');
  assert.equal(obj.x, 'a2.1');;
});

QUnit.test("parse deep key", function(assert) {
  var obj = parseHocon('x.y.z : 300');
  assert.equal(obj.x.y.z, 300);;
});

QUnit.test("parse deep key with object val", function(assert) {
  var obj = parseHocon('x.y.z { a: \'hello\' , b: \'it\\\'s me\' }');
  assert.equal(obj.x.y.z.a, 'hello');;
  assert.equal(obj.x.y.z.b, 'it\'s me');;
});

QUnit.test("parse basic array", function(assert) {
  var obj = parseHocon('[2,5]');
  assert.equal(obj.length, 2);;
  assert.equal(obj[0], 2);;
  assert.equal(obj[1], 5);;
});

QUnit.test("parse array in field", function(assert) {
  var obj = parseHocon('x: [2,5]');
  assert.equal(obj.x.length, 2);;
  assert.equal(obj.x[0], 2);;
  assert.equal(obj.x[1], 5);;
});
// { x {  } }
QUnit.test("parse objects in array", function(assert) {
  var obj = parseHocon('{x:[\'a\',\'b\',{c:3},5]}');
  assert.equal(obj.x.length, 4);;
  assert.equal(obj.x[0], 'a');;
  assert.equal(obj.x[1], 'b');;
  assert.equal(obj.x[2].c, 3);;
  assert.equal(obj.x[3], 5);;
});

QUnit.test("parse objects in arrayx", function(assert) {
  var obj = parseHocon(`{x : [
  {
    c:3
  }
]}`);
  assert.equal(obj.x.length, 1);;
  assert.equal(obj.x[0].c, 3);;
});


QUnit.test('parse basic subtitutions', function(assert) {
  var obj = parseHocon('{ x: 5, y: ${x}}');
  assert.equal(obj.x, 5);;
  assert.equal(obj.y, 5);;
  console.log(obj);
});

QUnit.test('ignore comment', function(assert) {
  var obj = parseHocon(
    `{
      # this isn\'t a field
      x : 10  // This also isn\'t a field
    }`
  );
  assert.equal(obj.x, 10);;
  assert.equal(typeof obj['#'], 'undefined');;
});

QUnit.test('ignore comment same line', function(assert) {
  var obj = parseHocon(
    `{
      x : 10# this isn\'t a field
      y : 10 # this isn\'t a field
      // This is just another comment
    }`
  );
  assert.equal(obj.x, 10);;
  assert.equal(obj.y, 10);;
  assert.equal(typeof obj['#'], 'undefined');;
});



QUnit.test('extend rather than override', function(assert) {
  var obj = parseHocon(
    `{
      x.fudge { fudginess: 10, tastiness: 90 }
      x.fudge { fudginess: 100, softness: 40 }
    }`
  );
  assert.equal(obj.x.fudge.fudginess, 100);;
  assert.equal(obj.x.fudge.tastiness, 90);;
  assert.equal(obj.x.fudge.softness, 40);;
});
