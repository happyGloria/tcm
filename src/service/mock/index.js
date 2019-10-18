
import Test from './sim/index.js'

function Mock (name, settings) {
  if (name in Test) {
    return new Promise((resolve, reject) => {
      var res = Test[name](settings.data)
      setTimeout(() => {
        if (res.retCode === -1) {
          reject(res)
        } else {
          resolve(res)
        }
      }, 800)
    })
  } else {
    console.log(`未找到${name}控制器`)
  }
}
export default Mock
