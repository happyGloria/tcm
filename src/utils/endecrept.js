let CryptoJS = require('crypto-js')
/* var key = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')
var iv = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')
var enc = CryptoJS.AES.encrypt(src, key, {
  iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
})
return  */

function encodeAesString (data, key = 'abcdef0123456789', iv = 'abcdef0123456789') {
  key = CryptoJS.enc.Hex.parse(key)
  iv = CryptoJS.enc.Hex.parse(iv)
  var enc = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return enc.ciphertext.toString()
}

function decodeAesString (encrypted, key = 'abcdef0123456789', iv = 'abcdef0123456789') {
  key = CryptoJS.enc.Hex.parse(key)
  iv = CryptoJS.enc.Hex.parse(iv)
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// 测试加、解密
/* function testAES () {
  var data = '明文 123 abc' // 明文
  var key = 'abcdef0123456789' // 密钥 长度16
  var iv = 'abcdef0123456789' // 密钥 长度16
  console.log('加密前：' + data)
  // 测试加密
  var encrypted = encodeAesString(data, key, iv) // 密文
  console.log('加密后: ' + encrypted)

  var decryptedStr = decodeAesString(encrypted, key, iv)
  console.log('解密后: ' + decryptedStr)
}
 */
function Encrpt (src) {
  console.log('src:', src)
  var key = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')
  var iv = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')
  var enc = CryptoJS.AES.encrypt(src, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return enc.ciphertext.toString()
}

export {
  encodeAesString,
  decodeAesString,
  Encrpt
}

