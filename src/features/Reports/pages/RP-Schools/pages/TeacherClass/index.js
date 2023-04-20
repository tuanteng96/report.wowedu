import React, { useEffect, useMemo, useState } from 'react'
import FilterSchool from 'src/components/Filter/FilterSchool'
import ReactTableV7 from 'src/components/Tables/ReactTableV7'
import IconMenuMobile from 'src/features/Reports/components/IconMenuMobile'
import _ from 'lodash'
import reportsApi from 'src/api/reports.api'
import { BrowserHelpers } from 'src/helpers/BrowserHelpers'
import { PermissionHelpers } from 'src/helpers/PermissionHelpers'
import { uuidv4 } from '@nikitababko/id-generator'
import { ArrayHeplers } from 'src/helpers/ArrayHeplers'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function TeacherClass(props) {
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
    TeacherIDs: ''
  })

  useEffect(() => {
    getListTeacherClass()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListTeacherClass = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    reportsApi
      .getListTeacherClass(BrowserHelpers.getRequestParamsSchools(filters))
      .then(({ data }) => {
        if (data.isRight) {
          PermissionHelpers.ErrorAccess(data.error)
          setLoading(false)
        } else {
          const { Items, Total, PCount, Columns } = {
            Items: data.result?.Items || [],
            Columns: data.result?.COT || [],
            Total: data.result?.Items.length || 0,
            PCount: data?.result?.PCount || 0
          }
          setListData(Items.map(o => ({ ...o, IDs: uuidv4() })))
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
    getListTeacherClass()
  }

  const onExport = () => {
    PermissionHelpers.ExportExcel({
      FuncStart: () => setLoadingExport(true),
      FuncEnd: () => setLoadingExport(false),
      FuncApi: () =>
        reportsApi.getListTeacherClass(
          BrowserHelpers.getRequestParamsSchools(filters, {
            Total: PageTotal
          })
        ),
      UrlName: '/bao-cao/gv-tong-so-tiet'
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
        key: 'MA_SO',
        title: 'Mã số',
        dataKey: 'MA_SO',
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'HO_TEN',
        title: 'Họ tên',
        dataKey: 'HO_TEN',
        width: 250,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      // {
      //   key: 'DINH_MUC',
      //   title: 'Định mức 85',
      //   dataKey: 'DINH_MUC',
      //   width: 150,
      //   sortable: false,
      //   mobileOptions: {
      //     visible: true
      //   }
      // },
      {
        key: 'TONG_TIET',
        title: 'Tổng tiết',
        dataKey: 'TONG_TIET',
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'justify-content-center'
      },
      {
        key: 'SO_TUAN',
        title: 'Số tuần',
        dataKey: 'SO_TUAN',
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'justify-content-center'
      },
      {
        key: 'TRUNG_BINH_TIET',
        title: 'Trung bình tiết',
        dataKey: 'TRUNG_BINH_TIET',
        width: 180,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'justify-content-center'
      },
      {
        key: 'PHU_CAP_KPI',
        title: 'Phụ cấp KPI',
        dataKey: 'PHU_CAP_KPI',
        width: 150,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'justify-content-center'
      },
      {
        key: 'HE_SO_VUOT_TIET',
        title: 'Hệ số vượt tiết',
        dataKey: 'HE_SO_VUOT_TIET',
        width: 180,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'justify-content-center'
      },
      {
        key: 'PHU_CAP_VUOT_TIET',
        title: 'Phụ cấp vượt tiết',
        dataKey: 'PHU_CAP_VUOT_TIET',
        width: 180,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        className: 'justify-content-center'
      }
    ]
    if (ListData && ListData.length > 0) {
      if (ColumnsAdd && ColumnsAdd.length > 0) {
        const newList = []
        for (let [index, value] of ColumnsAdd.entries()) {
          const newObj = {
            key: value.From + '-' + value.To + index,
            title: `${value.Text} (${moment(value.From).format(
              'DD/MM'
            )} - ${moment(value.To).format('DD/MM')})`,
            dataKey: value.From + '-' + value.To + index,
            cellRenderer: ({ rowData }) => rowData.COT[index].Total,
            width: 125,
            sortable: false,
            headerClassName: 'text-center',
            className: 'justify-content-center'
          }
          newList.push(newObj)
        }
        objColumns = ArrayHeplers.insertArrayAt(objColumns, 4, newList)
      }
    }

    return objColumns
  }, [filters, ListData, ColumnsAdd])

  return (
    <div className="py-main">
      <div className="subheader d-flex justify-content-between align-items-center">
        <div className="flex-1">
          <span className="text-uppercase text-uppercase font-size-xl fw-600">
            Giáo viên - Tổng số tiết đã học
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
            Danh sách Giáo viên - Tổng số tiết
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
            // optionMobile={{
            //   CellModal: cell => OpenModalMobile(cell)
            // }}
          />
        </div>
      </div>
    </div>
  )
}

export default TeacherClass
