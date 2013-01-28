beforeEach(function() {
  this.addMatchers({
    toBeIdenticalObjectAs: function(expected) {
      var result = true;

      // Both items are same
      if (this.actual == expected) {
        return true;

      // Both items are totally different
      } else if (typeof this.actual !== typeof expected) {
        return false;

      // Both items are at least same type
      } else {
        var type_name = this.actual && this.actual.constructor.name.toUpperCase();
        var type = Test.Types[type_name];
        switch(type) {
          case Test.Types.NULL:
          case Test.Types.UNDEFINED:
          case Test.Types.STRING:
          case Test.Types.NUMBER:
          case Test.Types.BOOLEAN:
            // This shouldn't happen
            console.error('Unexpected route: Tester has a bug.');
            result = false;
            break;

          case Test.Types.ARRAY:
            console.error('Array tester not implemented');
            break;

          case Test.Types.OBJECT:
            console.error('Object tester not implemented');
            break;

          case Test.Types.INT8ARRAY:
          case Test.Types.INT16ARRAY:
          case Test.Types.INT32ARRAY:
          case Test.Types.UINT8ARRAY:
          case Test.Types.UINT16ARRAY:
          case Test.Types.UINT32ARRAY:
          case Test.Types.FLOAT32ARRAY:
          case Test.Types.FLOAT64ARRAY:
            console.error('TypedArray tester not implemented');
            break;

          case Test.Types.ARRAYBUFFER:
            console.error('ArrayBuffer tester not implemented');
            break;

          case Test.Types.BLOB:
            console.error('Blob tester not implemented');
            break;

          default:
            console.error('Unexpected Type');
            break;
        }
      }
    },
    toBeIdenticalArrayAs: function(expected) {
      console.log('actual:', this.actual);
      console.log('expected:', expected);

      var result = true;
      // Loop through result array
      if (this.actual && this.actual.length !== expected.length) {
        console.error('length of array is different.');
        return false;
      }
      for (var i = 0; i < expected.length; i++) {
        // Check if metadata is identical
        if (this.actual[i].type         === expected[i].type &&
            this.actual[i].header_size  === expected[i].header_size &&
            this.actual[i].byte_length  === expected[i].byte_length &&
            this.actual[i].length       === expected[i].length) {
          // Check if .value is identical
          if (this.actual[i].value === expected[i].value) {
            continue;
          } else {
            // Loop through .value array
            for (var j = 0; j < expected[i].value.length; j++) {
              if (!this.actual[i].value[j]) return false;
              // Check if value element is identical
              if (this.actual[i].value[j] === expected[i].value[j]) {
                continue;
              } else {
                console.error('one of', this.actual[i], 'value differs against expected', expected[i], 'on index of', i);
                result = false;
                continue;
              }
            }
          }
          continue;
        } else {
          console.error('one of', this.actual[i], 'metadata differs against expected', expected[i], 'on index of', i);
          result = false;
          continue;
        }
      }
      return result;
    },
    toBeIdenticalBufferAs: function(expected) {
      var result = true;
      var endianness = Test.BIG_ENDIAN;
      // Test byte length
      if (this.actual && this.actual.byteLength !== expected.byteLength) {
        console.error('length of buffer is different');
        result = false;
      }

      var expectedView = new DataView(expected);
      var actualView = new DataView(this.actual);

      // Test each payload
      var expectedBytes = [];
      var actualBytes = [];
      for (var i = 0; i < expectedView.byteLength; i++) {
        var expectedByte = expectedView.getUint8(i, endianness);
        expectedBytes.push(expectedByte.toString(16)+' ');

        var actualByte = actualView.getUint8(i, endianness);
        actualBytes.push(actualByte.toString(16)+' ');

        if (expectedByte !== actualByte) {
          console.error(i, 'th byte is', actualByte, 'whereas expected to be', expectedByte);
          result = false;
        }
      }
      console.log('actualBytes:', '0x'+actualBytes.join(' 0x'));
      console.log('expectedBytes:', '0x'+expectedBytes.join(' 0x'));
      return result;
    }
  });
});
