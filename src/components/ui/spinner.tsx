const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
        {/* Inner spinning ring */}
        <div className="w-12 h-12 rounded-full border-4 border-black border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  )
}

export default Spinner 