describe("binarize.js", function() {
  var originalObject, buffer, array, expectdArray, expectedHex, expectedView;
  var typed = new Float64Array([1, Number.MAX_VALUE, Number.MIN_VALUE]);

  var hex2buffer = function(hex) {
    var i = 0, cursor = 0, endianness = Test.BIG_ENDIAN;
    var length = 0;
    for (i = 0; i < hex.length; i = i + 2) {
      switch(hex[i]) {
        case 'Uint8':
        case 'Int8':
          length += 1;
          break;
        case 'Uint16':
        case 'Int16':
          length += 2;
          break;
        case 'Uint32':
        case 'Int32':
        case 'Float32':
          length += 4;
          break;
        case 'Float64':
          length += 8;
          break;
      }
    }
    var ab = new ArrayBuffer(length);
    var view = new DataView(ab);

    // Build expected ArrayBuffer
    for (i = 0; i < hex.length; i = i + 2) {
      view['set'+hex[i]](cursor, hex[i + 1], endianness);
      cursor += window[hex[i]+'Array'].BYTES_PER_ELEMENT;
    }

    return view.buffer;
  };

  describe("NULL", function() {
    beforeEach(function() {
      originalObject = null;
      expectedArray = [
        {
          type: Test.Types.NULL,
          length: 0,
          header_size: 5,
          byte_length: 0,
          value: originalObject
        }
      ];
      expectedHex = [
        'Uint8',    0,
        'Float64',   0
      ];
    });

    it("can serialize NULL", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });

    });

    it("can deserialize NULL", function() {
       Test.deserialize(buffer, function(deserialized) {
        expect(deserialized).toEqual(originalObject);
      });
    });
  });

  describe("UNDEFINED", function() {
    beforeEach(function() {
      originalObject = undefined;
      expectedArray = [
        {
          type: Test.Types.UNDEFINED,
          length: 0,
          header_size: 5,
          byte_length: 0,
          value: originalObject
        }
      ];
      expectedHex = [
        'Uint8',    0,
        'Float64',   0
      ];
    });

    it("can serialize UNDEFINED", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });
    });

    it("can deserialize UNDEFINED", function() {
      deserialized = Test.deserialize(buffer);
      expect(deserialized).toEqual(originalObject);
    });
  });

  describe("STRING", function() {
    beforeEach(function() {
      originalObject = 'Hello, this is えーじ';
      expectedArray = [
        {
          type: Test.Types.STRING,
          length: 18,
          header_size: 9,
          byte_length: 36,
          value: originalObject
        }
      ];
      expectedHex = [
        'Uint8',    Test.Types.STRING,  // STRING
        'Float64',  36,
        'Uint16',   'H'.charCodeAt(0),
        'Uint16',   'e'.charCodeAt(0),
        'Uint16',   'l'.charCodeAt(0),
        'Uint16',   'l'.charCodeAt(0),
        'Uint16',   'o'.charCodeAt(0),
        'Uint16',   ','.charCodeAt(0),
        'Uint16',   ' '.charCodeAt(0),
        'Uint16',   't'.charCodeAt(0),
        'Uint16',   'h'.charCodeAt(0),
        'Uint16',   'i'.charCodeAt(0),
        'Uint16',   's'.charCodeAt(0),
        'Uint16',   ' '.charCodeAt(0),
        'Uint16',   'i'.charCodeAt(0),
        'Uint16',   's'.charCodeAt(0),
        'Uint16',   ' '.charCodeAt(0),
        'Uint16',   'え'.charCodeAt(0),
        'Uint16',   'ー'.charCodeAt(0),
        'Uint16',   'じ'.charCodeAt(0)
      ];
    });

    it("can serialize STRING", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });
    });

    it("can deserialize STRING", function() {
      deserialized = Test.deserialize(buffer);
      expect(deserialized).toEqual(originalObject);
    });
  });

  describe("NUMBER", function() {
    beforeEach(function() {
      originalObject = Number.MAX_VALUE;
      expectedArray = [
        {
          type: Test.Types.NUMBER,
          length: 0,
          header_size: 9,
          byte_length: 8,
          value: originalObject
        }
      ];
      expectedHex = [
        'Uint8',    Test.Types.NUMBER,  // NUMBER
        'Float64',  8,
        'Float64',  originalObject
      ];
    });

    it("can serialize NUMBER", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });
    });

    it("can deserialize NUMBER", function() {
      deserialized = Test.deserialize(buffer);
      expect(deserialized).toEqual(originalObject);
    });
  });

  describe("BOOLEAN", function() {
    beforeEach(function() {
      originalObject = true;
      expectedArray = [
        {
          type: Test.Types.BOOLEAN,
          length: 0,
          header_size: 9,
          byte_length: 1,
          value: originalObject
        }
      ];
      expectedHex = [
        'Uint8',    Test.Types.BOOLEAN,  //BOOLEAN
        'Float64',  1,
        'Uint8',    1
      ];
    });

    it("can serialize BOOLEAN", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });
    });

    it("can deserialize BOOLEAN", function() {
      deserialized = Test.deserialize(buffer);
      expect(deserialized).toEqual(originalObject);
    });
  });

  describe("ARRAY", function() {
    beforeEach(function() {
      originalObject = [
        Number.MIN_VALUE,
        false,
        'test',
        null
      ];
      expectedArray = [
        {
          type: Test.Types.ARRAY,
          length: 4,
          header_size: 11,
          byte_length: 29,
          value: null
        },
        {
          type: Test.Types.NUMBER,
          length: 0,
          header_size: 9,
          byte_length: 8,
          value: originalObject[0]
        },
        {
          type: Test.Types.BOOLEAN,
          length: 0,
          header_size: 9,
          byte_length: 1,
          value: originalObject[1]
        },
        {
          type: Test.Types.STRING,
          length: 4,
          header_size: 9,
          byte_length: 8,
          value: originalObject[2]
        },
        {
          type: Test.Types.NULL,
          length: 0,
          header_size: 9,
          byte_length: 0,
          value: originalObject[3]
        }
      ];
      expectedHex = [
        'Uint8',    Test.Types.ARRAY,  //ARRAY
        'Float64',  4,                 // length
        'Uint16',   1,
        'Uint8',    Test.Types.NUMBER,
        'Float64',  8,
        'Float64',  Number.MIN_VALUE,
        'Uint8',    Test.Types.BOOLEAN,
        'Float64',  1,
        'Uint8',    0,                 // false
        'Uint8',    Test.Types.STRING,
        'Float64',  8,
        'Uint16',   't'.charCodeAt(0),
        'Uint16',   'e'.charCodeAt(0),
        'Uint16',   's'.charCodeAt(0),
        'Uint16',   't'.charCodeAt(0),
        'Uint8',    Test.Types.NULL,
        'Float64',  0
      ];
    });

    it("can serialize ARRAY", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });
    });

    it("can deserialize ARRAY", function() {
      deserialized = Test.deserialize(buffer);
      expect(deserialized).toEqual(originalObject);
    });
  });

  describe("INT8ARRAY", function() {
    beforeEach(function() {
      originalObject = new Int8Array([-127, 127, 64]);
      expectedArray = [
        {
          type: Test.Types.INT8ARRAY,
          length: 3,
          header_size: 9,
          byte_length: 3,
          value: [-127, 127, 64]
        }
      ];
      expectedHex = [
        'Uint8',    Test.Types.INT8ARRAY,  //INT8ARRAY
        'Float64',  3,                     // byte_length
        'Int8',     -127,
        'Int8',     127,
        'Int8',     64
      ];
    });

    it("can serialize INT8ARRAY", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });
    });

    it("can deserialize INT8ARRAY", function() {
      deserialized = Test.deserialize(buffer);
      expect(deserialized).toEqual(originalObject);
    });
  });

  describe("Complex Object", function() {
    beforeEach(function() {
      originalObject = {
        name: 'Eiji Kitamura',
        array: [1, 2, 3],
        object: {
          name: 'Eiji Kitamura',
          hello: 'こんにちは',
          typed: typed
        }
      };
      expectedArray = [
        {
          type: Test.Types.OBJECT, // 224
          length: 3,
          header_size: 11,
          byte_length: 217,
          value: null
        },
            {
              type: Test.Types.STRING, // 11
              length: 4,
              header_size: 9,
              byte_length: 8,
              value: 'name'
            },
            {
              type: Test.Types.STRING, // 29
              length: 13,
              header_size: 9,
              byte_length: 26,
              value: 'Eiji Kitamura'
            },
            {
              type: Test.Types.STRING, // 13
              length: 5,
              header_size: 9,
              byte_length: 10,
              value: 'array'
            },
            {
              type: Test.Types.ARRAY, // 38
              length: 3,
              header_size: 11,
              byte_length: 33,
              value: null
            },
                {
                  type: Test.Types.NUMBER, // 11
                  length: 0,
                  header_size: 9,
                  byte_length: 8,
                  value: 1
                },
                {
                  type: Test.Types.NUMBER, // 11
                  length: 0,
                  header_size: 9,
                  byte_length: 8,
                  value: 2
                },
                {
                  type: Test.Types.NUMBER, // 11
                  length: 0,
                  header_size: 9,
                  byte_length: 8,
                  value: 3
                },
            {
              type: Test.Types.STRING, // 15
              length: 6,
              header_size: 9,
              byte_length: 12,
              value: 'object'
            },
            {
              type: Test.Types.OBJECT, // 113
              length: 3,
              header_size: 11,
              byte_length: 106,
              value: null
            },
                {
                  type: Test.Types.STRING, // 11
                  length: 4,
                  header_size: 9,
                  byte_length: 8,
                  value: 'name'
                },
                {
                  type: Test.Types.STRING, // 29
                  length: 13,
                  header_size: 9,
                  byte_length: 26,
                  value: 'Eiji Kitamura'
                },
                {
                  type: Test.Types.STRING, // 13
                  length: 5,
                  header_size: 9,
                  byte_length: 10,
                  value: 'hello'
                },
                {
                  type: Test.Types.STRING, // 13
                  length: 5,
                  header_size: 9,
                  byte_length: 10,
                  value: 'こんにちは'
                },
                {
                  type: Test.Types.STRING, // 13
                  length: 5,
                  header_size: 9,
                  byte_length: 10,
                  value: 'typed'
                },
                {
                  type: Test.Types.FLOAT64ARRAY, // 29
                  length: 3,
                  header_size: 9,
                  byte_length: 24,
                  value: typed
                }
      ];
      expectedHex = [
        'Uint8',    6,          // OBJECT
        'Uint16',   3,          // length: 3
        'Uint16',   217,        // byte_length: 217
        'Uint8',    2,          // STRING
        'Uint16',   8,          // byte_length: 8
        'Uint16',   0x006e,     // 'n'
        'Uint16',   0x0061,     // 'a'
        'Uint16',   0x006d,     // 'm'
        'Uint16',   0x0065,     // 'e'
        'Uint8',    2,          // STRING
        'Uint16',   26,         // byte_length: 26
        'Uint16',   0x0045,     // 'E'
        'Uint16',   0x0069,     // 'i'
        'Uint16',   0x006a,     // 'j'
        'Uint16',   0x0069,     // 'i'
        'Uint16',   0x0020,     // ' '
        'Uint16',   0x004b,     // 'K'
        'Uint16',   0x0069,     // 'i'
        'Uint16',   0x0074,     // 't'
        'Uint16',   0x0061,     // 'a'
        'Uint16',   0x006d,     // 'm'
        'Uint16',   0x0075,     // 'u'
        'Uint16',   0x0072,     // 'r'
        'Uint16',   0x0061,     // 'a'
        'Uint8',    2,          // STRING
        'Uint16',   10,         // byte_length: 16
        'Uint16',   0x0061,     // 'a'
        'Uint16',   0x0072,     // 'r'
        'Uint16',   0x0072,     // 'r'
        'Uint16',   0x0061,     // 'a'
        'Uint16',   0x0079,     // 'y'
        'Uint8',    5,          // ARRAY
        'Uint16',   3,          // length: 3
        'Uint16',   33,         // byte_length: 33
        'Uint8',      3,        // NUMBER
        'Uint16',     8,        // byte_length: 8
        'Float64',    1,        // 1
        'Uint8',      3,        // NUMBER
        'Uint16',     8,        // byte_length: 8
        'Float64',    2,        // 2
        'Uint8',      3,        // NUMBER
        'Uint16',     8,        // byte_length: 8
        'Float64',    3,        // 3
        'Uint8',    2,          // STRING
        'Uint16',   12,         // byte_length: 24
        'Uint16',   0x006f,     // 'o'
        'Uint16',   0x0062,     // 'b'
        'Uint16',   0x006a,     // 'j'
        'Uint16',   0x0065,     // 'e'
        'Uint16',   0x0063,     // 'c'
        'Uint16',   0x0074,     // 't'
        'Uint8',    6,          // OBJECT
        'Uint16',   3,          // length: 2
        'Uint16',   106,        // byte_length: 106
        'Uint8',      2,        // STRING
        'Uint16',     8,        // byte_length: 8
        'Uint16',     0x006e,     // 'n'
        'Uint16',     0x0061,     // 'a'
        'Uint16',     0x006d,     // 'm'
        'Uint16',     0x0065,     // 'e'
        'Uint8',      2,          // STRING
        'Uint16',     26,         // byte_length: 26
        'Uint16',     0x0045,     // 'E'
        'Uint16',     0x0069,     // 'i'
        'Uint16',     0x006a,     // 'j'
        'Uint16',     0x0069,     // 'i'
        'Uint16',     0x0020,     // ' '
        'Uint16',     0x004b,     // 'K'
        'Uint16',     0x0069,     // 'i'
        'Uint16',     0x0074,     // 't'
        'Uint16',     0x0061,     // 'a'
        'Uint16',     0x006d,     // 'm'
        'Uint16',     0x0075,     // 'u'
        'Uint16',     0x0072,     // 'r'
        'Uint16',     0x0061,     // 'a'
        'Uint8',      2,          // STRING
        'Uint16',     10,         // byte_length: 10
        'Uint16',     0x0068,     // 'h'
        'Uint16',     0x0065,     // 'e'
        'Uint16',     0x006c,     // 'l'
        'Uint16',     0x006c,     // 'l'
        'Uint16',     0x006f,     // 'o'
        'Uint8',      2,          // STRING
        'Uint16',     10,         // byte_length: 10
        'Uint16',     0x3053,     // 'こ'
        'Uint16',     0x3093,     // 'ん'
        'Uint16',     0x306b,     // 'に'
        'Uint16',     0x3061,     // 'ち'
        'Uint16',     0x306f,     // 'は'
        'Uint8',      2,          // STRING
        'Uint16',     10,         // byte_length: 10
        'Uint16',     0x0074,     // 't'
        'Uint16',     0x0079,     // 'y'
        'Uint16',     0x0070,     // 'p'
        'Uint16',     0x0065,     // 'e'
        'Uint16',     0x0064,     // 'd'
        'Uint8',      14,         // FLOAT64ARRAY
        'Uint16',     24,         // byte_length: 24
        'Float64',    1,          // 1
        'Float64',    Number.MAX_VALUE,
        'Float64',    Number.MIN_VALUE
      ];
    });

    it("can serialize object", function() {
      expectedBuffer = hex2buffer(expectedHex);

      Test.serialize(originalObject, function(array) {
console.log(array);
        expect(array).toEqual(expectedArray);
        buffer = Test.pack(array);
        expect(buffer).toEqual(expectedBuffer);
      });

    });

    it("can deserialize object", function() {
      var deserialized = Test.deserialize(buffer);
      console.log(deserialized);
    });
  });
});
