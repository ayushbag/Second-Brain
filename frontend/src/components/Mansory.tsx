const Mansory = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 w-full [&>*]:mb-4 [&>*]:break-inside-avoid flex flex-col items-center sm:block">
            {children}
        </div>
    );
}

export default Mansory