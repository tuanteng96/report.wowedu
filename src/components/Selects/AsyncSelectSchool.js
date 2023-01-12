import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import moreApi from 'src/api/more.api'

function AsyncSelectSchool(props) {
  const getAllSchool = async (search, loadedOptions, { page }, level) => {
    const newPost = {
      _key: search,
      _pi: page,
      _ps: 10,
      _orders: {
        Id: true
      }
    }

    if (level) {
      newPost.LevelJson = `~${level.value}`
    }

    const { data } = await moreApi.getAllSchool(newPost)
    const { list, pcount } = data
    const newData =
      list && list.length > 0
        ? list.map(item => ({ ...item, label: item.Title, value: item.ID }))
        : []
    return {
      options: newData,
      hasMore: page < pcount,
      additional: {
        page: page + 1
      }
    }
  }
  return (
    <AsyncPaginate
      isClearable={true}
      {...props}
      classNamePrefix="select"
      loadOptions={getAllSchool}
      additional={{
        page: 1
      }}
    />
  )
}

export default AsyncSelectSchool
