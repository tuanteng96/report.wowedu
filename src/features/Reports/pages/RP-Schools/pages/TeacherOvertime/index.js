import React, { useEffect, useMemo, useState } from 'react'
import FilterSchool from 'src/components/Filter/FilterSchool'
import ReactTableV7 from 'src/components/Tables/ReactTableV7'
import IconMenuMobile from 'src/features/Reports/components/IconMenuMobile'
import { ArrayHeplers } from 'src/helpers/ArrayHeplers'
import { PermissionHelpers } from 'src/helpers/PermissionHelpers'
import { BrowserHelpers } from 'src/helpers/BrowserHelpers'
import reportsApi from 'src/api/reports.api'
import { uuidv4 } from '@nikitababko/id-generator'
import _ from 'lodash'
import Text from 'react-texty'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function TeacherOvertime(props) {
  const [ListData, setListData] = useState([])
  const [ColumnsAdd, setColumnsAdd] = useState([])
  const [loading, setLoading] = useState(false)
  const [PageCount, setPageCount] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)
  const [loadingExport, setLoadingExport] = useState(false)
  const [isFilter, setIsFilter] = useState(false)

  const [filters, setFilters] = useState({
    Pi: 1, // Trang hiện tại
    Ps: 15, // Số lượng item
    From: moment().startOf('month').toDate(),
    To: moment().endOf('month').toDate(),
    TeacherIDs: '',
    match: true
  })

  useEffect(() => {
    getListTeacherOvertime()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListTeacherOvertime = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    reportsApi
      .getListTeacherOvertime(BrowserHelpers.getRequestParamsSchools(filters))
      .then(({ data }) => {
        if (data.isRight) {
          PermissionHelpers.ErrorAccess(data.error)
          setLoading(false)
        } else {
          const { Items, Total, PCount, Columns } = {
            Items: data.result?.Items || [],
            Columns: data.result?.COT || [],
            Total: data.result?.Total || 0,
            PCount: data?.result?.PCount || 0
          }
          let crListData = Items.map(o => ({ ...o, IDs: uuidv4() }))
          let newListData = [
            ...Items.map((o, idx) => ({
              ...o,
              IDs: uuidv4(),
              rowIndex: idx,
              isRowIndex: true
            }))
          ]
          var i = -1
          for (let x of crListData) {
            const index = crListData.findIndex(o => o.MA_SO === x.MA_SO)
            if (x.MA_SO && index > -1) {
              const newObj = {
                ...x,
                HO_TEN: '',
                MA_SO: '',
                IDs: uuidv4(),
                rowIndex: '',
                isRowIndex: false,
                isText: true
              }
              if (i >= 0) {
                newListData.splice(index + i, 0, newObj)
              } else {
                newListData.push(newObj)
              }
              i++
            }
          }
          setListData(newListData)
          setColumnsAdd(Columns)
          setPageCount(PCount)
          setLoading(false)
          setPageTotal(Total)
          isFilter && setIsFilter(false)
          callback && callback()
          PermissionHelpers.HideErrorAccess()
        }
      })
      .catch(error => console.log(error))
  }

  const onOpenFilter = () => {
    setIsFilter(true)
  }

  const onHideFilter = () => {
    setIsFilter(false)
  }

  const onFilter = values => {
    if (_.isEqual(values, filters)) {
      onRefresh()
    } else {
      setFilters({ ...values, Pi: 1 })
    }
  }

  const onRefresh = () => {
    getListTeacherOvertime()
  }

  const onExport = () => {}

  const onPagesChange = ({ Pi, Ps }) => {
    setFilters({ ...filters, Pi, Ps })
  }

  const columns = useMemo(() => {
    let objColumns = [
      {
        key: 'index',
        keyIndex: 0,
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowData }) =>
          rowData.isRowIndex
            ? filters.Ps * (filters.Pi - 1) + (rowData.rowIndex + 1)
            : colSpanRender(rowData, 0),
        width: 60,
        sortable: false,
        align: 'center',
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'MA_SO',
        keyIndex: 1,
        title: 'Mã GV',
        dataKey: 'MA_SO',
        cellRenderer: ({ rowData }) =>
          rowData.MA_SO ? rowData.MA_SO : colSpanRender(rowData, 1),
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'HO_TEN',
        keyIndex: 2,
        title: 'Họ và tên',
        dataKey: 'HO_TEN',
        cellRenderer: ({ rowData }) =>
          rowData.MA_SO ? rowData.HO_TEN : colSpanRender(rowData, 2),
        width: 250,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      }
    ]
    if (ListData && ListData.length > 0) {
      if (ColumnsAdd && ColumnsAdd.length > 0) {
        const newList = []
        for (let [index, value] of ColumnsAdd.entries()) {
          const newObj = {
            key: uuidv4(),
            keyIndex: 2 + index,
            title: value.Date ? moment(value.Date).format('D') : value.Text,
            dataKey: uuidv4(),
            cellRenderer: ({ rowData }) => (
              <Text tooltipMaxWidth={300}>
                {!rowData.isText
                  ? rowData.COT[index].Total
                    ? rowData.COT[index].Total
                    : ''
                  : rowData.COT[index].Text}
              </Text>
            ),
            width: value.Date ? 100 : 150,
            align: 'center',
            sortable: false,
            KeyTitle: value.Date ? value.Text : ''
          }
          newList.push(newObj)
        }
        objColumns = ArrayHeplers.insertArrayAt(objColumns, 3, newList)
      }
    }

    return objColumns
  }, [filters, ListData, ColumnsAdd])

  const colSpanRender = (rowData, index) => {
    const idx = rowData.ColSpan
      ? rowData.ColSpan.findIndex(o => Number(o.ColBegin) === Number(index))
      : -1
    if (idx > -1) {
      return rowData.ColSpan[idx].Text
    }
    return ''
  }

  const headerRenderer = ({ cells, columns, headerIndex }) => {
    if (headerIndex === 0) {
      const GroupCell = []
      let WidthOffset = 0
      //WidthOffset
      columns.forEach((column, columnIndex) => {
        if (columnIndex <= 2) {
          WidthOffset += cells[columnIndex].props.style.width
        }
      })
      GroupCell.push(
        <div
          className="h-100 border-right"
          style={{ width: WidthOffset + 'px' }}
          key={uuidv4()}
        ></div>
      )

      columns.forEach((column, columnIndex) => {
        if (columnIndex > 2) {
          const width = cells[columnIndex].props.style.width
          GroupCell.push(
            <div
              className="h-100 border-right d-flex align-items-center justify-content-center"
              style={{ width: width + 'px' }}
              key={uuidv4()}
            >
              {column.KeyTitle}
            </div>
          )
        }
      })

      return GroupCell
    }
    return cells
  }

  // const rowRenderer = ({ rowData, rowIndex, cells, columns }) => {
  //   const colSpanIndex = 3
  //   let width = 200
  //   const style = {
  //     ...cells[colSpanIndex].props.style,
  //     width,
  //     backgroundColor: 'lightgray'
  //   }
  //   cells[colSpanIndex] = React.cloneElement(cells[colSpanIndex], { style })
  //   return cells
  // }

  return (
    <div className="py-main">
      <div className="subheader d-flex justify-content-between align-items-center">
        <div className="flex-1">
          <span className="text-uppercase text-uppercase font-size-xl fw-600">
            Giáo viên - Tăng ca
          </span>
        </div>
        <div className="w-85px d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary p-0 w-40px h-35px"
            onClick={onOpenFilter}
          >
            <i className="fa-regular fa-filters font-size-lg mt-5px"></i>
          </button>
          <IconMenuMobile />
        </div>
      </div>
      <FilterSchool
        show={isFilter}
        filters={filters}
        onHide={onHideFilter}
        onSubmit={onFilter}
        onRefresh={onRefresh}
        loading={loading}
        loadingExport={loadingExport}
        onExport={onExport}
      />
      <div className="bg-white rounded">
        <div className="px-20px py-15px border-bottom border-gray-200 d-flex align-items-center justify-content-between">
          <div className="fw-500 font-size-lg">
            Danh sách Giáo viên - Tăng ca
          </div>
        </div>
        <div className="p-20px">
          <ReactTableV7
            rowKey="IDs"
            filters={filters}
            columns={columns}
            data={ListData}
            loading={loading}
            pageCount={PageCount}
            onPagesChange={onPagesChange}
            headerHeight={[50, 50]}
            headerRenderer={headerRenderer}
            //rowRenderer={rowRenderer}
            // optionMobile={{
            //   CellModal: cell => OpenModalMobile(cell)
            // }}
          />
        </div>
      </div>
    </div>
  )
}

export default TeacherOvertime
