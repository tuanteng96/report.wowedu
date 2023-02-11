import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import LayoutReport from 'src/layout/LayoutReport'
import RPSchools from 'src/features/Reports/pages/RP-Schools'
import ClassRoom from 'src/features/Reports/pages/RP-Schools/pages/ClassRoom'
import TeacherClass from 'src/features/Reports/pages/RP-Schools/pages/TeacherClass'
import TeacherBusiness from 'src/features/Reports/pages/RP-Schools/pages/TeacherBusiness'
import TeacherThematic from 'src/features/Reports/pages/RP-Schools/pages/TeacherThematic'
import TeacherOvertime from 'src/features/Reports/pages/RP-Schools/pages/TeacherOvertime'

function RouterPage(props) {
  return (
    <Routes>
      <Route index element={<Navigate to="/bao-cao" replace />} />
      <Route
        path="/bao-cao"
        element={
          <LayoutReport>
            <RPSchools />
          </LayoutReport>
        }
      >
        <Route index element={<Navigate to="truong-tong-so-tiet" replace />} />
        <Route path="truong-tong-so-tiet" element={<ClassRoom />} />
        <Route path="gv-tong-so-tiet" element={<TeacherClass />} />
        <Route path="gv-cong-tac-phi" element={<TeacherBusiness />} />
        <Route path="gv-tiet-chuyen-de" element={<TeacherThematic />} />
        <Route path="gv-tang-ca" element={<TeacherOvertime />} />
      </Route>
      {!window?.isDesktop && (
        <Route path="/app23/index.html" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  )
}

export default RouterPage
