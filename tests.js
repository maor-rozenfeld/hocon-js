QUnit.test("parse basic", function( assert ) {
  var obj = parseHocon('x : 5');
  assert.ok( obj.x === 5);
});

QUnit.test("parse basic in braces", function( assert ) {
  var obj = parseHocon('{ x : 5 }');
  assert.ok( obj.x === 5);
});

QUnit.test("parse two fields by comma", function( assert ) {
  var obj = parseHocon('{ x : 5, y : 6 }');
  assert.ok( obj.x === 5);
  assert.ok( obj.y === 6);
});

QUnit.test("parse two fields by newline", function( assert ) {
  var obj = parseHocon('{ x : 5\r\n y : 6 }');
  assert.ok( obj.x === 5);
  assert.ok( obj.y === 6);
});

QUnit.test("parse object inside another object", function( assert ) {
  var obj = parseHocon('{ x { y : 6 }}');
  assert.ok( obj.x.y === 6);
});

QUnit.test("parse float", function( assert ) {
  var obj = parseHocon('x : 2.1');
  assert.ok( obj.x === 2.1);
});

QUnit.test("parse string", function( assert ) {
  var obj = parseHocon('x : a2.1');
  assert.ok( obj.x === 'a2.1');
});

QUnit.test("parse deep key", function( assert ) {
  var obj = parseHocon('x.y.z : 300');
  assert.ok( obj.x.y.z === 300);
});

QUnit.test("parse deep key with object val", function( assert ) {
  var obj = parseHocon('x.y.z { a: \'hello\' , b: \'it\\\'s me\' }');
  assert.ok( obj.x.y.z.a === 'hello');
  assert.ok( obj.x.y.z.b === 'it\'s me');
});

QUnit.test("parse basic array", function( assert ) {
  var obj = parseHocon('[2,5]');
  assert.ok( obj.length === 2);
  assert.ok( obj[0] === 2);
  assert.ok( obj[1] === 5);
});

QUnit.test("parse array in field", function( assert ) {
  var obj = parseHocon('x: [2,5]');
  assert.ok( obj.x.length === 2);
  assert.ok( obj.x[0] === 2);
  assert.ok( obj.x[1] === 5);
});
// { x {  } }
QUnit.test("parse objects in array", function( assert ) {
  var obj = parseHocon('{x:[\'a\',\'b\',{c:3},5]}');
  assert.ok( obj.x.length === 4);
  assert.ok( obj.x[0] === 'a');
  assert.ok( obj.x[1] === 'b');
  assert.ok( obj.x[2].c === 3);
  assert.ok( obj.x[3] === 5);
});

QUnit.test('parse basic subtitutions', function( assert ) {
  var obj = parseHocon('{ x: 5, y: ${x}}');
  assert.ok(obj.x === 5);
  assert.ok(obj.y === 5);
  console.log(obj);
});

QUnit.test('ignore comment', function( assert ) {
  var obj = parseHocon(`{
      # this isn\'t a field
      x : 10
    }`);
  assert.ok(obj.x === 10);
  assert.ok(typeof obj['#'] === 'undefined');
});
