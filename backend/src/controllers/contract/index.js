import contracts from "../../models/Contract.model.js"
import profiles from "../../models/Profile.model.js"
import redisClient, { invalidateCache } from "../../database/redis.js"
async function submitContract(req, res) {
    try {

        const contract = await contracts.create(req.body)

        await invalidateCache(["contracts*", "contracts:*"])

        res.status(201).json({
            message: "Contract submitted successfully",
            contract
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getContractForMe(req, res) {
    try {
        const userId = req.user.id
        const id = req.query.id
        const cacheKey = id ? `contracts:for:${userId}:${id}` : `contracts:for:${userId}:all`

        const cachedContract = await redisClient.get(cacheKey)
        if (cachedContract) {
            return res.status(200).json({
                message: "Contract fetched successfully",
                contract: JSON.parse(cachedContract)
            })
        }

        const contract = id
            ? await contracts.findOne({ _id: id, providerId: userId })
            : await contracts.find({ providerId: userId })

        if (contract &&  (!Array.isArray(contract) || contract.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(contract));
            return res.status(200).json({
                message: "Contract fetched successfully",
                contract
            })
        }

        return res.status(404).json({
            message: "Contract not found"
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getContractByMe(req, res) {
    try {
        const userId = req.user.id
        const id = req.query.id
        const cacheKey = id ? `contracts:by:${userId}:${id}` : `contracts:by:${userId}:all`

        const cachedContract = await redisClient.get(cacheKey)
        if (cachedContract) {
            return res.status(200).json({
                message: "Contract fetched successfully",
                contract: JSON.parse(cachedContract)
            })
        }

        const contract = id
            ? await contracts.findOne({ _id: id, clientId: userId })
            : await contracts.find({ clientId: userId })

        if (contract && (!Array.isArray(contract) || contract.length)) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(contract));
            return res.status(200).json({
                message: "Contract fetched successfully",
                contract
            })
        }

        return res.status(404).json({
            message: "Contract not found"
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


async function markContractCompleted(req, res) {
    try {
        const { contractId } = req.body;
        if (!contractId) {
            return res.status(400).json({ message: "Contract ID is required" });
        }

        const contract = await contracts.findById(contractId);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }

        const userId = req.user._id?.toString();
        const wasCompleted = contract.isCompleted;
        if (contract.clientId?.toString() === userId) {
            contract.markedCompletedByClient = true;
        } else if (contract.providerId?.toString() === userId) {
            contract.markedCompletedByProvider = true;
        } else {
            return res.status(403).json({ message: "You cannot mark this contract as completed" });
        }

        contract.isCompleted = contract.markedCompletedByClient && contract.markedCompletedByProvider;
        await contract.save();

        if (!wasCompleted && contract.isCompleted && contract.providerId) {
            const providerProfile = await profiles.findOne({ userId: contract.providerId });
            if (providerProfile) {
                providerProfile.completedGigs = (Number(providerProfile.completedGigs) || 0) + 1;
                await providerProfile.save();
                await invalidateCache(["profiles*", "profiles:*"])
            }
        }

        await invalidateCache(["contracts*", "contracts:*"])

        return res.status(200).json({
            message: "Contract completion updated",
            contract
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteContract(req, res) {
    try {
        const id = req.params.id || req.query.contractId || req.body.contractId
        const contract = await contracts.deleteOne({ _id: id })

        if (contract.deletedCount) {
            await invalidateCache(["contracts*", "contracts:*"])
            res.status(200).json({
                message: "Contract deleted successfully"
            })
        }
        else {
            res.status(404).json({
                message: "Contract not found"
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export default {
    submitContract,
    getContractForMe,
    getContractByMe,
    markContractCompleted,
    deleteContract
}
