import React from 'react'
import './PrintHeader.scss'

const PrintHeader = ({ closeAction }) => (
  <div className="u-grid">
    <div className="u-row">
      <div className="u-col-sm--3">
        <h1 className="c-print-header__title">Printversie</h1>
      </div>
      <div className="u-col-sm--9">
        <nav>
          <div className="c-print-header__print">
            <button type="button" className="c-print-button" onClick={window.print}>
              Printen
            </button>
          </div>
          <button type="button" onClick={closeAction} className="c-print-header__close" />
        </nav>
      </div>
    </div>
  </div>
)

export default PrintHeader
