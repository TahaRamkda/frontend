import React from 'react'
import styled from 'styled-components'

// import { firestore } from 'utils/firebase'

const Wrapper = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const Title = styled.span`
    color: #92929d;
`
const Details = styled.div`
    margin-top: 10px;
    color: #92929d;
    white-space: pre-wrap;
    font-size: 10px;
`

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { error: null, errorInfo: null }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })

        const errorObj = {
            error: error.toString(),
            errorInfo,
            uid: 'uid',
            type: 'ErrorBoundary',
            platform: 'site',
            currentUrl: window.location.href
        }

        // console.log({
        //     errorObj,
        //     env: process.env.NODE_ENV
        // })

        //Detect if we are in production mode
        // if (process.env.NODE_ENV === 'production') {
        //     // errorsLog.send({
        //     //   text: `UID: ${errorObj.uid}\n Type: ErrorBoundary \n Error: ${errorObj.error}`
        //     // })

        //     // firestore
        //     //     .collection('errors')
        //     //     .add(errorObj)
        //     //     .then((obj) => {})
        //     //     .catch((err) => {
        //     //         console.log({ err })
        //     //     })
        // }
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <Wrapper>
                    <Title>Oops, something went wrong</Title>
                    <div
                        className="cursor-pointer"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </div>
                    <Details>
                        {this.state.error && this.state.error.toString()}
                        <br />

                        {/* {this.state.errorInfo.componentStack} */}
                    </Details>
                </Wrapper>
            )
        }
        return (
            <div>
                {this.state.error}
                {this.props.children}
            </div>
        )
    }
}

export default ErrorBoundary
