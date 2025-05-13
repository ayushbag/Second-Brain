const Mansory = ({ children }: {
    children?: any
}) => {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-2 space-y-8 p-4 w-full overflow-hidden">
            {children}
        </div>
    )
}

export default Mansory