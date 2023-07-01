import React, { useEffect, useMemo, useState } from 'react'
import FilterSchool from 'src/components/Filter/FilterSchool'
import ReactTableV7 from 'src/components/Tables/ReactTableV7'
import IconMenuMobile from 'src/features/Reports/components/IconMenuMobile'
import { PermissionHelpers } from 'src/helpers/PermissionHelpers'
import { BrowserHelpers } from 'src/helpers/BrowserHelpers'
import reportsApi from 'src/api/reports.api'
import { uuidv4 } from '@nikitababko/id-generator'
import _ from 'lodash'
import Text from 'react-texty'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const converArray = (items, columns) => {
  if (!items) return []
  const newArrays = []
  const types = ['VANTAY', 'LICH', 'PHEP', 'CONG']
  for (let [index, obj] of items.entries()) {
    for (let [idx, type] of types.entries()) {
      const newObj = {
        ...obj,
        Ids: uuidv4(),
        Type: type,
        rowIndex: index,
        hideIndex: idx !== 0,
        CD1: obj.CD1[type],
        SD1: obj.SD1[type]
      }
      if (idx !== 0) {
        for (let clm of columns) {
          if (
            typeof clm.Text === 'string' &&
            clm.Text !== 'SD1' &&
            clm.Text !== 'CD1'
          ) {
            delete newObj[clm.Key]
          }
        }
      }
      newArrays.push(newObj)
    }
  }
  return newArrays
}

function Timekeeping(props) {
  const [ListData, setListData] = useState([])
  const [ColumnsAdd, setColumnsAdd] = useState([])
  const [loading, setLoading] = useState(false)
  const [PageCount, setPageCount] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)
  const [loadingExport, setLoadingExport] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [filters, setFilters] = useState({
    Pi: 1, // Trang hiện tại
    Ps: 15, // Số lượng item
    From: moment().startOf('month').toDate(),
    To: moment().endOf('month').toDate(),
    TeacherIDs: ''
  })

  useEffect(() => {
    getListTimekeepings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListTimekeepings = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    reportsApi
      .getListTimekeeping(BrowserHelpers.getRequestParamsSchools(filters))
      .then(({ data }) => {
        if (data.isRight) {
          PermissionHelpers.ErrorAccess(data.error)
          setLoading(false)
        } else {
          const { Items, Total, PCount, Columns } = {
            Items: data.result?.Items || [],
            Columns: data.result?.Header || [],
            Total: data.result?.Items.length || 0,
            PCount: data?.result?.PCount || 0
          }
          setListData(converArray(Items, Columns))
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
    getListTimekeepings()
  }

  const onExport = () => {
    PermissionHelpers.ExportExcel({
      FuncStart: () => setLoadingExport(true),
      FuncEnd: () => setLoadingExport(false),
      FuncApi: () =>
        reportsApi.getListTimekeeping(
          BrowserHelpers.getRequestParamsSchools(filters, {
            Total: PageTotal
          })
        ),
      UrlName: '/bao-cao/gv-cham-cong'
    })
  }

  const onPagesChange = ({ Pi, Ps }) => {
    setFilters({ ...filters, Pi, Ps })
  }

  const columns = useMemo(() => {
    let objColumns = [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowData }) => {
          return !rowData.hideIndex
            ? filters.Ps * (filters.Pi - 1) + (rowData.rowIndex + 1)
            : ''
        },
        width: 60,
        sortable: false,
        align: 'center',
        mobileOptions: {
          visible: true
        },
        className: 'fw-600'
      },
      {
        key: 'MNV',
        title: 'Mã GV',
        dataKey: 'MNV',
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'fw-600'
      },
      {
        key: 'Ho_Ten',
        title: 'Họ và tên',
        dataKey: 'Ho_Ten',
        width: 250,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'fw-600',
        frozen: frozen
      },
      {
        key: 'Type',
        title: '',
        dataKey: 'Type',
        width: 150,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'fw-600 font-size-sm justify-content-center'
      },
      {
        key: 'SD1',
        title: 'SD1',
        dataKey: 'SD1',
        width: 150,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'fw-600 font-size-sm justify-content-center'
      },
      {
        key: 'CD1',
        title: 'CD1',
        dataKey: 'CD1',
        width: 150,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'fw-600 font-size-sm justify-content-center'
      }
    ]
    if (ColumnsAdd && ColumnsAdd.length > 0) {
      const ColumnsAddSlice = ColumnsAdd.slice(5, ColumnsAdd.length - 1)

      for (let [index, clm] of ColumnsAddSlice.entries()) {
        if (clm.Text && typeof clm.Text === 'string') {
          objColumns.push({
            key: clm.Key,
            title: clm.Text,
            dataKey: clm.Key,
            width: 150,
            sortable: false,
            className: 'fw-600 font-size-sm justify-content-center'
          })
        } else {
          objColumns.push({
            key: 'VAN_TAY' + index,
            title: clm.Text.Text,
            titleKey: clm.Text.Num,
            dataKey: 'VAN_TAY_1',
            width: 100,
            sortable: false,
            headerObj: clm,
            cellRenderer: ({ rowData }) => {
              if (rowData.Type === 'CONG') {
                return (
                  <Text tooltipMaxWidth={280} className="text-truncate">
                    {rowData.Items[index] &&
                      (rowData.Items[index].S['CONG_TEXT'] ||
                        rowData.Items[index].S[rowData.Type])}
                  </Text>
                )
              }
              return (
                <Text tooltipMaxWidth={280} className="text-truncate">
                  {rowData.Items[index] && rowData.Items[index].S[rowData.Type]}
                </Text>
              )
            },
            className: 'fw-600 font-size-sm justify-content-center'
          })
          objColumns.push({
            key: 'VAN_TAY_' + index,
            title: clm.Text.Text,
            titleKey: clm.Text.Num,
            dataKey: 'VAN_TAY_2',
            width: 100,
            sortable: false,
            headerRemove: true,
            cellRenderer: ({ rowData }) => {
              if (rowData.Type === 'CONG') {
                return (
                  <Text tooltipMaxWidth={280} className="text-truncate">
                    {rowData.Items[index] &&
                      (rowData.Items[index].C['CONG_TEXT'] ||
                        rowData.Items[index].C[rowData.Type])}
                  </Text>
                )
              }
              return (
                <Text tooltipMaxWidth={280} className="text-truncate">
                  {rowData.Items[index] && rowData.Items[index].C[rowData.Type]}
                </Text>
              )
            },
            className: 'fw-600 font-size-sm justify-content-center'
          })
        }
      }
    }
    return objColumns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, ListData, ColumnsAdd, frozen])

  const headerRenderer = ({ cells, columns, headerIndex }) => {
    if (headerIndex === 0) {
      let GroupCell = []
      let indexObj = columns.findIndex(x => x.headerObj)
      let countLength = columns.findIndex(x => x.headerObj || x.headerRemove)
      columns.forEach((column, columnIndex) => {
        //columnIndex >= indexObj && columnIndex < countLength + indexObj
        if (column.headerObj || column.headerRemove) {
          let width = cells[columnIndex].props.style.width
          GroupCell.push(
            <div
              className="h-100 border-right d-flex align-items-center justify-content-center"
              style={{ width: width + 'px' }}
              key={uuidv4()}
            >
              {column.titleKey}
            </div>
          )
        } else {
          let width = cells[columnIndex].props.style.width
          GroupCell.push(
            <div
              className="border-right d-flex align-items-center justify-content-center px-10px text-center"
              style={{
                alignSelf: 'flex-start',
                zIndex: 1,
                background: '#f8f8f8',
                width: width + 'px',
                height: '99px'
              }}
              key={uuidv4()}
            >
              {column.title}
            </div>
          )
        }
      })

      return GroupCell
    } else {
      let GroupCell = []
      columns.forEach((column, columnIndex) => {
        if (!column.headerRemove) {
          let width = cells[columnIndex].props.style.width
          if (column.headerObj) {
            width = width * 2
          }
          GroupCell.push(
            <div
              className="h-100 border-right d-flex align-items-center justify-content-center"
              style={{ width: width + 'px' }}
              key={uuidv4()}
            >
              {column.title}
            </div>
          )
        }
      })
      return GroupCell
    }
  }

  return (
    <div className="py-main">
      <div className="subheader d-flex justify-content-between align-items-center">
        <div className="flex-1">
          <span className="text-uppercase text-uppercase font-size-xl fw-600">
            Giáo viên chấm công
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
            Danh sách Giáo viên chấm công
          </div>
        </div>
        <div className="p-20px">
          <ReactTableV7
            rowKey="Ids"
            filters={filters}
            columns={columns}
            data={ListData}
            loading={loading}
            pageCount={PageCount}
            onPagesChange={onPagesChange}
            headerHeight={[50, 50]}
            headerRenderer={headerRenderer}
            onScroll={({ scrollLeft }) => {
              if (scrollLeft > 182) {
                setFrozen(true)
              } else {
                setFrozen(false)
              }
            }}
            // optionMobile={{
            //   CellModal: cell => OpenModalMobile(cell)
            // }}
          />
        </div>
      </div>
    </div>
  )
}

export default Timekeeping
