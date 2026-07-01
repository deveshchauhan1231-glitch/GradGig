import projects from "../../models/Project.model.js"
import profiles from "../../models/Profile.model.js"
import redisClient, { invalidateCache } from "../../database/redis.js"

async function submitProject(req, res) {
    try {
        const project = await projects.create({
            ...req.body,
            clientId: req.user._id
        })

        await invalidateCache(["projects*", "projects:*"])

        res.status(201).json({
            message: "Project submitted successfully",
            project
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getProject(req, res) {
    try {
        const id = req.params.id || req.query.projectId
        const cacheKey = id ? `projects:${id}` : `projects:all`
        const cachedProject = await redisClient.get(cacheKey)
        if (cachedProject) {
            return res.status(200).json({
                message: "Project fetched successfully",
                project: JSON.parse(cachedProject)
            })
        }
        const project = id ? await projects.findById(id) : await projects.find()

        if (project && (!Array.isArray(project) || project.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(project))
            res.status(200).json({
                message: "Project fetched successfully",
                project
            })
        }
        else {
            res.status(404).json({
                message: "Project not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getAllProjects(req, res) {
    try {
        const cacheKey = `projects:all`
        const cachedProjects = await redisClient.get(cacheKey)
        if (cachedProjects) {
            return res.status(200).json({
                message: "Projects fetched successfully",
                projects: JSON.parse(cachedProjects)
            })
        }
        const projectsList = await projects.find({providerId: {$ne: null}, deadline: {$gte: new Date()}})
        if (projectsList.length) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(projectsList))
            res.status(200).json({
                message: "Projects fetched successfully",
                projects: projectsList
            })
        }
        else {
            res.status(404).json({
                message: "No projects found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getProjectForMe(req, res) {
    try {
        const userId = req.user.id
        const id = req.query.projectId
        const cacheKey = id ? `projects:for:v2:${userId}:${id}` : `projects:for:v2:${userId}:all`

        const cachedProject = await redisClient.get(cacheKey)
        if (cachedProject) {
            return res.status(200).json({
                message: "Project fetched successfully",
                project: JSON.parse(cachedProject)
            })
        }

        const project = id
            ? await projects.findOne({ _id: id, providerId: userId })
            : await projects.find({ providerId: userId })

        if (project && (!Array.isArray(project) || project.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(project))
            return res.status(200).json({
                message: "Project fetched successfully",
                project
            })
        }

        return res.status(404).json({
            message: "Project not found"
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getProjectByMe(req, res) {
    try {
        const userId = req.user.id
        const id = req.query.projectId
        const cacheKey = id ? `projects:by:v2:${userId}:${id}` : `projects:by:v2:${userId}:all`

        const cachedProject = await redisClient.get(cacheKey)
        if (cachedProject) {
            return res.status(200).json({
                message: "Project fetched successfully",
                project: JSON.parse(cachedProject)
            })
        }

        const project = id
            ? await projects.findOne({ _id: id, clientId: userId })
            : await projects.find({ clientId: userId })

        if (project && (!Array.isArray(project) || project.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(project))
            return res.status(200).json({
                message: "Project fetched successfully",
                project
            })
        }

        return res.status(404).json({
            message: "Project not found"
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function markProjectCompleted(req, res) {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await projects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const userId = req.user._id?.toString();
        const wasCompleted = project.isCompleted;
        if (project.clientId?.toString() === userId) {
            project.markedCompletedByClient = true;
        } else if (project.providerId?.toString() === userId) {
            project.markedCompletedByProvider = true;
        } else {
            return res.status(403).json({ message: "You cannot mark this project as completed" });
        }

        project.isCompleted = project.markedCompletedByClient && project.markedCompletedByProvider;
        await project.save();

        if (!wasCompleted && project.isCompleted && project.providerId) {
            const providerProfile = await profiles.findOne({ userId: project.providerId });
            if (providerProfile) {
                providerProfile.completedGigs = (Number(providerProfile.completedGigs) || 0) + 1;
                await providerProfile.save();
                await invalidateCache(["profiles*", "profiles:*"])
            }
        }

        await invalidateCache(["projects*", "projects:*"])

        return res.status(200).json({
            message: "Project completion updated",
            project
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteProject(req, res) {
    try {
        const id = req.params.id || req.query.projectId || req.body.projectId
        const project = await projects.deleteOne({ _id: id })

        if (project.deletedCount) {
            await invalidateCache(["projects*", "projects:*"])
            res.status(200).json({
                message: "Project deleted successfully"
            })
        }
        else {
            res.status(404).json({
                message: "Project not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getFilteredProjects(req, res) {
    try {
        const {price, category,skills_needed} = req.query
        const filters = {}
        if (price) filters.price = { $lte: Number(price) }
        if (category) filters.category = category
        if (skills_needed) filters.skills_needed = { $in: skills_needed.split(',') }

        const cacheKey = `projects:filtered:${JSON.stringify(filters)}`
        const cachedProjects = await redisClient.get(cacheKey)
        if (cachedProjects) {
            return res.status(200).json({
                message: "Projects fetched successfully",
                projects: JSON.parse(cachedProjects)
            })
        }

        const filteredProjects = await projects.find(filters)

        if (filteredProjects.length) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(filteredProjects))
            res.status(200).json({
                message: "Projects fetched successfully",
                projects: filteredProjects
            })
        }
        else {
            res.status(404).json({
                message: "No projects found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export default {
    submitProject,
    getProject,
    getProjectForMe,
    getProjectByMe,
    deleteProject,
    getAllProjects,
    getFilteredProjects,
    markProjectCompleted
}
