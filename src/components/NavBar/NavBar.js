import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'
import PerfectScrollbar from 'react-perfect-scrollbar'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { ToggleAside } from '../../layout/LayoutSlice'
import Swal from 'sweetalert2'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const MenuList = [
  {
    Title: 'Trường - Tổng số tiết',
    TitleKey: 'TRUONG_TONG_SO_TIET',
    IconClass: 'fa-regular fa-school icon',
    Href: '/bao-cao/truong-tong-so-tiet'
  },
  {
    Title: 'Giáo viên - Tổng số tiết',
    TitleKey: 'GV_TONG_SO_TIET',
    IconClass: 'fa-regular fa-chalkboard-user icon',
    Href: '/bao-cao/gv-tong-so-tiet'
  },
  {
    Title: 'Giáo viên - Công tác phí',
    TitleKey: 'GV_CONG_TAC_PHI',
    IconClass: 'fa-regular fa-piggy-bank icon',
    Href: '/bao-cao/gv-cong-tac-phi'
  },
  {
    Title: 'Giáo viên - Tiết chuyên đề',
    TitleKey: 'GV_TIET_CHUYEN_DE',
    IconClass: 'fa-regular fa-book icon',
    Href: '/bao-cao/gv-tiet-chuyen-de'
  },
  {
    Title: 'Giáo viên - Tăng ca',
    TitleKey: 'GV_TANG_CA',
    IconClass: 'fa-regular fa-alarm-snooze icon',
    Href: '/bao-cao/gv-tang-ca'
  }
]

function NavBar(props) {
  const { isShowMobile } = useSelector(({ layout }) => ({
    isShowMobile: layout.aside.isShowMobile
  }))
  const { width } = useWindowSize()
  const [IndexShow, setIndexShow] = useState('')
  const [locationCurent, setLocationCurrent] = useState('')
  let location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (width < 1200) {
      dispatch(ToggleAside(false))
    }
    setLocationCurrent(location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(() => {
    if (location.pathname !== locationCurent) {
      Swal.close()
    }
  }, [location, locationCurent])

  useEffect(() => {
    const { pathname } = location
    const index = MenuList.findIndex(item => {
      if (item.Href === pathname) return item.Href === pathname
      return item.Children && item.Children.some(sub => sub.Href === pathname)
    })
    if (index > -1) {
      setIndexShow(MenuList[index].TitleKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MenuList, location])

  const OpenSubmenu = key => {
    if (key === IndexShow) {
      setIndexShow('')
    } else {
      setIndexShow(key)
    }
  }

  const onHideAside = () => {
    dispatch(ToggleAside(false))
  }

  if (width < 1200) {
    return (
      <div className={clsx('ezs-navbars-mobile', isShowMobile && 'show')}>
        <div className="ezs-navbar-mobile">
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className="scroll h-100"
            style={{ position: 'relative' }}
          >
            <ul className="ezs-navbars">
              {MenuList &&
                MenuList.map((item, index) => (
                  <li
                    className={clsx(
                      IndexShow === item.TitleKey && 'menu-item-open'
                    )}
                    key={index}
                  >
                    <NavLink to={item.Href}>
                      <i className={item.IconClass}></i>
                      <span>{item.Title}</span>
                    </NavLink>
                    {item.Children && item.Children.length > 0 && (
                      <div
                        className="btn-down"
                        onClick={() => OpenSubmenu(item.TitleKey)}
                      >
                        <i className="fa-solid fa-chevron-down icon-down"></i>
                      </div>
                    )}
                    {item.Children && item.Children.length > 0 && (
                      <div className="ezs-navbar__sub">
                        <ul>
                          {item.Children.map((sub, i) => (
                            <li key={i}>
                              <NavLink to={sub.Href}>
                                <i className="menu-bullet menu-bullet-dot">
                                  <span></span>
                                </i>
                                <span className="menu-text">{sub.Title}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </PerfectScrollbar>
        </div>
        <div className="navbar-overlay" onClick={onHideAside}></div>
      </div>
    )
  }
  return (
    <div className="position-fixed zindex-1001 w-100 h-55px top-0 left-0 px-30px bg-white">
      <ul className="ezs-navbar">
        {MenuList &&
          MenuList.map((item, index) => (
            <li key={index}>
              <NavLink to={item.Href}>
                <i className={item.IconClass}></i>
                <span>{item.Title}</span>
                {item.Children && item.Children.length > 0 && (
                  <i className="fa-solid fa-chevron-down icon-down"></i>
                )}
              </NavLink>
              {item.Children && item.Children.length > 0 && (
                <div className="ezs-navbar__sub">
                  <ul>
                    {item.Children.map((sub, i) => (
                      <li key={i}>
                        <NavLink to={sub.Href}>{sub.Title}</NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default NavBar
