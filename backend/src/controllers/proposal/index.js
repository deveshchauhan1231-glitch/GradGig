import proposals from "../../models/Proposal.model.js"
import redisClient, { invalidateCache } from "../../database/redis.js"
import contracts from "../../models/Contract.model.js"
import projects from "../../models/Project.model.js"

async function invalidateProposalCache() {
    try {
        await invalidateCache(["proposals*", "proposals:*"]);
    } catch (error) {
        console.error("Failed to invalidate proposal cache", error);
    }
}

async function submitProposal(req, res) {
    try {
        const proposal = await proposals.create({
            ...req.body,
            providerId: req.user.id
        })

        await invalidateProposalCache();

        res.status(201).json({
            message: "Proposal submitted successfully",
            proposal
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getProposal(req, res) {
    try {
        const id = req.params.id || req.query.proposalId
        const cacheKey = id ? `proposals:${id}` : `proposals:all`
        const cachedProposal = await redisClient.get(cacheKey)
        if (cachedProposal) {
            return res.status(200).json({
                message: "Proposal fetched successfully",
                proposal: JSON.parse(cachedProposal)
            })
        }
        const proposal = id ? await proposals.findById(id) : await proposals.find()

        if (proposal && (!Array.isArray(proposal) || proposal.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(proposal))
            res.status(200).json({
                message: "Proposal fetched successfully",
                proposal
            })
        }
        else {
            res.status(404).json({
                message: "Proposal not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function deleteProposal(req, res) {
    try {
        const id = req.params.id || req.query.proposalId || req.body.proposalId
        const type=req.params.type || req.query.proposalType
        const proposal = await proposals.deleteOne({ _id: id })

        if (proposal.deletedCount) {
            await invalidateProposalCache();
            res.status(200).json({
                message: "Proposal deleted successfully"
            })
        }
        else {
            res.status(404).json({
                message: "Proposal not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function acceptProposal(req, res) {
    try {
        const id = req.params.id || req.query.proposalId
        const type=req.params.type || req.query.proposalType
        const proposal = await proposals.findOneAndUpdate({ _id: id }, { $set: { verdict: true, isRejected: false } }, { new: true })
        if (!proposal) {
            return res.status(404).json({
                message: "Proposal not found"
            })
        }

        let contract;
        if(type==="forProject")
        {
            contract=await contracts.create({providerId:proposal.providerId,clientId:proposal.clientId,projectId:proposal.projectId,title:proposal.title,description:proposal.description,price:proposal.price,deadline:proposal.deadline})

        }
        else{
            contract=await contracts.create({providerId:req.user.id,clientId:proposal.clientId,projectId:proposal.projectId,title:proposal.title,description:proposal.description,price:proposal.price,deadline:proposal.deadline})

        }

        if (proposal.projectId) {
            await projects.updateOne(
                { _id: proposal.projectId },
                { $set: { providerId: proposal.providerId } }
            )
        }
        
        if (proposal && contract) {
            await invalidateProposalCache();
            res.status(200).json({
                message:"Contract converted successfully"
            })
        }
        else{
            res.status(404).json({
                message: "Proposal not found"
            })
        }
    }catch(err)
    {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getProposalForMe(req, res) {
    try {
        const userId = req.user.id
        const id = req.query.proposalId
        const cacheKey = id ? `proposals:for:${userId}:${id}` : `proposals:for:${userId}:all`

        const cachedProposal = await redisClient.get(cacheKey)
        if (cachedProposal) {
            return res.status(200).json({
                message: "Proposal fetched successfully",
                proposal: JSON.parse(cachedProposal)
            })
        }

        const proposal = id
            ? await proposals.findOne({ _id: id, providerId: userId, isRejected: { $ne: true } })
            : await proposals.find({ providerId: userId, isRejected: { $ne: true } })

        if (proposal && (!Array.isArray(proposal) || proposal.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(proposal))
            return res.status(200).json({
                message: "Proposal fetched successfully",
                proposal
            })
        }

        return res.status(404).json({
            message: "Proposal not found"
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function rejectProposal(req, res) {
    try {
        const id = req.params.id || req.query.proposalId || req.body.proposalId
        const proposal = await proposals.findOneAndUpdate(
            { _id: id },
            { $set: { verdict: false, isRejected: true } },
            { new: true }
        )

        if (!proposal) {
            return res.status(404).json({
                message: "Proposal not found"
            })
        }

        await invalidateProposalCache();

        return res.status(200).json({
            message: "Proposal rejected successfully",
            proposal
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getProposalByMe(req, res) {
    try {
        const userId = req.user.id
        const id = req.query.proposalId
        const cacheKey = id ? `proposals:by:${userId}:${id}` : `proposals:by:${userId}:all`

        const cachedProposal = await redisClient.get(cacheKey)
        if (cachedProposal) {
            return res.status(200).json({
                message: "Proposal fetched successfully",
                proposal: JSON.parse(cachedProposal)
            })
        }

        const proposal = id
            ? await proposals.findOne({ _id: id, clientId: userId })
            : await proposals.find({ clientId: userId })

        if (proposal && (!Array.isArray(proposal) || proposal.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(proposal))
            return res.status(200).json({
                message: "Proposal fetched successfully",
                proposal
            })
        }

        return res.status(404).json({
            message: "Proposal not found"
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export default {
    submitProposal,
    getProposal,
    getProposalForMe,
    getProposalByMe,
    deleteProposal,
    acceptProposal,
    rejectProposal
}
