import type { App } from 'vue'
import { effect, reactive } from 'vue'

//uv and pv
const getVisitor = (
  app: any,
  prefix: string,
  baseParams: {},
  includes?: string[],
  extenders?: string[]
) => {
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
    // console.log(extenders?.includes(path), includes?.includes(path), path)
    console.log(extenders)

    if ((extenders && extenders.includes(path)) || (includes.length && !includes.includes(path))) {
      console.log('aa')

      return
    }

    if (!TP)
      //间隔为0不上报
      return
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
  install: (app: App<Element>, options: IType, includes?: string[], extenders?: string[]) => {
    console.log(extenders)

    const { prefix, baseParams } = options
    getVisitor(app, prefix || 'track', baseParams || {}, includes, extenders)
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
