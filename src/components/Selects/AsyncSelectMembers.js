import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import PropTypes from 'prop-types'
import moreApi from 'src/api/more.api'

AsyncSelectMembers.propTypes = {
  onChange: PropTypes.func
}

function AsyncSelectMembers({ onChange, value, ...props }) {
  const getAllMembers = async (search, loadedOptions, { page }) => {
    const newPost = {
      _pi: page,
      _ps: 10,
      _key: search,
      Status: 0,
      _orders: {
        Id: true
      },
      _appends: {
        IsSchoolTeacher: 0
      },
      _ignoredf: ['Status']
    }
    const { data } = await moreApi.getAllTeacher(newPost)
    const { list, pcount } = data
    const newData =
      list && list.length > 0
        ? list.map(item => ({
            ...item,
            label: item.FullName,
            value: item.ID
          }))
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
      {...props}
      className="select-control"
      classNamePrefix="select"
      loadOptions={getAllMembers}
      placeholder="Chọn giáo viên"
      value={value}
      onChange={onChange}
      additional={{
        page: 1
      }}
      noOptionsMessage={({ inputValue }) => 'Không có giáo viên'}
    />
  )
}

export default AsyncSelectMembers
