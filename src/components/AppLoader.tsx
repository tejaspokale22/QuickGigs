'use client'

import Spinner from '@/components/ui/spinner'

const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <Spinner />
    </div>
  )
}

export default AppLoader
