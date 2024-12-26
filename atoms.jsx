import { atom } from 'recoil'

import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

// const iTabsState = atom({
//     key: 'iTabs', // unique ID (with respect to other atoms/selectors)
//     default: 'evaluation', // default value (aka initial value)
//     effects_UNSTABLE: [persistAtom] // persist state even after refresh
// })

const toastState = atom({
    key: 'error', // unique ID (with respect to other atoms/selectors)
    default: { text: '', type: '' } // default value (aka initial value)
})

//export iTabsState and sTabsState
export {
    toastState,
}
