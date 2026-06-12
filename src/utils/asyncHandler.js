//applying wrapper of async-awaiit and try-catch/ promises to functions to handle asynchronous tasks
//handling async function with promises

const asyncHandler = (requestHandler) => {
    return (req, res, next) =>{
        Promise.resolve( requestHandler(req, res, next )).catch((error) => next(error))
    }
}


export {asyncHandler}

// with try-catch

// const asyncHandler = (func) => async (req, res, next) => {

//     try {
//         await func(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }