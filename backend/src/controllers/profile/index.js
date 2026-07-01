import profiles from "../../models/Profile.model.js"
import redisClient, { invalidateCache } from "../../database/redis.js"

async function getProfile(req, res) {
    try {
        const id = req.query.id || req.user.id
        const cacheKey = `profiles:${id}`
        const cachedProfile = await redisClient.get(cacheKey)
        if (cachedProfile) {
            return res.status(200).json({
                message: "Profile fetched successfully",
                profile: JSON.parse(cachedProfile)
            });
        }
        const profile = await profiles.findOne({ userId: id })
        if (profile) {
            await redisClient.setEx(cacheKey, 300, JSON.stringify(profile))
            return res.status(200).json({
                message: "Profile fetched successfully",
                profile
            });
        }
        return res.status(404).json({
            message: "Profile not found"
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error)
    }
}

async function getAllProfiles(req, res) {
    try {
        const id = req.query.id

        const cacheKey = id ? `profiles:for:${id}` : `profiles:all`
        const cachedProfiles = await redisClient.get(cacheKey)
        if (cachedProfiles) {
            return res.status(200).json({
                message: "Profiles fetched successfully",
                profiles: JSON.parse(cachedProfiles)
            });
        }
        const all = id ? await profiles.find({ role: "student", userId: id }) : await profiles.find({ role: "student" })
        if (all) {
            await redisClient.setEx(cacheKey, 300, JSON.stringify(all))
            res.status(200).json({
                message: "Profiles fetched successfully",
                profiles: all
            })
        }
        else {
            res.status(404).json({
                message: "No profiles found"
            })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getFilteredProfiles(req, res) {
    try {
        const body = req.query
        const skills = body.skills.split(",")
        const rating = body.rating
        const cacheKey = `profiles:filtered:${skills.join(",")}:${rating}`
        const cachedProfiles = await redisClient.get(cacheKey)
        if (cachedProfiles) {
            return res.status(200).json({
                message: "Profiles fetched successfully",
                profiles: JSON.parse(cachedProfiles)
            });
        }
        const filteredProfiles = await profiles.find({ skills: { $in: skills }, rating: { $gte: rating } })
        if (filteredProfiles) {
            await redisClient.setEx(cacheKey, 300, JSON.stringify(filteredProfiles))
            res.status(200).json({
                message: "Profiles fetched successfully",
                profiles: filteredProfiles
            })
        }
        else {
            res.status(404).json({
                message: "No profiles found"
            })
        }
    } catch (err) {
        res.status(400).json({ message: "Invalid query parameters" })
    }

}

async function updateProfile(req, res) {
    try {
        const id = req.user.id;

        const updates = req.body;

        const profile = await profiles.updateOne(
            { userId: id },
            {
                $set: {
                    ...updates,
                    userId: id,
                    role: req.user.role || 'student'
                }
            },
            {
                upsert: true
            }
        );

        await invalidateCache(["profiles*", "profiles:*"])

        res.status(200).json({
            message: "Profile updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteProfile(req, res) {
    try {
        const id = req.user.id

        const profile = await profiles.deleteOne({ userId: id })
        if (profile) {
            await invalidateCache(["profiles*", "profiles:*"])
            res.status(200).json({
                message: "Profile deleted successfully",
            });
        }
        else {
            res.status(404).json({
                message: "Profile not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export default {
    getProfile,
    updateProfile,
    deleteProfile,
    getAllProfiles,
    getFilteredProfiles
}
