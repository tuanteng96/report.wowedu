import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import PropTypes from 'prop-types'
import moreApi from 'src/api/more.api'

AsyncSelectProducts.propTypes = {
  onChange: PropTypes.func
}

function AsyncSelectProducts({ onChange, value, ...props }) {
  const getAllProducts = async (search, loadedOptions, { page }) => {
    const { data } = await moreApi.getAllProducts(search)
    const newData =
      data.data && data.data.length > 0
        ? data.data.map(item => ({
            ...item,
            label: item.text,
            value: item.id
          }))
        : []
    return {
      options: newData,
      hasMore: false,
      additional: {
        page: 1
      }
    }
  }

  return (
    <AsyncPaginate
      {...props}
      className="select-control"
      classNamePrefix="select"
      loadOptions={getAllProducts}
      placeholder="Chọn SP, DV, NVL, ..."
      value={value}
      onChange={onChange}
      additional={{
        page: 1
      }}
      noOptionsMessage={({ inputValue }) => 'Không có dữ liệu'}
    />
  )
}

export default AsyncSelectProducts
