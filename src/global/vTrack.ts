import type { App } from 'vue'
import { effect, reactive } from 'vue'

//uv and pv
const getVisitor = (app: any, prefix: string, baseParams: {}) => {
  const globalProperties = reactive(app.config.globalProperties)
  // const globalProperties = app.config.globalProperties
  let startTime = new Date().getTime()
  let lastPath = ''
  let path = ''
  effect(() => {
    const endTime = new Date().getTime()
    const TP = endTime - startTime
    startTime = endTime
    lastPath = path

    path = globalProperties.$route.path
    //间隔为0不上报
    if (!TP) return
    console.log({
      ...baseParams,
      UPVEventName: `${prefix}_${path}`
    })
    //页面停留时长小于0.5s不上报
    if (TP < 500) return
    console.log({
      ...baseParams,
      TP: {
        path: lastPath,
        time: TP
      }
    })
  })
}

interface IType {
  prefix: string
  baseParams: any
}

export default {
  install: (app: App<Element>, options: IType) => {
    const { prefix, baseParams } = options
    getVisitor(app, prefix || 'track', baseParams || {})
    app.directive('click', {
      mounted: (el, bind) => {
        el.addEventListener('click', () => {
          console.log({ ...bind.value, ...(baseParams || {}) })
        })
      }
    })
    app.config.globalProperties.$VTrack = (params: any) => {
      console.log(params, 'params')
    }
  }
}
