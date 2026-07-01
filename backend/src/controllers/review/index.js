import reviews from "../../models/Review.model.js"
import profiles from "../../models/Profile.model.js"
import redisClient, { invalidateCache } from "../../database/redis.js"

async function submitReview(req, res) {
    try {
        const review = await reviews.create(req.body)

        const reviewedProfile = await profiles.findOne({ userId: req.body.reviewedId })
        if (reviewedProfile) {
            const completedGigs = Number(reviewedProfile.completedGigs || 0)
            const previousAverage = Number(reviewedProfile.rating || 0)
            const newAverage = completedGigs > 0
                ? ((previousAverage * Math.max(completedGigs - 1, 0)) + Number(req.body.rating)) / completedGigs
                : Number(req.body.rating)

            reviewedProfile.rating = Number(newAverage.toFixed(2))
            await reviewedProfile.save()
            await invalidateCache(["profiles*", "profiles:*"])
        }

        await invalidateCache(["reviews*", "reviews:*"])

        res.status(201).json({
            message: "Review submitted successfully",
            review
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getReview(req, res) {
    try {
        const id = req.params.id || req.query.reviewId
        const cacheKey = id ? `reviews:${id}` : `reviews:all`
        const cachedReview = await redisClient.get(cacheKey)
        if (cachedReview) {
            return res.status(200).json({
                message: "Review fetched successfully",
                review: JSON.parse(cachedReview)
            })
        }
        const review = id ? await reviews.find({reviewedId:id}) : await reviews.find()

        if (review && (!Array.isArray(review) || review.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(review))
            res.status(200).json({
                message: "Review fetched successfully",
                review
            })
        }
        else {
            res.status(404).json({
                message: "Review not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function deleteReview(req, res) {
    try {
        const id = req.params.id || req.query.reviewId || req.body.reviewId
        const review = await reviews.deleteOne({ _id: id })

        if (review.deletedCount) {
            await invalidateCache(["reviews*", "reviews:*"])
            res.status(200).json({
                message: "Review deleted successfully"
            })
        }
        else {
            res.status(404).json({
                message: "Review not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export default {
    submitReview,
    getReview,
    deleteReview
}
