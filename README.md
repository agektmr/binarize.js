# What is binarize.js?
binarize.js is a JavaScript library that converts any variable, array or object into binary format. This library is useful when you want to send and receive complex objects (especially when they include TypedArray) in ArrayBuffer format over WebSocket, XHR2, etc.  

## Why not Protocol Buffers nor MessagePack?
Although [Protocol Buffers](https://code.google.com/p/protobuf/) and [MessagePack](http://msgpack.org/) are widely used and have wider adoption in terms of implementation, their existing JS implementations don’t yet support TypedArray.  
Eventually when TypedArray is supported on either Protocol Buffers or MessagePack, you can replace binarize.js with them since they have similar API.  

# How do you use binarize.js?
    var typed = new Float64Array([1, Number.MAX_VALUE, Number.MIN_VALUE]);  
    var object = {  
      name: 'Eiji Kitamura',  
      array: [1, 2, 3],  
      object: {  
        name: 'Eiji Kitamura',  
        hello: 'こんにちは',  
        typed: typed  
      }  
    };  
  
    // convert a JavaScript object into ArrayBuffer  
    var buffer = binarize.pack(function(object) {  
      ...  
    });  
  
    // retrieve original object from ArrayBuffer  
    var original = binarize.unpack(function(buffer) {  
      ...  
    });  

## Supported Types
    NULL:          0,  
    UNDEFINED:     1,  
    STRING:        2,  
    NUMBER:        3,  
    BOOLEAN:       4,  
    ARRAY:         5,  
    OBJECT:        6,  
    INT8ARRAY:     7,  
    INT16ARRAY:    8,  
    INT32ARRAY:    9,  
    UINT8ARRAY:    10,  
    UINT16ARRAY:   11,  
    UINT32ARRAY:   12,  
    FLOAT32ARRAY:  13,  
    FLOAT64ARRAY:  14,  
    ARRAYBUFFER:   15,  
    BLOB:          16  
  

# Formats

## Null
Null header will have no payload.  
  
     type     byte_length  
    +--------+----------------+  
    |0x00    |0x0000          |  
    +--------+----------------+  

## Undefined
Undefined header will have no payload.  
  
     type     byte_length  
    +--------+----------------+  
    |0x01    |0x0000          |  
    +--------+----------------+  

## Strings
Strings header will be followed by sequence of characters in Uint32Array.  
  
    ex) hello  
     type     byte_length      payload  
    +--------+----------------+--------------------------------+  
    |0x02    |0x000a          |0x0068 (h)                      |  
    +--------+-------+--------+------++---------------+--------+------+  
    |0x0065 (e)                      |0x006c (l)                      |  
    +--------------------------------+--------------------------------+  
    |0x006c (l)                      |0x006f (o)                      |  
    +--------------------------------+--------------------------------+  

## Number
Number header will be followed by number in Float64Array.  
  
    ex) Number.MAX_VALUE  
     type     byte_length      payload  
    +--------+----------------+--------------------------------+  
    |0x03    |0x000e          |0x7fefffffffffffff              :  
    +--------+----------------+------+-------------------------+  
    :                                |  
    +--------------------------------+  

## Boolean
Boolean header will followed by     0x1 when     true,     0x0 when     false.  
  
    ex) true  
     type     byte_length      payload  
    +--------+----------------+--------+  
    |0x04    |0x0001          |0x01    |  
    +--------+----------------+--------+  

## Array
Array header will be followed by sequence of Array elements.  
  
    ex) [1, 2, 3]  
     type     length           byte_length  
    +--------+----------------+----------------+  
    |0x05    |0x0003          |0x21            |  
    +--------+----------------+--------------------------------+  
    |0x03    |0x000e          |0x0000000000000001              :  
    +--------+----------------+------+-------------------------+  
    :                                |  
    +--------+----------------+------+-------------------------+  
    |0x03    |0x000e          |0x0000000000000002              :  
    +--------+----------------+------+-------------------------+  
    :                                |  
    +--------+----------------+------+-------------------------+  
    |0x03    |0x000e          |0x0000000000000003              :  
    +--------+----------------+------+-------------------------+  
    :                                |  
    +--------------------------------+  

## Object
Object header will be followed by sequence of combinations of key in Strings type and value in arbitrary type.  
  
    ex) {‘name’: ‘Eiji Kitamura’, ‘hello’: ‘こんにちは’}  
     type     length           byte_length  
    +--------+----------------+----------------+  
    |0x06    |0x0002          |0x0042          |  
    +--------+----------------+----------------+----------------+  
    |0x02    |0x0010          |0x006e (n)      |0x0061 (a)      |  
    +--------+-------+--------+-------+--------+----------------+  
    |0x006d (m)      |0x0065 (e)      |0x02    |0x001a          |  
    +--------+-------+--------+-------+--------+----------------+  
    |0x0045 (E)      |0x0069 (i)      |0x006a (j)      |...  
    +----------------+----------------+----------------+--------+  

## Int8Array
Int8Array header will be followed by sequence of 8bit interger values.  
  
    ex) 1  
     type     byte_length      payload  
    +--------+----------------+--------+  
    |0x07    |0x0001          |0x01    |  
    +--------+----------------+--------+  

## Int16Array
Int16Array header will be followed by sequence of 16bit interger values.  
  
    ex) 16  
     type     byte_length      payload  
    +--------+----------------+----------------+  
    |0x08    |0x0002          |0x0010          |  
    +--------+----------------+----------------+  

## Int32Array
Int32Array header will be followed by sequence of 32bit interger values.  
  
    ex) 32  
     type     byte_length      payload  
    +--------+----------------+--------------------------------+  
    |0x09    |0x0004          |0x00000020                      |  
    +--------+----------------+--------------------------------+  

## Uint8Array
Uint8Array header will be followed by sequence of 8bit unsigned int values.  
  
    ex) 16  
     type     byte_length      payload  
    +--------+----------------+--------+  
    |0x0a    |0x0001          |0x10    |  
    +--------+----------------+--------+  

## Uint16Array
Uint16Array header will be followed by sequence of 16bit unsigned int values.  
  
    ex) 16  
     type     byte_length      payload  
    +--------+----------------+----------------+  
    |0x0b    |0x0002          |0x0010          |  
    +--------+----------------+----------------+  

## Uint32Array
Uint32Array header will be followed by sequence of 32bit unsigned int values.  
  
    ex) 32  
     type     byte_length      payload  
    +--------+----------------+--------------------------------+  
    |0x0c    |0x0004          |0x00000020                      |  
    +--------+----------------+--------------------------------+  

## Float32Array
Float32Array header will be followed by sequence of 32bit floating point values.  
  
    ex) 32  
     type     byte_length      payload  
    +--------+----------------+--------------------------------+  
    |0x0d    |0x0004          |0x00000020                      |  
    +--------+----------------+--------------------------------+  

## Float64Array
Float64Array header will be followed by sequence of 64bit floating point values.  
  
    ex) 64  
     type     byte_length      payload  
    +--------+----------------+--------------------------------+  
    |0x0e    |0x0008          |0x0000000000000040              :  
    +--------+----------------+------+-------------------------+  
    :                                |  
    +--------------------------------+  

## ArrayBuffer
ArrayBuffer header will be followed by sequence of 8bit unsigned int values.  
  
    ex) 16  
     type     byte_length      payload  
    +--------+----------------+--------+  
    |0x0f    |0x0001          |0x10    |  
    +--------+----------------+--------+  

## Blob
Blob header will be followed by a combination of  payload in ArrayBuffer type and MIME type in Strings type.  
  
    ex) a blob  
     type     byte_length  
    +--------+----------------+  
    |0x10    |0x0002          |  
    +--------+----------------+--------+--------+--------+--------+  
    |0x0f    |0x0010          |0x006e  |0x006e  |0x0061  |0x0061  |  
    +--------+--------+-------++-------++-------++-------++-------++  
    |0x006e  |0x006e  |0x0061  |0x0061  |0x006e  |0x006e  |0x0061  |  
    +--------+--------+--------+--------+--------+--------+--------+  
    |ArrayBuffer payload continuation...|  
    +--------+----------------+---------+------+----------------+  
    |0x02    |0x000a          |0x0069 (i)      |0x006d (m)      |  
    +--------+-------+--------+-------+--------+-------+--------+  
    |0x0061 (a)      |0x0067 (g)      |0x0065 (e)      |  
    +----------------+----------------+----------------+