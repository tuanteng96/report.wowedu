import React from 'react'
import clsx from 'clsx'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Formik, Form } from 'formik'
import AsyncSelectSchool from '../Selects/AsyncSelectSchool'

import vi from 'date-fns/locale/vi' // the locale you want
import AsyncSelectMembers from '../Selects/AsyncSelectMembers'

registerLocale('vi', vi) // register it with the name you want

function FilterSchool({
  show,
  onHide,
  filters,
  onSubmit,
  loading,
  loadingExport,
  onRefresh,
  onExport
}) {
  return (
    <div className={clsx('filter-box', show && 'show')}>
      <Formik
        initialValues={filters}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {formikProps => {
          // errors, touched, handleChange, handleBlur
          const { values, setFieldValue, handleChange, handleBlur } =
            formikProps
          return (
            <Form>
              <div className="filter-box__content">
                <div className="filter-box__header d-flex justify-content-between align-items-center border-bottom border-gray-200 px-20px py-20px">
                  <div className="font-size-lg fw-500 text-uppercase">
                    Bộ lọc danh sách
                  </div>
                  <div
                    className="w-30px h-30px d-flex justify-content-center align-items-center cursor-pointer"
                    onClick={onHide}
                  >
                    <i className="fa-regular fa-xmark font-size-lg text-muted"></i>
                  </div>
                </div>
                <div className="filter-box__body p-20px">
                  {'DateStart' in values && (
                    <div className="mb-20px form-group">
                      <label>Ngày bắt đầu</label>
                      <DatePicker
                        onChange={date => {
                          setFieldValue('DateStart', date, false)
                        }}
                        selected={values.DateStart}
                        placeholderText="Chọn ngày"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  )}
                  {'DateEnd' in values && (
                    <div className="mb-20px form-group">
                      <label>Ngày kết thúc</label>
                      <DatePicker
                        onChange={date => {
                          setFieldValue('DateEnd', date, false)
                        }}
                        selected={values.DateEnd}
                        placeholderText="Chọn ngày"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  )}
                  {'From' in values && (
                    <div className="mb-20px form-group">
                      <label>Ngày bắt đầu</label>
                      <DatePicker
                        onChange={date => {
                          setFieldValue('From', date, false)
                        }}
                        selected={values.From}
                        placeholderText="Chọn ngày"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  )}
                  {'To' in values && (
                    <div className="mb-20px form-group">
                      <label>Ngày kết thúc</label>
                      <DatePicker
                        onChange={date => {
                          setFieldValue('To', date, false)
                        }}
                        selected={values.To}
                        placeholderText="Chọn ngày"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  )}
                  {'SchoolID' in values && (
                    <div className="mb-20px form-group">
                      <label>Trường</label>
                      <AsyncSelectSchool
                        className="select-control"
                        placeholder="Chọn trường"
                        name="SchoolID"
                        menuPosition="fixed"
                        value={values.SchoolID}
                        onChange={option => {
                          setFieldValue('SchoolID', option, false)
                        }}
                        onBlur={handleBlur}
                        noOptionsMessage={({ inputValue }) =>
                          !inputValue
                            ? 'Danh sách trường trống'
                            : 'Không tìm thấy trường phù hợp.'
                        }
                      />
                    </div>
                  )}
                  {!window?.IsApp && 'TeacherIDs' in values && (
                    <div className="form-group mb-20px">
                      <label>Giáo viên</label>
                      <AsyncSelectMembers
                        isMulti
                        isClearable={true}
                        menuPosition="fixed"
                        name="TeacherIDs"
                        value={values.MemberID}
                        onChange={otp => {
                          setFieldValue('TeacherIDs', otp, false)
                        }}
                      />
                    </div>
                  )}
                  {'Mon' in values && (
                    <div className="mb-20px form-group">
                      <label>Chọn tháng</label>
                      <DatePicker
                        locale="vi"
                        onChange={date => {
                          setFieldValue('Mon', date, false)
                        }}
                        selected={values.Mon}
                        placeholderText="Chọn tháng"
                        className="form-control"
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        showTwoColumnMonthYearPicker
                      />
                    </div>
                  )}
                  {'Date' in values && (
                    <div className="mb-20px form-group">
                      <label>Ngày</label>
                      <DatePicker
                        onChange={date => {
                          setFieldValue('Date', date, false)
                        }}
                        selected={values.Date}
                        placeholderText="Chọn ngày"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  )}
                  {'Key' in values && (
                    <div className="form-group mb-20px">
                      <label>Nhập tên mặt hàng</label>
                      <input
                        type="text"
                        name="Key"
                        value={values.Key}
                        className="form-control"
                        placeholder="Nhập tên ..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  )}
                </div>
                <div className="filter-box__footer p-20px d-flex justify-content-end">
                  <button
                    type="button"
                    className={clsx(
                      'btn btn-primary me-2 max-w-135px text-truncate',
                      (loadingExport || loading) &&
                        'spinner spinner-white spinner-right'
                    )}
                    disabled={loadingExport}
                    onClick={onExport}
                  >
                    <i className="far fa-file-excel pr-8px"></i>
                    Xuất Excel
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      'btn btn-info',
                      loading && 'spinner spinner-white spinner-right'
                    )}
                    disabled={loading}
                    onClick={onRefresh}
                  >
                    <i className="fa-regular fa-arrows-rotate"></i>
                  </button>
                  <button
                    type="submit"
                    className={clsx(
                      'btn btn-success ms-2 ms-2 max-w-135px text-truncate',
                      loading && 'spinner spinner-white spinner-right'
                    )}
                    disabled={loading}
                  >
                    <i className="fa-regular fa-magnifying-glass pr-5px"></i>
                    Lọc kết quả
                  </button>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
      <div className="filter-box__overlay" onClick={onHide}></div>
    </div>
  )
}

export default FilterSchool
