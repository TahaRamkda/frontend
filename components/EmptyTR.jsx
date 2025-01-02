function EmptyTR({ keys, rows, blur = false, empty = false }) {
    const keysArray = new Array(keys).fill('0')
    const rowsArray = new Array(rows).fill('0')
    return (
        <>
            {
                !empty ? (
                    rowsArray?.map((item, index) => {
                        return (
                            <tr
                                key={index}
                                className={blur ? 'blur-sm bg-gray-200' : ''}
                            >
                                {keysArray?.map((item, index) => {
                                    return (
                                        <td key={index}>
                                            <div
                                                className={`${!blur && 'animate-pulse'
                                                    }  w-full h-4 bg-gray-300 rounded-full`}
                                            ></div>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                ) : (
                    <tr>
                        <td className="text-center text-xl" colSpan={keys}>
                            No Records Found
                        </td>
                    </tr>
                )

                // <td colSpan={7} className="flex flex-row text-center items-center justify-center text-2xl w-full">
                //     No Records Found
                // </td>
            }

            {blur && (
                <div className="absolute top-1/2 left-1/4 text-2xl">
                    You do not have access to this module. Please contact system
                    admin.
                </div>
            )}
        </>
    )
}
export default EmptyTR
