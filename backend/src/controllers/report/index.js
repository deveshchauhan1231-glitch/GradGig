import reports from "../../models/Report.model.js"
import redisClient, { invalidateCache } from "../../database/redis.js"

async function submitReport(req, res) {
    try {
        const report = await reports.create(req.body)

        await invalidateCache(["reports*", "reports:*"])

        res.status(201).json({
            message: "Report submitted successfully",
            report
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getReport(req, res) {
    try {
        const id = req.params.id || req.query.reportId
        const cacheKey = id ? `reports:${id}` : `reports:all`
        const cachedReport = await redisClient.get(cacheKey)
        if (cachedReport) {
            return res.status(200).json({
                message: "Report fetched successfully",
                report: JSON.parse(cachedReport)
            })
        }
        const report = id ? await reports.findById(id) : await reports.find()

        if (report && (!Array.isArray(report) || report.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(report))
            res.status(200).json({
                message: "Report fetched successfully",
                report
            })
        }
        else {
            res.status(404).json({
                message: "Report not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function deleteReport(req, res) {
    try {
        const id = req.params.id || req.query.reportId || req.body.reportId
        const report = await reports.deleteOne({ _id: id })

        if (report.deletedCount) {
            await invalidateCache(["reports*", "reports:*"])
            res.status(200).json({
                message: "Report deleted successfully"
            })
        }
        else {
            res.status(404).json({
                message: "Report not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export default {
    submitReport,
    getReport,
    deleteReport
}
