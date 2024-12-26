import { toast } from 'react-toastify'

const handleError = (err) => {
    // console.log(err.message);
    toast.error(err.message)
    // get request method and path
    /*if (
        err?.response?.data?.message &&
        typeof err?.response?.data?.message === 'string'
    ) {
        toast.error(err.response.data.message)
    } else if (typeof err?.response?.data?.message === 'object') {
        if (err?.response?.data?.message?.length > 0) {
            toast.error(err?.response?.data?.message.join(', '))
        // } else {
        //     console.log('Something went wrong: axios utils 3')
        //     //alert('Something went wrong: axios utils 2')
        }*/
    // } else {
    //     console.log('Something went wrong: axios utils 3')
    //     //alert('Something went wrong: axios utils 3')
    //     console.log(
    //         `Error occured, but it's of type ${typeof err?.response?.data
    //             ?.message}, which isn't handled`
    //     )
    // }
}

export default handleError
