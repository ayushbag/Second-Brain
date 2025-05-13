const Mansory = ({ children }: {
    children?: any
}) => {
    return (
        <div className="mansory columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 p-4">
            {children}
        </div>
    )
}

export default Mansory