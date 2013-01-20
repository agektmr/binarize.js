beforeEach(function() {
  this.addMatchers({
    toBeIdenticalObjectAs: function(expectedObject) {
      return true;
    },
    toBeIdenticalArrayAs: function(expectedArray) {
      console.log('actual:', this.actual);
      console.log('expected:', expectedArray);

      var result = true;
      // Loop through result array
      if (this.actual.length !== expectedArray.length) {
        console.error('length of array is different.');
        return false;
      }
      for (var i = 0; i < expectedArray.length; i++) {
        // Check if metadata is identical
        if (this.actual[i].type         === expectedArray[i].type &&
            this.actual[i].header_size  === expectedArray[i].header_size &&
            this.actual[i].byte_length  === expectedArray[i].byte_length &&
            this.actual[i].length       === expectedArray[i].length) {
          // Check if .value is identical
          if (this.actual[i].value === expectedArray[i].value) {
            continue;
          } else {
            // Loop through .value array
            for (var j = 0; j < expectedArray[i].value.length; j++) {
              if (!this.actual[i].value[j]) return false;
              // Check if value element is identical
              if (this.actual[i].value[j] === expectedArray[i].value[j]) {
                continue;
              } else {
                console.error('one of', this.actual[i], 'value differs against expected', expectedArray[i], 'on index of', i);
                result = false;
                continue;
              }
            }
          }
          continue;
        } else {
          console.error('one of', this.actual[i], 'metadata differs against expected', expectedArray[i], 'on index of', i);
          result = false;
          continue;
        }
      }
      return result;
    },
    toBeIdenticalBufferAs: function(expectedBuffer) {
      var result = true;
      var endianness = Test.BIG_ENDIAN;
      // Test byte length
      if (this.actual.byteLength !== expectedBuffer.byteLength) {
        console.error('length of buffer is different');
        result = false;
      }

      var expectedView = new DataView(expectedBuffer);
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
