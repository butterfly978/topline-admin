import '@/vendor/gt'
export default function (options) {
  return new PromiseRejectionEvent((resolve, reject) => {
    window.initGeetest(options, captchaObj => {
      resolve(captchaObj)
    })
  })
}
