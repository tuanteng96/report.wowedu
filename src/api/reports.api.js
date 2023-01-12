import http from './configs/http'

const SubApi = '/api/v3/r23'

const reportsApi = {
  getAllDay: data => {
    return http.post(`${SubApi}/bao-cao-ngay/danh-sach`, JSON.stringify(data))
  },
  getMemberDay: data => {
    return http.post(`${SubApi}/khach-hang/chi-tiet-ngay`, JSON.stringify(data))
  },
  getOverviewCustomer: data => {
    return http.post(`${SubApi}/khach-hang/tong-quan`, JSON.stringify(data))
  },
  getListCustomer: data => {
    return http.post(`${SubApi}/khach-hang/danh-sach`, JSON.stringify(data))
  },
  getListCustomerGeneral: data => {
    return http.post(`${SubApi}/khach-hang/tong-hop`, JSON.stringify(data))
  },
  getListCustomerConvert: data => {
    return http.post(`${SubApi}/khach-hang/chuyen-doi`, JSON.stringify(data))
  },
  getListCustomerExpense: data => {
    return http.post(`${SubApi}/khach-hang/chi-tieu`, JSON.stringify(data))
  },
  getListCustomerExpected: data => {
    return http.post(`${SubApi}/khach-hang/du-kien`, JSON.stringify(data))
  },
  getListCustomerUseService: data => {
    return http.post(
      `${SubApi}/khach-hang/su-dung-dich-vu`,
      JSON.stringify(data)
    )
  },
  getListCustomerFrequencyUse: data => {
    return http.post(
      `${SubApi}/khach-hang/tan-suat-su-dung`,
      JSON.stringify(data)
    )
  },
  getListOddService: data => {
    return http.post(`${SubApi}/khach-hang/chinh-sua-the`, JSON.stringify(data))
  },
  getListSaleReduced: data => {
    return http.post(
      `${SubApi}/ban-hang/doanh-so-giam-tru`,
      JSON.stringify(data)
    )
  },
  getOverviewServices: data => {
    return http.post(`${SubApi}/dich-vu/tong-quan`, JSON.stringify(data))
  },
  getListServices: data => {
    return http.post(`${SubApi}/dich-vu/danh-sach`, JSON.stringify(data))
  },
  getListUsedElsewhere: data => {
    return http.post(
      `${SubApi}/dich-vu/dich-vu-kh-khac-diem`,
      JSON.stringify(data)
    )
  },
  getListOllCardService: data => {
    return http.post(
      `${SubApi}/khac/chi-tiet-vi-khach-hang`,
      JSON.stringify(data)
    )
  },
  getOverviewSell: data => {
    return http.post(
      `${SubApi}/ban-hang/doanh-so-tong-quan`,
      JSON.stringify(data)
    )
  },
  getListSell: data => {
    return http.post(
      `${SubApi}/ban-hang/doanh-so-danh-sach`,
      JSON.stringify(data)
    )
  },
  getListSalesDetail: data => {
    return http.post(
      `${SubApi}/ban-hang/doanh-so-chi-tiet`,
      JSON.stringify(data)
    )
  },
  getListTopSalesDetail: data => {
    return http.post(
      `${SubApi}/ban-hang/top-ban-hang-doanh-so`,
      JSON.stringify(data)
    )
  },
  getListReturns: data => {
    return http.post(`${SubApi}/ban-hang/tra-hang`, JSON.stringify(data))
  },
  getListProfit: data => {
    return http.post(`${SubApi}/loi-nhuan/danh-sach`, JSON.stringify(data))
  },
  getListDebtPayment: data => {
    return http.post(
      `${SubApi}/ban-hang/thanh-toan-tra-no`,
      JSON.stringify(data)
    )
  },
  getListPriceSell: data => {
    return http.post(
      `${SubApi}/ban-hang/gia-ban-san-pham-dich-vu`,
      JSON.stringify(data)
    )
  },
  getListActualSell: data => {
    return http.post(
      `${SubApi}/ban-hang/bao-cao-thuc-thu`,
      JSON.stringify(data)
    )
  },
  getOverviewReEx: data => {
    return http.post(
      `${SubApi}/bao-cao-thu-chi/tong-quan`,
      JSON.stringify(data)
    )
  },
  getListReEx: data => {
    return http.post(
      `${SubApi}/bao-cao-thu-chi/danh-sach`,
      JSON.stringify(data)
    )
  },
  getListDebt: data => {
    return http.post(`${SubApi}/cong-no/danh-sach`, JSON.stringify(data))
  },
  getListDebtLock: data => {
    return http.post(`${SubApi}/cong-no/khoa-no`, JSON.stringify(data))
  },
  getListDebtGift: data => {
    return http.post(`${SubApi}/cong-no/tang`, JSON.stringify(data))
  },
  getListStaffSalarySV: data => {
    return http.post(
      `${SubApi}/nhan-vien/luong-ca-dich-vu`,
      JSON.stringify(data)
    )
  },
  getListStaffRose: data => {
    return http.post(`${SubApi}/nhan-vien/hoa-hong`, JSON.stringify(data))
  },
  getListStaffSales: data => {
    return http.post(`${SubApi}/nhan-vien/doanh-so`, JSON.stringify(data))
  },
  getListStaffPayroll: data => {
    return http.post(`${SubApi}/nhan-vien/bang-luong`, JSON.stringify(data))
  },
  getListInventory: data => {
    return http.post(`${SubApi}/ton-kho/danh-sach`, JSON.stringify(data))
  },
  getInventoryAttrition: data => {
    return http.post(`${SubApi}/ton-kho/tieu-hao`, JSON.stringify(data))
  },
  getInventoryWarning: data => {
    return http.post(`${SubApi}/ton-kho/du-kien-nvl`, JSON.stringify(data))
  },
  getListUseCustomerApp: data => {
    return http.post(`${SubApi}/khach-hang/su-dung-app`, JSON.stringify(data))
  },
  getListBirthdayCustomer: data => {
    return http.post(
      `${SubApi}/cskh/khach-hang-sinh-nhat`,
      JSON.stringify(data)
    )
  },
  getListTotalWallet: data => {
    return http.post(
      `${SubApi}/khac/tong-tien-vi-khach-hang`,
      JSON.stringify(data)
    )
  },
  getListTotalWalletDetail: data => {
    return http.post(
      `${SubApi}/khac/chi-tiet-vi-khach-hang`,
      JSON.stringify(data)
    )
  },
  getListTotalCard: data => {
    return http.post(`${SubApi}/khac/bao-cao-the-tien`, JSON.stringify(data))
  },
  getListTotalUseCard: data => {
    return http.post(
      `${SubApi}/khac/bao-cao-su-dung-the-tien`,
      JSON.stringify(data)
    )
  },
  getListClassRoom: data => {
    return http.post(
      `${SubApi}/truong/tong-so-tiet-truong`,
      JSON.stringify(data)
    )
  },
  getListTeacherClass: data => {
    return http.post(
      `${SubApi}/giao-vien/tong-so-tiet-giao-vien`,
      JSON.stringify(data)
    )
  },
  getListTeacherBusiness: data => {
    return http.post(`${SubApi}/giao-vien/cong-tac-phi`, JSON.stringify(data))
  },
  getListTeacherThematic: data => {
    return http.post(`${SubApi}/giao-vien/chuyen-de`, JSON.stringify(data))
  }
}
export default reportsApi
