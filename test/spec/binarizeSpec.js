describe("ObjectSerializer", function() {
  var originalObject, buffer, array, expectdArray, expectedHex;
  var typed = new Float64Array([1, Number.MAX_VALUE, Number.MIN_VALUE]);

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
        header_size: 5,
        byte_length: 217,
        value: null
      },
          {
            type: Test.Types.STRING, // 11
            length: 4,
            header_size: 3,
            byte_length: 8,
            value: 'name'
          },
          {
            type: Test.Types.STRING, // 29
            length: 13,
            header_size: 3,
            byte_length: 26,
            value: 'Eiji Kitamura'
          },
          {
            type: Test.Types.STRING, // 13
            length: 5,
            header_size: 3,
            byte_length: 10,
            value: 'array'
          },
          {
            type: Test.Types.ARRAY, // 38
            length: 3,
            header_size: 5,
            byte_length: 33,
            value: null
          },
              {
                type: Test.Types.NUMBER, // 11
                length: 1,
                header_size: 3,
                byte_length: 8,
                value: 1
              },
              {
                type: Test.Types.NUMBER, // 11
                length: 1,
                header_size: 3,
                byte_length: 8,
                value: 2
              },
              {
                type: Test.Types.NUMBER, // 11
                length: 1,
                header_size: 3,
                byte_length: 8,
                value: 3
              },
          {
            type: Test.Types.STRING, // 15
            length: 6,
            header_size: 3,
            byte_length: 12,
            value: 'object'
          },
          {
            type: Test.Types.OBJECT, // 113
            length: 3,
            header_size: 5,
            byte_length: 106,
            value: null
          },
              {
                type: Test.Types.STRING, // 11
                length: 4,
                header_size: 3,
                byte_length: 8,
                value: 'name'
              },
              {
                type: Test.Types.STRING, // 29
                length: 13,
                header_size: 3,
                byte_length: 26,
                value: 'Eiji Kitamura'
              },
              {
                type: Test.Types.STRING, // 13
                length: 5,
                header_size: 3,
                byte_length: 10,
                value: 'hello'
              },
              {
                type: Test.Types.STRING, // 13
                length: 5,
                header_size: 3,
                byte_length: 10,
                value: 'こんにちは'
              },
              {
                type: Test.Types.STRING, // 13
                length: 5,
                header_size: 3,
                byte_length: 10,
                value: 'typed'
              },
              {
                type: Test.Types.FLOAT64ARRAY, // 29
                length: 3,
                header_size: 3,
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
    var i = 0, cursor = 0, endianness = Test.BIG_ENDIAN;
    var length = 0;
    for (i = 0; i < expectedHex.length; i = i + 2) {
      switch(expectedHex[i]) {
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
    var expectedView = new DataView(ab);

    // Build expected ArrayBuffer
    for (i = 0; i < expectedHex.length; i = i + 2) {
      expectedView['set'+expectedHex[i]](cursor, expectedHex[i + 1], endianness);
      cursor += window[expectedHex[i]+'Array'].BYTES_PER_ELEMENT;
    }

    array = Test.serialize(originalObject);
    expect(array).toBeIdenticalArrayAs(expectedArray);

    buffer = Test.pack(array);
    expect(buffer).toBeIdenticalBufferAs(expectedView.buffer);
  });

  it("can deserialize object", function() {
    // var hex = expectedHex.join('');
    // var view = new DataView(new ArrayBuffer(hex.length));
    // TODO: Test with endian in consideration
    // for (var i = 0; i < hex.length; i++) {
    //   view.setUint8(i, parseInt(hex[i], 16), Test.BIG_ENDIAN);
    // }

    var deserialized = Test.deserialize(buffer);
    // expect(deserialized).toBeIdenticalArrayAs(originalObject);
    console.log(deserialized);
  });
});
