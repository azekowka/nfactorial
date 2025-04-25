import React from 'react'
import { History } from './history'
import { HistoryList } from './history-list'

const HistoryContainer: React.FC = async () => {
  return (
    <div className="z-50">
      <History>
        <HistoryList userId="anonymous" />
      </History>
    </div>
  )
}

export default HistoryContainer
