import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import FilterSchool from 'src/components/Filter/FilterSchool'
import IconMenuMobile from 'src/features/Reports/components/IconMenuMobile'
import _ from 'lodash'
import ReactTableV7 from 'src/components/Tables/ReactTableV7'
import { PermissionHelpers } from 'src/helpers/PermissionHelpers'
import reportsApi from 'src/api/reports.api'
import { BrowserHelpers } from 'src/helpers/BrowserHelpers'
import { uuidv4 } from '@nikitababko/id-generator'
import clsx from 'clsx'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer)

  return scrollbarWidth
}

const RenderFooter = React.forwardRef((props, ref) => {
  const { CHAN_TRANG } = props
  const refElm = useRef()
  useImperativeHandle(ref, () => ({
    getRef() {
      return refElm
    }
  }))

  const getStyle = isSet => {
    let style = {}
    if (isSet) {
      style.width = `${160 + getScrollbarWidth()}px`
      style.minWidth = `${160 + getScrollbarWidth()}px`
    }
    return style
  }

  return (
    <div className="h-100 d-flex" id="el-footer" ref={refElm}>
      <div className="w-180px min-w-180px border-right d-flex align-items-center justify-content-center fw-700 text-uppercase">
        Lớp và Sĩ số
      </div>
      {CHAN_TRANG &&
        CHAN_TRANG.map((x, index) => (
          <div
            className={clsx(
              'd-flex align-items-center justify-content-center fw-700 text-uppercase',
              index === 0
                ? 'w-120px min-w-120px'
                : CHAN_TRANG.length - 1 !== index
                ? 'w-160px min-w-160px'
                : '',
              CHAN_TRANG.length - 1 !== index && 'border-right'
            )}
            style={{ ...getStyle(CHAN_TRANG.length - 1 === index) }}
            key={index}
          >
            {x}
          </div>
        ))}
    </div>
  )
})

function ClassRoom(props) {
  const [ListData, setListData] = useState([])
  const [ColumnsAdd, setColumnsAdd] = useState([])
  const [CHAN_TRANG, setCHAN_TRANG] = useState([])
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
    SchoolID: {
      label: 7319,
      value: 7319
    }
  })

  const childCompRef = useRef()

  useEffect(() => {
    getListClassRoom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListClassRoom = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    reportsApi
      .getListClassRoom(BrowserHelpers.getRequestParamsSchools(filters))
      .then(({ data }) => {
        if (data.isRight) {
          PermissionHelpers.ErrorAccess(data.error)
          setLoading(false)
        } else {
          const { Items, Total, PCount, Columns, CHAN_TRANGs } = {
            Items: data.result?.Items || [],
            Columns: data.result?.COT || [],
            Total: data.result?.Total || 0,
            PCount: data?.result?.PCount || 0,
            CHAN_TRANGs: data?.result?.CHAN_TRANG || []
          }
          setListData(Items.map(o => ({ ...o, IDs: uuidv4() })))
          setColumnsAdd(Columns)
          setCHAN_TRANG(CHAN_TRANGs)
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
    getListClassRoom()
  }

  const onExport = () => {}

  const onPagesChange = ({ Pi, Ps }) => {
    setFilters({ ...filters, Pi, Ps })
  }

  const columns = useMemo(() => {
    let objColumns = [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowIndex }) =>
          filters.Ps * (filters.Pi - 1) + (rowIndex + 1),
        width: 60,
        sortable: false,
        align: 'center',
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'LOP',
        title: 'Lớp',
        dataKey: 'LOP',
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'SI_SO',
        title: 'Sĩ số',
        dataKey: 'SI_SO',
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      }
    ]
    if (ListData && ListData.length > 0) {
      const { COT } = ListData[0]
      if (COT && COT.length > 0) {
        for (let [index, value] of COT.entries()) {
          const newObj = {
            key: value.THANG + '-' + value.NAM,
            title: `Số tiết tháng ${value.THANG}`,
            dataKey: value.THANG + '-' + value.NAM,
            cellRenderer: ({ rowData }) => rowData.COT[index].TONG_TIET,
            width: 160,
            sortable: false,
            keyTitle: 'THANG'
          }
          objColumns.push(newObj)
        }
      }
      if (ColumnsAdd && ColumnsAdd.length > 0) {
        for (let [index, month] of ColumnsAdd.entries()) {
          if (month.CHI_TIET && month.CHI_TIET.length > 0) {
            for (let [idx, value] of month.CHI_TIET.entries()) {
              const newObj = {
                key: value.From + '-' + value.To + idx + index,
                title: `${value.Text} (${moment(value.From).format(
                  'DD/MM'
                )} - ${moment(value.To).format('DD/MM')})`,
                dataKey: value.From + '-' + value.To + idx + index,
                cellRenderer: ({ rowData }) =>
                  rowData.COT[index].CHI_TIET[idx].Total,
                width: 160,
                sortable: false,
                KeyTitle: 'Tháng ' + month.THANG,
                headerClassName: 'text-center',
                align: 'center'
              }
              objColumns.push(newObj)
            }
          }
        }
      }
    }

    return objColumns
  }, [filters, ListData, ColumnsAdd])

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
      //WidthMonth
      const MonthLength =
        columns && columns.filter(x => x.keyTitle === 'THANG').length
      const MonthIndex =
        columns && columns.findIndex(x => x.keyTitle === 'THANG')
      if (MonthIndex > -1) {
        GroupCell.push(
          <div
            className="h-100 d-flex align-items-center justify-content-center text-center text-uppercase font-size-md border-right"
            style={{
              width: cells[MonthIndex].props.style.width * MonthLength + 'px'
            }}
            key={uuidv4()}
          >
            Số tiết
          </div>
        )
      }

      //WidthWeek
      let newWeeks = []
      columns.forEach((column, columnIndex) => {
        if (column.KeyTitle && column.KeyTitle.includes('Tháng')) {
          const index = newWeeks.findIndex(o => o.Title === column.KeyTitle)
          if (index > -1) {
            newWeeks[index].Items.push(column)
          } else {
            newWeeks.push({
              Title: column.KeyTitle,
              Items: [
                {
                  ...column
                }
              ]
            })
          }
        }
      })
      newWeeks = newWeeks.map(o => ({
        ...o,
        width: o.Items ? o.Items.reduce((a, b) => a + (b['width'] || 0), 0) : 0
      }))

      newWeeks.forEach((week, weekIndex) => {
        GroupCell.push(
          <div
            className={clsx(
              'h-100 d-flex align-items-center justify-content-center text-center text-uppercase font-size-md',
              newWeeks.length - 1 !== weekIndex && 'border-right'
            )}
            style={{
              width: week.width + 'px'
            }}
            key={uuidv4()}
          >
            Chi tiết ngày {week.Title}
          </div>
        )
      })

      return GroupCell
    }
    return cells
  }

  return (
    <div className="py-main">
      <div className="subheader d-flex justify-content-between align-items-center">
        <div className="flex-1">
          <span className="text-uppercase text-uppercase font-size-xl fw-600">
            Trường - Tổng số tiết đã học
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
            Danh sách Trường - Tổng số tiết
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
            headerHeight={[50, 70]}
            headerRenderer={headerRenderer}
            // optionMobile={{
            //   CellModal: cell => OpenModalMobile(cell)
            // }},
            onScroll={({ scrollLeft }) => {
              const el = childCompRef.current.getRef()
              if (el?.current) {
                el.current.scrollLeft = scrollLeft
              }
            }}
            footerHeight={50}
            footerRenderer={
              <RenderFooter ref={childCompRef} CHAN_TRANG={CHAN_TRANG} />
            }
          />
        </div>
      </div>
    </div>
  )
}

export default ClassRoom
