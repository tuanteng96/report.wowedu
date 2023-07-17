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

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function TeacherBusiness(props) {
  const [ListData, setListData] = useState([])
  const [ColumnsAdd, setColumnsAdd] = useState([])
  const [ColumnsAdditional, setColumnsAdditional] = useState([])
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
    TeacherIDs: window.IsApp
      ? [
          {
            value: window.Info.ID,
            label: window.Info.FullName
          }
        ]
      : ''
  })

  useEffect(() => {
    getListTeacherBusiness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListTeacherBusiness = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    reportsApi
      .getListTeacherBusiness(BrowserHelpers.getRequestParamsSchools(filters))
      .then(({ data }) => {
        if (data.isRight) {
          PermissionHelpers.ErrorAccess(data.error)
          setLoading(false)
        } else {
          const { Items, Total, PCount, Columns, ColumnsAdditi } = {
            Items: data.result?.Items || [],
            Columns: data.result?.COT || [],
            ColumnsAdditi: data.result?.COT_BO_SUNG || [],
            Total: data.result?.Items.length || 0,
            PCount: data?.result?.PCount || 0
          }
          setListData(Items.map(o => ({ ...o, IDs: uuidv4() })))
          setColumnsAdd(Columns)
          setColumnsAdditional(ColumnsAdditi)
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
    getListTeacherBusiness()
  }

  const onExport = () => {
    PermissionHelpers.ExportExcel({
      FuncStart: () => setLoadingExport(true),
      FuncEnd: () => setLoadingExport(false),
      FuncApi: () =>
        reportsApi.getListTeacherBusiness(
          BrowserHelpers.getRequestParamsSchools(filters, {
            Total: PageTotal
          })
        ),
      UrlName: '/bao-cao/gv-cong-tac-phi'
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
        key: 'MA_GV',
        title: 'Mã GV',
        dataKey: 'MA_GV',
        width: 120,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'MA_TONG_CTP',
        title: 'Mã Tổng CTP',
        dataKey: 'MA_TONG_CTP',
        width: 180,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'HO_TEN',
        title: 'Họ và tên',
        dataKey: 'HO_TEN',
        width: 250,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'DINH_MUC',
        title: 'Định mức 85',
        dataKey: 'DINH_MUC',
        width: 150,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'TONG_CTP',
        title: 'Tổng CTP',
        dataKey: 'TONG_CTP',
        width: 180,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      }
    ]
    if (ListData && ListData.length > 0) {
      const newListAdditional = []
      if (ColumnsAdditional && ColumnsAdditional.length > 0) {
        for (let [index, value] of ColumnsAdditional.entries()) {
          const UUid = uuidv4()
          const newObj = {
            key: value.From + '-' + value.To + UUid,
            title: `Bổ xung ${value.Text}`,
            dataKey: value.From + '-' + value.To + UUid,
            cellRenderer: ({ rowData }) => rowData.BO_SUNG[index].Total,
            width: 180,
            sortable: false
          }
          newListAdditional.push(newObj)
        }
      }
      objColumns = ArrayHeplers.insertArrayAt(objColumns, 5, newListAdditional)
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
            width: 130,
            sortable: false,
            align: 'center'
          }
          newList.push(newObj)
        }
        objColumns = ArrayHeplers.insertArrayAt(
          objColumns,
          5 + newListAdditional.length,
          newList
        )
      }
    }

    return objColumns
  }, [filters, ListData, ColumnsAdd, ColumnsAdditional])

  return (
    <div className="py-main">
      <div className="subheader d-flex justify-content-between align-items-center">
        <div className="flex-1">
          <span className="text-uppercase text-uppercase font-size-xl fw-600">
            Giáo viên - Công tác phí
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
            Danh sách Giáo viên - Công tác phí
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

export default TeacherBusiness
