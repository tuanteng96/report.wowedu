import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      thunk: true
    })
  ]
})

export default store
