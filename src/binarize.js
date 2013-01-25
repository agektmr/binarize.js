/*
Copyright 2013 Eiji Kitamura

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Eiji Kitamura (agektmr@gmail.com)
*/
(function(global) {
  var debug = false;

  var BIG_ENDIAN    = false,
      LITTLE_ENDIAN = true,
      TYPE_LENGTH   = Uint8Array.BYTES_PER_ELEMENT,
      LENGTH_LENGTH = Uint16Array.BYTES_PER_ELEMENT,
      BYTES_LENGTH  = Uint16Array.BYTES_PER_ELEMENT;

  var Types = {
    NULL:          0,
    UNDEFINED:     1,
    STRING:        2,
    NUMBER:        3,
    BOOLEAN:       4,
    ARRAY:         5,
    OBJECT:        6,
    INT8ARRAY:     7,
    INT16ARRAY:    8,
    INT32ARRAY:    9,
    UINT8ARRAY:    10,
    UINT16ARRAY:   11,
    UINT32ARRAY:   12,
    FLOAT32ARRAY:  13,
    FLOAT64ARRAY:  14
  };

  var Length = [
    null,             // Types.NULL
    null,             // Types.UNDEFINED
    'Uint16',         // Types.STRING
    'Float64',        // Types.NUMBER
    'Uint8',          // Types.BOOLEAN
    null,             // Types.ARRAY
    null,             // Types.OBJECT
    'Int8',           // Types.INT8ARRAY
    'Int16',          // Types.INT16ARRAY
    'Int32',          // Types.INT32ARRAY
    'Uint8',          // Types.UINT8ARRAY
    'Uint16',         // Types.UINT16ARRAY
    'Uint32',         // Types.UINT32ARRAY
    'Float32',        // Types.FLOAT32ARRAY
    'Float64'         // Types.FLOAT64ARRAY
  ];

  /**
   * packs seriarized elements array into a packed ArrayBuffer
   * @param  {Array} serialized Serialized array of elements.
   * @return {ArrayBuffer} packed binary data
   */
  var pack = function(serialized) {
    var cursor = 0, i = 0, j = 0, endianness = BIG_ENDIAN;

    var ab = new ArrayBuffer(serialized[0].byte_length + serialized[0].header_size);
    var view = new DataView(ab);

    for (i = 0; i < serialized.length; i++) {
      var type        = serialized[i].type,
          length      = serialized[i].length,
          value       = serialized[i].value,
          byte_length = serialized[i].byte_length,
          type_name   = Length[type],
          unit        = type_name === null ? 0 : global[type_name+'Array'].BYTES_PER_ELEMENT;

      // Set type
      view.setUint8(cursor, type, endianness);
      cursor += TYPE_LENGTH;

      // Set length if required
      if (type === Types.ARRAY || type === Types.OBJECT) {
        view.setUint16(cursor, length, endianness);
        cursor += LENGTH_LENGTH;
      }

      // Set byte length
      view.setUint16(cursor, byte_length, endianness);
      cursor += BYTES_LENGTH;

      switch(type) {
        case Types.NULL:
        case Types.UNDEFINED:
          // NULL and UNDEFINED doesn't have any payload
          break;

        case Types.STRING:
          for (j = 0; j < length; j++, cursor += unit) {
            view['set'+type_name](cursor, value.charCodeAt(j), endianness);
          }
          break;

        case Types.NUMBER:
        case Types.BOOLEAN:
          view['set'+type_name](cursor, value, endianness);
          cursor += unit;
          break;

        case Types.INT8ARRAY:
        case Types.INT16ARRAY:
        case Types.INT32ARRAY:
        case Types.UINT8ARRAY:
        case Types.UINT16ARRAY:
        case Types.UINT32ARRAY:
        case Types.FLOAT32ARRAY:
        case Types.FLOAT64ARRAY:
          for (j = 0; j < length; j++, cursor += unit) {
            view['set'+type_name](cursor, value[j], endianness);
          }
          break;

        case Types.ARRAY:
        case Types.OBJECT:
          break;

        default:
          throw 'Type Error: Unexpected type found.';
      }
    }

    return view.buffer;
  };

  /**
   * Unpack binary data into an object with value and cursor
   * @param  {DataView} view [description]
   * @param  {Number} cursor [description]
   * @return {Object}
   */
  var unpack = function(view, cursor) {
    var i = 0, endianness = BIG_ENDIAN;
    var type, length, byte_length, value, elem;

    // Retrieve "type"
    type = view.getUint8(cursor, endianness);
    cursor += TYPE_LENGTH;

    // Retrieve "length"
    if (type === Types.ARRAY || type === Types.OBJECT) {
      length = view.getUint16(cursor, endianness);
      cursor += LENGTH_LENGTH;
    }

    // Retrieve "byte_length"
    byte_length = view.getUint16(cursor, endianness);
    cursor += BYTES_LENGTH;

    var type_name = Length[type];
    var unit = type_name === null ? 0 : global[type_name+'Array'].BYTES_PER_ELEMENT;

    switch(type) {
      case Types.NULL:
      case Types.UNDEFINED:
        // NULL and UNDEFINED doesn't have any octet
        value = null;
        break;

      case Types.STRING:
        length = byte_length / unit;
        var string = [];
        for (i = 0; i < length; i++) {
          var code = view['get'+type_name](cursor, endianness);
          cursor += unit;
          string.push(String.fromCharCode(code));
        }
        value = string.join('');
        break;

      case Types.NUMBER:
      case Types.BOOLEAN:
        value = view['get'+type_name](cursor, endianness);
        cursor += unit;
        break;

      case Types.INT8ARRAY:
      case Types.INT16ARRAY:
      case Types.INT32ARRAY:
      case Types.UINT8ARRAY:
      case Types.UINT16ARRAY:
      case Types.UINT32ARRAY:
      case Types.FLOAT32ARRAY:
      case Types.FLOAT64ARRAY:
        elem = [];
        length = byte_length / unit;
        for (i = 0; i < length; i++, cursor += unit) {
          elem.push(view['get'+type_name](cursor, endianness));
        }
        value = new global[type_name+'Array'](elem);
        break;

      case Types.ARRAY:
        value = [];
        for (i = 0; i < length; i++) {
          // Retrieve array element
          elem = unpack(view, cursor);
          cursor = elem.cursor;
          value.push(elem.value);
        }
        break;

      case Types.OBJECT:
        value = {};
        for (i = 0; i < length; i++) {
          // Retrieve object key and value in sequence
          var key = unpack(view, cursor);
          var val = unpack(view, key.cursor);
          cursor = val.cursor;
          value[key.value] = val.value;
        }
        break;

      default:
        throw 'Type Error: Type not supported.';
    }

    return {
      value: value,
      cursor: cursor
    };
  };

  /**
   * Serializes object and return byte_length
   * @param  {mixed} obj JavaScript object you want to serialize
   * @return {Array} Serialized array object
   */
  var serialize = function(obj) {
    var type_name = obj && obj.constructor.name.toUpperCase(),
        subarray = [], unit = 1,
        header_size = TYPE_LENGTH + BYTES_LENGTH,
        type, byte_length = 0, length = 0, value = obj;

    if (!type_name) {
      if (typeof obj === 'undefined') {
        type = Types.UNDEFINED;
      } else {
        type = Types.NULL;
      }

    } else {
      // Retrieve type number
      type = Types[type_name];
      unit = Length[type] === null ? 0 : global[Length[type]+'Array'].BYTES_PER_ELEMENT;

      switch(type) {
        case Types.NUMBER:
        case Types.BOOLEAN:
          byte_length += unit;
          break;

        case Types.STRING:
          byte_length += obj.length * unit;
          length = obj.length;
          break;

        case Types.INT8ARRAY:
        case Types.INT16ARRAY:
        case Types.INT32ARRAY:
        case Types.UINT8ARRAY:
        case Types.UINT16ARRAY:
        case Types.UINT32ARRAY:
        case Types.FLOAT32ARRAY:
        case Types.FLOAT64ARRAY:
          byte_length += obj.length * unit;
          length = obj.length;
          break;

        case Types.ARRAY:
          for (var i = 0; i < obj.length; i++, length++) {
            var elem = serialize(obj[i]);
            subarray.push(elem[0]);
            byte_length += elem[0].header_size + elem[0].byte_length;
          }
          length = obj.length;
          header_size += LENGTH_LENGTH;
          value = null;
          break;

        case Types.OBJECT:
          for (var key in obj) {
            var map_byte_length = 0;
            var key_obj = serialize(key);
            var val_obj = serialize(obj[key]);
            map_byte_length = key_obj[0].byte_length + key_obj[0].header_size +
                              val_obj[0].byte_length + val_obj[0].header_size;
            subarray = subarray.concat(key_obj, val_obj);
            byte_length += map_byte_length;
            length++;
          }
          header_size += LENGTH_LENGTH;
          value = null;
          break;

        default:
          throw 'Type Error: Type not supported.';
      }
    }

    var result = [{
      type: type,
      length: length,
      header_size: header_size,
      byte_length: byte_length,
      value: value
    }].concat(subarray);

    return result;
  };

  /**
   * Deserialize binary and return JavaScript object
   * @param  ArrayBuffer buffer ArrayBuffer you want to deserialize
   * @return mixed              Retrieved JavaScript object
   */
  var deserialize = function(buffer) {
    var view = new DataView(buffer);
    var result = unpack(view, 0);
    return result.value;
  };

  global.Test = {
    BIG_ENDIAN: BIG_ENDIAN,
    LITTLE_ENDIAN: LITTLE_ENDIAN,
    Types: Types,
    pack: pack,
    unpack: unpack,
    serialize: serialize,
    deserialize: deserialize
  };

  global.binarize = {
    pack: function(obj) {
      var result = null;
      try {
        result = pack(serialize(obj));
      } catch(e) {
        throw e;
      }
      return result;
    },
    unpack: function(buffer) {
      var result = null;
      try {
        result = deserialize(buffer);
      } catch(e) {
        throw e;
      }
      return result;
    }
  };
})(this);