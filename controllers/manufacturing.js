const manufacturingService = require("../service/manufacturing");


async function createjob(req, res, next) {
    try {
        const { product_id, planned_quantity } = req.body
        const job = await manufacturingService.createmanufacturingjob(product_id, planned_quantity)

        res.status(201).json({
            success: true,
            Message: "manufacturing job is creatred",
            data: job,
        })
    }
    catch (error) {
        next(error)
    }

}

// get all manufacturing job

async function getalljobs(req, res, next) {
    try {
        const job = await manufacturingService.getallmanufacturingjob();
        res.status(200).json({
            success: true,
            message: "successful",
            data: job,
        })
    }
    catch (error) {
        next(error)
    }
}

//single job 
async function getjobbyid(req, res, next) {
    try {
        const id = req.params.id;
        const job = await manufacturingService.getjobbyid(id);
        res.status(201).json({
            success: true,
            message: "successful",
            data: job
        })
    }
    catch (error) {
        next(error)
    }
}

//update status

async function updatestatus(req, res, next) {
    try {
        const id = req.params.id;
        const { status } = req.body

        const job = await manufacturingService.updatestatus(id, status);
        res.status(200).json({
            success: true,
            message: "successful",
            data: job,
        })
    }
    catch (error) {
        next(error)
    }
}

// completed job 
async function completedjob(req, res, next) {
    try {
        const id = req.params.id;
        const { completed_quantity } = req.body

        const job = await manufacturingService.complete(id, completedjob_quantity)
        res.status(200).json({
            success: true,
            message: "successful",
            data: job,
        })
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJobStatus,
    completeJob,
};
